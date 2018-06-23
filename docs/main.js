"use strict";

var Splight = (function() {
  function AdminMode({decrypt_key_sha, update_browser_callback}) {
    var self = this;

    self._decrypt_key_sha = decrypt_key_sha;

    function try_enable(decrypt_key, is_active) {
      var decrypt_key_is_valid = CryptoJS.SHA1(decrypt_key).toString() == self._decrypt_key_sha;

      if(decrypt_key_is_valid) {
        self._decrypt_key = decrypt_key;
        self._is_active = !!is_active;
      } else {
        self._decrypt_key = null;
        self._is_active = false;
      }

      return decrypt_key_is_valid;
    }

    var cookie = Cookies.getJSON("sp-admin-mode") || {};
    self._view_type = cookie.view_type || "basic";
    self._events_overlap = cookie.events_overlap || false;
    try_enable(cookie.decrypt_key, cookie.is_active);

    $("#sp-admin-mode-show-activation-modal").on("click", function() {
      if(self._decrypt_key) {
        self._is_active = !self._is_active;
        update_browser_callback();
      } else {
        $("#sp-admin-mode-activation-wrong-key").hide();
        $("#sp-admin-mode-activation-modal").modal("show");
      }
    });

    $("#sp-admin-mode-show-activation-modal").on("dblclick", function() {
      try_enable();
      update_browser_callback();
    });

    $("#sp-admin-mode-enable").on("click", function() {
      if(try_enable($("#sp-admin-mode-decrypt-key").val(), true)) {
        $("#sp-admin-mode-activation-modal").modal("hide");
        update_browser_callback();
      } else {
        $("#sp-admin-mode-activation-wrong-key").show();
      }
    });

    $("#sp-admin-mode-deactivate").on("click", function() {
      self._is_active = false;
      update_browser_callback();
    });

    $("#sp-admin-mode-view-type").on("change", function() {
      self._view_type = $(this).val();
      update_browser_callback();
    });

    $("#sp-admin-mode-agenda-view-overlap").on("change", function() {
      self._events_overlap = $(this).prop("checked");
      update_browser_callback();
    });
  };

  AdminMode.prototype = {
    update_browser: function() {
      var self = this;

      if(self._decrypt_key) {
        Cookies.set("sp-admin-mode", {
          decrypt_key: self._decrypt_key,
          is_active: self._is_active,
          view_type: self._view_type,
          events_overlap: self._events_overlap
        });
      } else {
        Cookies.remove("sp-admin-mode");
      }

      $("#sp-admin-mode-dashboard").toggle(self._is_active);

      $("#sp-admin-mode-view-type").val(self._view_type);

      $("#sp-admin-mode-agenda-view-settings").toggle(self._view_type == "agenda");
      $("#sp-admin-mode-agenda-view-overlap").prop("checked", self._events_overlap);
    },

    decrypt_json: function({message, default_value}) {
      var self = this;

      if(self._is_active) {
        return JSON.parse(CryptoJS.AES.decrypt(message, self._decrypt_key).toString(CryptoJS.enc.Utf8));
      } else {
        return default_value;
      }
    },

    get_view_type: function() {
      var self = this;

      return self._view_type;
    },

    get_events_overlap: function() {
      var self = this;

      return self._events_overlap;
    },

    is_active: function() {
      var self = this;

      return self._is_active;
    }
  };

  var EventsCache = (function() {
    const day_format = "YYYY-MM-DD";
    const week_format = "GGGG-[W]WW";
    const uri_template = URITemplate("/{city}/{week}.json");

    function make({city, admin_mode}) {
      var my = {
        queries: {},
        weeks: {},
        events: {},
      };

      function handle_fetch_success(week) {
        return function(data) {
          my.weeks[week] = {exists: true, data: data};
        };
      };

      function handle_fetch_error(week) {
        return function(jqXHR) {
          if(jqXHR.status == 404) {
            my.weeks[week] = {exists: false}
          } else {
            console.log("Unhandled fetch error:", week, jqXHR);
          }
        };
      };

      function fetch(start, end) {
        var queries = [];
        for(var day = start.clone(); day.isBefore(end); day.add(1, "day")) {
          var week = day.format(week_format);
          if(!my.weeks[week]) {
            if(!my.queries[week]) {
              console.log("Fetching", week);
              my.queries[week] = $.ajax({
                dataType: "json",
                url: uri_template.expand({city: city, week: week}),
                data: null,
                success: handle_fetch_success(week),
                error: handle_fetch_error(week),
              });
            }
            queries.push(my.queries[week]);
          };
        };
        return $.when(...queries);
      };

      function parse_events(day_data) {
        var admin_only = !!day_data.encrypted;
        if(admin_only) {
          day_data = admin_mode.decrypt_json({message: day_data.encrypted, default_value: undefined});
        }
        if(day_data) {
          return day_data.map(
            event => ({
              title: event.title,
              start: moment(event.start),
              end: event.end ? moment(event.end) : undefined,
              tags: event.tags,
              backgroundColor: event.backgroundColor,
              borderColor: event.borderColor,
              splight: {
                admin_only: admin_only,
              },
            })
          );
        }
      };

      function get_day_events(day) {
        const day_key = day.format(day_format);

        if(!my.events[day_key]) {
          var week = my.weeks[day.format(week_format)];
          if(week && week.exists) {
            for(var d in week.data) {
              my.events[d] = parse_events(week.data[d]);
            }
          }
        }

        if(my.events[day_key]) {
          return my.events[day_key];
        } else {
          return [];
        }
      };

      function get_events(start, end) {
        var events = [];
        for(var day = start.clone(); day.isBefore(end); day.add(1, "day")) {
          events = events.concat(get_day_events(day));
        };
        return events;
      };

      function moment_exists(moment) {
        return my.weeks[moment.format(week_format)].exists;
      };

      function fetch_then(start, end, handler) {
        fetch(start, end).then(handler, handler);
      };

      return {
        get_events: function({start, end, callback}) {
          fetch_then(
            start,
            end,
            function() {
              callback(get_events(start, end));
            },
          );
        },

        moment_exists: function({moment, callback}) {
          fetch_then(
            moment,
            moment.clone().add(1, "day"),
            function() {
              callback(moment, moment_exists(moment));
            },
          );
        }
      };
    };

    return {
      make: make,
    };
  })();

  function TagFilter({update_browser_callback}) {
    var self = this;

    var query = URI.parseQuery(URI.parse(window.location.href).query);
    var all_tags = new Set($("#sp-tag-filtering input").map((index, input) => $(input).val()).toArray());

    self._display_all_tags = false;
    self._displayed_tags = new Set(Object.keys(query).filter(tag => all_tags.has(tag)));
    if(self._displayed_tags.size == 0) {
      self._display_all_tags = true;
      self._displayed_tags = new Set($("#sp-tag-filtering input").map((x, y) => $(y).val()).toArray());
    }

    $("#sp-tag-filtering input").on("change", function() {
      self._displayed_tags = new Set($("#sp-tag-filtering input:checked").map((x, y) => $(y).val()).toArray());
      self._display_all_tags = $("#sp-tag-filtering input:not(:checked)").length == 0;
      update_browser_callback();
    });
  };

  TagFilter.prototype = {
    update_browser: function() {
      var self = this;

      $("#sp-tag-filtering input").each(function(index, input) {
        var input = $(input);
        input.prop("checked", self._display_all_tags || self._displayed_tags.has(input.val()));
      });

      var new_query = self._display_all_tags ? "" : Array.from(self._displayed_tags).join("&");

      $(".sp-tag-filtering-tagged-link").prop("href", function(index, href) {
        return URI(href).query(new_query).toString();
      })

      history.replaceState(null, window.document.title, URI(window.location.href).query(new_query).toString());
    },

    filter: function(events) {
      var self = this;

      if(self._display_all_tags) {
        return events;
      } else {
        return events.filter(e => e.tags.some(t => self._displayed_tags.has(t)));
      }
    },
  };

  function set_url_week(url, week) {
    var uri = new URI(url);
    var path_parts = uri.path().split("/");
    path_parts[2] = week.format("GGGG-[W]WW");
    uri.path(path_parts.join("/"));
    return uri.toString();
  }

  function update_city_week_links({links, week}) {
    links.prop("href", function(index, href) {
      return set_url_week(href, week);
    });
  }

  function set_url_three_days(url, three_days) {
    var uri = new URI(url);
    var path_parts = uri.path().split("/");
    path_parts[2] = three_days.format("YYYY-MM-DD") + "+2";
    uri.path(path_parts.join("/"));
    return uri.toString();
  }

  function update_city_three_days_links({links, three_days}) {
    links.prop("href", function(index, href) {
      return set_url_three_days(href, three_days);
    });
  }

  function set_url_day(url, day) {
    var uri = new URI(url);
    var path_parts = uri.path().split("/");
    path_parts[2] = day.format("YYYY-MM-DD");
    uri.path(path_parts.join("/"));
    return uri.toString();
  }

  function update_city_day_links({links, day}) {
    links.prop("href", function(index, href) {
      return set_url_day(href, day);
    });
  }

  function make_displayed_timespan({city_slug, admin_mode, update_browser_callback}) {
    var self = Object.create(DisplayedTimespan_prototype);

    self.admin_mode = admin_mode;

    self.start_date = null;
    self.duration = null
    var timespan = URI.parse(window.location.href).path.split("/")[2];
    switch(timespan.length) {
      case 8:
        self.start_date = moment(timespan);
        self.duration = "Week";
        break;
      case 12:
        self.start_date = moment(timespan.substring(0, 10));
        self.duration = "ThreeDays";
        break;
      case 10:
        self.start_date = moment(timespan);
        self.duration = "Day";
        break;
      default:
        return undefined;
    }

    self.events_cache = EventsCache.make({city: city_slug, admin_mode: admin_mode});

    self.tag_filter = new TagFilter({
      update_browser_callback: update_browser_callback,
    });

    self.displayed_events = [];

    $("#sp-fullcalendar").fullCalendar({
      header: false,
      defaultDate: self.start_date,
      defaultView: "basic" + self.duration,
      locale: "fr",
      allDaySlot: false,
      height: "auto",
      events: function(start, end, timezone, callback) {
        callback(self.displayed_events);
      },
      views: {
        agendaThreeDays: {
          type: "agenda",
          duration: {days: 3},
        },
        listThreeDays: {
          type: "list",
          duration: {days: 3},
        },
        basicThreeDays: {
          type: "basic",
          duration: {days: 3},
        },
      },
    });

    self.calendar = $("#sp-fullcalendar").fullCalendar("getCalendar");

    $(".sp-next-week-link").on("click", function() {
      self.start_date.add(1, "week");
      update_browser_callback();
      return false;
    });

    $(".sp-previous-week-link").on("click", function() {
      self.start_date.subtract(1, "week");
      update_browser_callback();
      return false;
    });

    $(".sp-now-week-link").on("click", function() {
      self.start_date = moment().startOf("week");
      self.duration = "Week";
      update_browser_callback();
      return false;
    });

    $(".sp-next-three-days-link").on("click", function() {
      self.start_date.add(1, "day");
      update_browser_callback();
      return false;
    });

    $(".sp-previous-three-days-link").on("click", function() {
      self.start_date.subtract(1, "day");
      update_browser_callback();
      return false;
    });

    $(".sp-now-three-days-link").on("click", function() {
      self.start_date = moment().startOf("day");
      self.duration = "ThreeDays";
      update_browser_callback();
      return false;
    });

    $(".sp-next-day-link").on("click", function() {
      self.start_date.add(1, "day");
      update_browser_callback();
      return false;
    });

    $(".sp-previous-day-link").on("click", function() {
      self.start_date.subtract(1, "day");
      update_browser_callback();
      return false;
    });

    $(".sp-now-day-link").on("click", function() {
      self.start_date = moment().startOf("day");
      self.duration = "Day";
      update_browser_callback();
      return false;
    });

    return self;
  };

  var DisplayedTimespan_prototype = {
    update_browser: function() {
      var self = this;

      self.calendar.changeView(self.admin_mode.get_view_type() + self.duration, self.start_date);
      self.calendar.option("slotEventOverlap", self.admin_mode.get_events_overlap())
      // @todo Display animated icon while waiting for responses
      self.events_cache.get_events({
        start: self.start_date,
        end: self.start_date.clone().add(self.duration == "Week" ? 7 : self.duration == "ThreeDays" ? 3 : 1, "days"),
        callback: function(events) {
          events = self.tag_filter.filter(events);

          if(events.some(e => e.splight.admin_only)) {
            if(!self.admin_mode.is_active()) {
              events = events.filter(e => !e.splight.admin_only);
            }
          }

          var minTime = Math.min(...events.map(function(e) {
            return e.start.diff(e.start.clone().startOf("day"));
          }));
          var maxTime = Math.max(...events.map(function(e) {
            var end = e.end ? moment(e.end) : e.start.clone().add(2, "hours");
            return end.diff(e.start.clone().startOf("day"));
          }));
          if(!isFinite(minTime)) {
            minTime = 18 * 3600000;
            maxTime = 20 * 3600000;
          }

          self.calendar.option("minTime", Math.floor(minTime / 3600000) * 3600000);
          self.calendar.option("maxTime", Math.ceil(maxTime / 3600000) * 3600000);

          self.displayed_events = events;
          self.calendar.refetchEvents();
        }
      });

      self.tag_filter.update_browser();

      if(self.duration == "Week") {
        $("#sp-timespan-title").text("Semaine du " + self.start_date.format("dddd Do MMMM YYYY"));
        history.replaceState(null, window.document.title, set_url_week(window.location.href, self.start_date));
      } else if(self.duration == "ThreeDays") {
        $("#sp-timespan-title").text("3 jours à partir du " + self.start_date.format("dddd Do MMMM YYYY"));
        history.replaceState(null, window.document.title, set_url_three_days(window.location.href, self.start_date));
      } else {
        $("#sp-timespan-title").text("Journée du " + self.start_date.format("dddd Do MMMM YYYY"));
        history.replaceState(null, window.document.title, set_url_day(window.location.href, self.start_date));
      }

      self.events_cache.moment_exists({
        moment: self.start_date.clone().subtract(1, "day"),
        callback: function(previous_day, exists) {
          var links = $(".sp-previous-week-link");
          links.toggle(
            self.duration == "Week" && exists
            && (self.admin_mode.is_active() || !moment().isSame(self.start_date, "isoWeek"))
          );
          update_city_week_links({links: links, week: previous_day});

          links = $(".sp-previous-three-days-link");
          links.toggle(
            self.duration == "ThreeDays" && exists
            && (self.admin_mode.is_active() || !moment().isSame(self.start_date, "day"))
          );
          update_city_three_days_links({links: links, three_days: previous_day});

          links = $(".sp-previous-day-link");
          links.toggle(
            self.duration == "Day" && exists
            && (self.admin_mode.is_active() || !moment().isSame(self.start_date, "day"))
          );
          update_city_day_links({links: links, day: previous_day});
        },
      });

      self.events_cache.moment_exists({
        moment: self.start_date.clone().add(1, "week"),
        callback: function(next_week, exists) {
          var links = $(".sp-next-week-link");
          links.toggle(
            self.duration == "Week" && exists
            && (self.admin_mode.is_active() || !moment().add(4, "weeks").isSame(self.start_date, "isoWeek"))
          );
          update_city_week_links({links: links, week: next_week});
        },
      });

      self.events_cache.moment_exists({
        moment: self.start_date.clone().add(3, "day"),
        callback: function(in_three_days, exists) {
          var links = $(".sp-next-three-days-link");
          links.toggle(
            self.duration == "ThreeDays" && exists
            && (self.admin_mode.is_active() || !moment().startOf("week").add(32, "days").isSame(self.start_date, "day"))
          );
          update_city_three_days_links({links: links, three_days: self.start_date.clone().add(1, "day")});
        },
      });

      self.events_cache.moment_exists({
        moment: self.start_date.clone().add(1, "day"),
        callback: function(next_day, exists) {
          var links = $(".sp-next-day-link");
          links.toggle(
            self.duration == "Day" && exists
            && (self.admin_mode.is_active() || !moment().startOf("week").add(34, "days").isSame(self.start_date, "day"))
          );
          update_city_day_links({links: links, day: next_day});
        },
      });
    },
  };

  function makeCity({admin_mode, update_browser_callback}) {
    var city_slug = URI.parse(window.location.href).path.split("/")[1];

    if(!city_slug) {
      return null;
    }

    var self = Object.create(City_prototype);

    self.displayed_timespan = make_displayed_timespan(
      {
        city_slug: city_slug,
        admin_mode: admin_mode,
        update_browser_callback: update_browser_callback,
      },
    );

    return self;
  };

  var City_prototype = {
    update_browser: function() {
      var self = this;

      update_city_week_links({links: $(".sp-now-week-link"), week: moment()});
      update_city_three_days_links({links: $(".sp-now-three-days-link"), three_days: moment()});
      update_city_day_links({links: $(".sp-now-day-link"), day: moment()});

      self.displayed_timespan && self.displayed_timespan.update_browser();
    },
  };

  return {
    initialize: function({decrypt_key_sha}) {
      var self = {};

      function update_browser() {
        self.admin_mode.update_browser();
        self.city && self.city.update_browser();
      };

      self.admin_mode = new AdminMode({
        decrypt_key_sha: decrypt_key_sha,
        update_browser_callback: update_browser,
      });

      self.city = makeCity({admin_mode: self.admin_mode, update_browser_callback: update_browser})

      update_browser(true);
    },
  }
})();
