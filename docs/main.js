"use strict";

var Splight = (function() {
  function EventsCache() {
    var self = this;

    self._days = {};
  };

  EventsCache.prototype = {
    get: function({start, end, callback}) {
      var self = this;

      var required_keys = [];
      for(var d = start; d.isBefore(end); d.add(1, "day")) {
        required_keys.push(d.format("YYYY-MM-DD"));
      }

      var keys_to_fetch = new Set();
      for(var i = 0; i != required_keys.length; ++i) {
        var key = required_keys[i];
        if(!self._days.hasOwnProperty(key)) {
          keys_to_fetch.add(moment(key).startOf("isoWeek").format("GGGG-[W]WW"));
        }
      }

      function call_callback() {
        callback(required_keys.map(key => self._days[key]));
      }

      // @todo Display animated icon while waiting for responses
      // @todo Undertand why we request each .json file twice. Request only once.
      if(keys_to_fetch.size > 0) {
        keys_to_fetch.forEach(function(key) {
          $.getJSON(
            "/reims/" + key + ".json",
            null,
            function(data) {
              keys_to_fetch.delete(key);
              for(var day in data) {
                var day_data = data[day];
                self._days[day] = day_data;
              }
              if(keys_to_fetch.size == 0) {
                call_callback();
              }
            },
          );
        });
      } else {
        call_callback();
      }
    },
  };

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

    decorate: function(q, {show_if_inactive}) {
      var self = this;

      q.toggle(show_if_inactive || self._is_active);
      q.toggleClass("sp-admin-mode-only", self._is_active);
    },

    undecorate: function(q) {
      var self = this;

      q.show();
      q.removeClass("sp-admin-mode-only");
    },

    get_view_type: function() {
      var self = this;

      return self._view_type;
    },

    get_events_overlap: function() {
      var self = this;

      return self._events_overlap;
    },
  };

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

      history.replaceState(null, window.document.title, URI(window.location).query(new_query).toString());
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

  function DisplayedTimespan({displayed_week, displayed_day, first_monday, monday_after, admin_mode, update_browser_callback}) {
    var self = this;

    self.admin_mode = admin_mode;

    self.start_date = displayed_week ? displayed_week.start_date : displayed_day.date;
    self.duration = displayed_week ? "Week" : "Day";
    self.first_monday = first_monday;
    self.monday_after = monday_after;
    self.events_cache = new EventsCache();

    self.tag_filter = new TagFilter({
      update_browser_callback: update_browser_callback,
    });

    $("#sp-fullcalendar").fullCalendar({
      header: false,
      defaultDate: self.start_date,
      defaultView: "basic" + self.duration,
      locale: "fr",
      allDaySlot: false,
      height: "auto",
      events: function(start, end, timezone, callback) {
        self.events_cache.get({
          start: start,
          end: end,
          callback: function(eventss) {
            var events = [];
            var data_for_admin_only = false;
            for(var i = 0; i != eventss.length; ++i) {
              var day_data = eventss[i];
              if(day_data.encrypted) {
                day_data = self.admin_mode.decrypt_json({message: day_data.encrypted, default_value: []});
                data_for_admin_only = true;
              }
              events = events.concat(day_data);
            }
            if(data_for_admin_only) {
              self.admin_mode.decorate($("#sp-fullcalendar"), {show_if_inactive: true});
            }

            events = self.tag_filter.filter(events);

            var minTime = Math.min(...events.map(function(e) {
              // @todo Build moments in EventsCache (they are used here and in fullCalendar, thus constructed many times)
              var start = moment(e.start);
              return start.diff(start.clone().startOf("day"));
            }));
            var maxTime = Math.max(...events.map(function(e) {
              var start = moment(e.start);
              var end = e.end ? moment(e.end) : moment(e.start).add(2, "hours");
              return end.diff(start.clone().startOf("day"));
            }));
            if(!isFinite(minTime)) {
              minTime = 18 * 3600000;
              maxTime = 20 * 3600000;
            }

            self.calendar.option("minTime", Math.floor(minTime / 3600000) * 3600000);
            self.calendar.option("maxTime", Math.ceil(maxTime / 3600000) * 3600000);

            callback(events);
          },
        });
      },
      /*views: {
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
      },*/
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
  };

  DisplayedTimespan.prototype = {
    update_browser: function() {
      var self = this;

      self.calendar.changeView(self.admin_mode.get_view_type() + self.duration, self.start_date);
      self.calendar.option("slotEventOverlap", self.admin_mode.get_events_overlap())
      self.calendar.refetchEvents();

      self.tag_filter.update_browser();

      if(self.duration == "Week") {
        $("#sp-timespan-title").text("Semaine du " + self.start_date.format("dddd Do MMMM YYYY"));
        history.replaceState(null, window.document.title, set_url_week(window.location, self.start_date));
      } else {
        $("#sp-timespan-title").text("Journée du " + self.start_date.format("dddd Do MMMM YYYY"));
        history.replaceState(null, window.document.title, set_url_day(window.location, self.start_date));
      }

      function update_week_links({links, week, global_condition, non_admin_condition}) {
        update_city_week_links({links: links, week: week});
        if(global_condition) {
          if(non_admin_condition) {
            self.admin_mode.undecorate(links);
          } else {
            self.admin_mode.decorate(links, {show_if_inactive: false});
          }
        } else {
          links.hide();
        }
      }

      var previous_week = self.start_date.clone().subtract(1, "week");
      update_week_links({
        links: $(".sp-previous-week-link"),
        week: previous_week,
        global_condition: self.duration == "Week" && previous_week >= self.first_monday,
        non_admin_condition: !moment().isSame(self.start_date, "isoWeek"),
      });

      var next_week = self.start_date.clone().add(1, "week");
      update_week_links({
        links: $(".sp-next-week-link"),
        week: next_week,
        global_condition: self.duration == "Week" && next_week < self.monday_after,
        non_admin_condition: !moment().add(4, "weeks").isSame(self.start_date, "isoWeek"),
      });

      function update_day_links({links, day, global_condition, non_admin_condition}) {
        update_city_day_links({links: links, day: day});
        if(global_condition) {
          if(non_admin_condition) {
            self.admin_mode.undecorate(links);
          } else {
            self.admin_mode.decorate(links, {show_if_inactive: false});
          }
        } else {
          links.hide();
        }
      }

      var previous_day = self.start_date.clone().subtract(1, "day");
      update_day_links({
        links: $(".sp-previous-day-link"),
        day: previous_day,
        global_condition: self.duration == "Day" && previous_day >= self.first_monday,
        non_admin_condition: !moment().isSame(self.start_date, "day"),
      });

      var next_day = self.start_date.clone().add(1, "day");
      update_day_links({
        links: $(".sp-next-day-link"),
        day: next_day,
        global_condition: self.duration == "Day" && next_day < self.monday_after,
        non_admin_condition: !moment().startOf("week").add(34, "days").isSame(self.start_date, "day"),
      });
    },
  };

  function City({city: {first_week, week_after, displayed_week, displayed_day}, admin_mode, update_browser_callback}) {
    var self = this;

    if(displayed_week || displayed_day) {
      self.displayed_timespan = new DisplayedTimespan(
        {
          displayed_week: displayed_week,
          displayed_day: displayed_day,
          first_monday: first_week.start_date,
          monday_after: week_after.start_date,
          admin_mode: admin_mode,
          update_browser_callback: update_browser_callback,
        },
      );
    }
  };

  City.prototype = {
    update_browser: function() {
      var self = this;

      update_city_week_links({links: $(".sp-now-week-link"), week: moment()});
      update_city_day_links({links: $(".sp-now-day-link"), day: moment()});

      self.displayed_timespan && self.displayed_timespan.update_browser();
    },
  };

  return {
    initialize: function({decrypt_key_sha, city}) {
      var self = {};

      function update_browser() {
        self.admin_mode.update_browser();
        self.city && self.city.update_browser();
      };

      self.admin_mode = new AdminMode({
        decrypt_key_sha: decrypt_key_sha,
        update_browser_callback: update_browser,
      });

      if(city) {
        self.city = new City({city: city, admin_mode: self.admin_mode, update_browser_callback: update_browser})
      }

      update_browser(true);
    },
  }
})();
