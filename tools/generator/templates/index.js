(function() {
  "use strict";

  var AdminMode = (function() {
    function make({update_browser_callback}) {
      var my = {};

      function try_enable(decrypt_key, is_active) {
        var decrypt_key_is_valid = CryptoJS.SHA1(decrypt_key).toString() == "{{ decrypt_key_sha }}";

        if(decrypt_key_is_valid) {
          my.decrypt_key = decrypt_key;
          my.is_active = !!is_active;
        } else {
          my.decrypt_key = null;
          my.is_active = false;
        }

        return decrypt_key_is_valid;
      }

      var cookie = Cookies.getJSON("sp-admin-mode") || {};
      my.view_type = cookie.view_type || "basic";
      my.events_overlap = cookie.events_overlap || false;
      try_enable(cookie.decrypt_key, cookie.is_active);

      $("#sp-admin-mode-show-activation-modal").on("click", function() {
        if(my.decrypt_key) {
          my.is_active = !my.is_active;
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
        my.is_active = false;
        update_browser_callback();
      });

      $("#sp-admin-mode-view-type").on("change", function() {
        my.view_type = $(this).val();
        update_browser_callback();
      });

      $("#sp-admin-mode-agenda-view-overlap").on("change", function() {
        my.events_overlap = $(this).prop("checked");
        update_browser_callback();
      });

      function update_browser() {
        if(my.decrypt_key) {
          Cookies.set("sp-admin-mode", {
            decrypt_key: my.decrypt_key,
            is_active: my.is_active,
            view_type: my.view_type,
            events_overlap: my.events_overlap
          });
        } else {
          Cookies.remove("sp-admin-mode");
        }

        $("#sp-admin-mode-dashboard").toggle(my.is_active);

        $("#sp-admin-mode-view-type").val(my.view_type);

        $("#sp-admin-mode-agenda-view-settings").toggle(my.view_type == "agenda");
        $("#sp-admin-mode-agenda-view-overlap").prop("checked", my.events_overlap);
      }

      function decrypt_json({message, default_value}) {
        if(my.is_active) {
          return JSON.parse(CryptoJS.AES.decrypt(message, my.decrypt_key).toString(CryptoJS.enc.Utf8));
        } else {
          return default_value;
        }
      }

      return {
        update_browser: update_browser,
        decrypt_json: decrypt_json,
        get_view_type: () => my.view_type,
        get_events_overlap: () => my.events_overlap,
        is_active: () => my.is_active,
      }
    };

    return {
      make: make,
    };
  })();

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
          day_data = admin_mode.decrypt_json({message: day_data.encrypted, default_value: null});
        }
        if(day_data) {
          return day_data.map(
            event => ({
              title: event.title,
              start: moment(event.start),
              end: event.end ? moment(event.end) : null,
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

  var TagFilter = (function() {
    function make({update_browser_callback}) {
      var my = {};

      var query = URI.parseQuery(URI.parse(window.location.href).query);
      var all_tags = new Set($("#sp-tag-filtering input").map((index, input) => $(input).val()).toArray());

      my.display_all_tags = false;
      my.displayed_tags = new Set(Object.keys(query).filter(tag => all_tags.has(tag)));
      if(my.displayed_tags.size == 0) {
        my.display_all_tags = true;
        my.displayed_tags = new Set($("#sp-tag-filtering input").map((x, y) => $(y).val()).toArray());
      }

      $("#sp-tag-filtering input").on("change", function() {
        my.displayed_tags = new Set($("#sp-tag-filtering input:checked").map((x, y) => $(y).val()).toArray());
        my.display_all_tags = $("#sp-tag-filtering input:not(:checked)").length == 0;
        update_browser_callback();
      });

      function update_browser() {
        $("#sp-tag-filtering input").each(function(index, input) {
          var input = $(input);
          input.prop("checked", my.display_all_tags || my.displayed_tags.has(input.val()));
        });

        var new_query = my.display_all_tags ? "" : Array.from(my.displayed_tags).join("&");

        $(".sp-tag-filtering-tagged-link").prop("href", function(index, href) {
          return URI(href).query(new_query).toString();
        })

        history.replaceState(null, window.document.title, URI(window.location.href).query(new_query).toString());
      }

      function filter(events) {
        if(my.display_all_tags) {
          return events;
        } else {
          return events.filter(e => e.tags.some(t => my.displayed_tags.has(t)));
        }
      }

      return {
        update_browser: update_browser,
        filter: filter,
      }
    }

    return {
      make: make,
    }
  })();

  var DisplayedTimespan = (function() {
    var Week = (function() {
      return {
        name: "Week",
        duration_days: 7,
        increment_days: 7,
        fix_start_date: function(start_date) {
          start_date.startOf("isoWeek");
        },
        make_title: function(start_date) {
          return "Semaine du " + start_date.format("dddd Do MMMM");
        },
        previous_link_text: "Semaine précédente",
        next_link_text: "Semaine suivante",
        now_1_link_text: "Cette semaine",
        now_2_link_text: "La semaine prochaine",
        get_now_1_date: function() {
          return moment().startOf("isoWeek");
        },
        get_now_2_date: function() {
          return moment().startOf("isoWeek").add(7, "days");
        },
        fix_url: function(url, start_date) {
          var uri = new URI(url);
          var path_parts = uri.path().split("/");
          path_parts[2] = start_date.format("GGGG-[W]WW");
          uri.path(path_parts.join("/"));
          return uri.toString();
        },
        date_is_public: function(start_date) {
          return (
            start_date.isSameOrAfter(moment().startOf("isoWeek"))
            && start_date.isBefore(moment().startOf("isoWeek").add(35, "days"))
          );
        },
      }
    })();

    var ThreeDays = (function() {
      return {
        name: "ThreeDays",
        duration_days: 3,
        increment_days: 1,
        fix_start_date: function(start_date) {
          start_date.startOf("day");
        },
        make_title: function(start_date) {
          return "3 jours à partir du " + start_date.format("dddd Do MMMM");
        },
        previous_link_text: "Jours précédents",
        next_link_text: "Jours suivants",
        now_1_link_text: "Ces 3 jours",
        now_2_link_text: "Le week-end prochain",
        get_now_1_date: function() {
          return moment().startOf("day");
        },
        get_now_2_date: function() {
          return moment().add(3, "days").startOf("isoWeek").add(4, "days");
        },
        fix_url: function(url, start_date) {
          var uri = new URI(url);
          var path_parts = uri.path().split("/");
          path_parts[2] = start_date.format("YYYY-MM-DD") + "+2";
          uri.path(path_parts.join("/"));
          return uri.toString();
        },
        date_is_public: function(start_date) {
          return (
            start_date.isSameOrAfter(moment().startOf("isoWeek"))
            && start_date.isBefore(moment().startOf("isoWeek").add(33, "days"))
          );
        },
      }
    })();

    var Day = (function() {
      return {
        name: "Day",
        duration_days: 1,
        increment_days: 1,
        fix_start_date: function(start_date) {
          start_date.startOf("day");
        },
        make_title: function(date) {
          return "Journée du " + date.format("dddd Do MMMM");
        },
        previous_link_text: "Jour précédent",
        next_link_text: "Jour suivant",
        now_1_link_text: "Aujourd'hui",
        now_2_link_text: "Demain",
        get_now_1_date: function() {
          return moment().startOf("day");
        },
        get_now_2_date: function() {
          return moment().startOf("day").add(1, "day");
        },
        fix_url: function(url, date) {
          var uri = new URI(url);
          var path_parts = uri.path().split("/");
          path_parts[2] = date.format("YYYY-MM-DD");
          uri.path(path_parts.join("/"));
          return uri.toString();
        },
        date_is_public: function(start_date) {
          return (
            start_date.isSameOrAfter(moment().startOf("isoWeek"))
            && start_date.isBefore(moment().startOf("isoWeek").add(35, "days"))
          );
        },
      }
    })();

    function make({city_slug, admin_mode, update_browser_callback}) {
      var my = {};

      var timespan = URI.parse(window.location.href).path.split("/")[2];
      switch(timespan.length) {
        case 8:
          my.start_date = moment(timespan);
          my.duration = Week;
          break;
        case 12:
          my.start_date = moment(timespan.substring(0, 10));
          my.duration = ThreeDays;
          break;
        case 10:
          my.start_date = moment(timespan);
          my.duration = Day;
          break;
        default:
          return {
            update_browser: function() {
              $(".sp-now-week-link").prop("href", function(index, href) {
                return Week.fix_url(href, moment());
              });
            },
          }
      }

      my.events_cache = EventsCache.make({city: city_slug, admin_mode: admin_mode});

      my.tag_filter = TagFilter.make({update_browser_callback: update_browser_callback});

      my.displayed_events = [];

      $("#sp-fullcalendar").fullCalendar({
        header: false,
        defaultDate: my.start_date,
        defaultView: "basic" + my.duration.name,
        locale: "fr",
        allDaySlot: false,
        height: "auto",
        events: function(start, end, timezone, callback) {
          callback(my.displayed_events);
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

      my.calendar = $("#sp-fullcalendar").fullCalendar("getCalendar");

      $(".sp-timespan-previous").on("click", function() {
        my.start_date.subtract(my.duration.increment_days, "days");
        update_browser_callback();
        return false;
      });

      $(".sp-timespan-next").on("click", function() {
        my.start_date.add(my.duration.increment_days, "days");
        update_browser_callback();
        return false;
      });

      $(".sp-timespan-now-1").on("click", function() {
        my.start_date = my.duration.get_now_1_date();
        update_browser_callback();
        return false;
      });

      $(".sp-timespan-now-2").on("click", function() {
        my.start_date = my.duration.get_now_2_date();
        update_browser_callback();
        return false;
      });

      $("#sp-timespan-duration").on("change", function() {
        my.duration = eval($(this).val());
        my.duration.fix_start_date(my.start_date);
        update_browser_callback();
        return false;
      });

      function update_browser() {
        my.calendar.changeView(admin_mode.get_view_type() + my.duration.name, my.start_date);
        // @todo Display animated icon while waiting for responses
        my.events_cache.get_events({
          start: my.start_date,
          end: my.start_date.clone().add(my.duration.duration_days, "days"),
          callback: function(events) {
            events = my.tag_filter.filter(events);

            if(events.some(e => e.splight.admin_only)) {
              if(!admin_mode.is_active()) {
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

            my.calendar.option({
              minTime: Math.floor(minTime / 3600000) * 3600000,
              maxTime: Math.ceil(maxTime / 3600000) * 3600000,
              slotEventOverlap: admin_mode.get_events_overlap(),
            });

            my.displayed_events = events;
            my.calendar.refetchEvents();
          }
        });

        my.tag_filter.update_browser();

        $("#sp-timespan-title").text(my.duration.make_title(my.start_date));
        history.replaceState(null, window.document.title, my.duration.fix_url(window.location.href, my.start_date));
        $("#sp-timespan-duration").val(my.duration.name);

        var links = $(".sp-timespan-now-1");
        links.text(my.duration.now_1_link_text);
        links.prop("href", function(index, href) {
          return my.duration.fix_url(href, my.duration.get_now_1_date());
        });

        var links = $(".sp-timespan-now-2");
        links.text(my.duration.now_2_link_text);
        links.prop("href", function(index, href) {
          return my.duration.fix_url(href, my.duration.get_now_2_date());
        });

        my.events_cache.moment_exists({
          moment: my.start_date.clone().subtract(my.duration.increment_days, "days"),
          callback: function(previous_start_date, exists) {
            var links = $(".sp-timespan-previous");
            links.toggle(exists && (admin_mode.is_active() || my.duration.date_is_public(previous_start_date)));
            links.text("< " + my.duration.previous_link_text);
            links.prop("href", function(index, href) {
              return my.duration.fix_url(href, previous_start_date);
            });
          },
        });

        my.events_cache.moment_exists({
          moment: my.start_date.clone().add(my.duration.duration_days + my.duration.increment_days - 1, "days"),
          callback: function(next_last_date, exists) {
            var next_start_date = my.start_date.clone().add(my.duration.increment_days, "days");
            var links = $(".sp-timespan-next");
            links.toggle(exists && (admin_mode.is_active() || my.duration.date_is_public(next_start_date)));
            links.text(my.duration.next_link_text + " >");
            links.prop("href", function(index, href) {
              return my.duration.fix_url(href, next_start_date);
            });
          },
        });
      }

      return {
        update_browser: update_browser,
      }
    };

    return {
      make: make,
    }
  })();

  var City = (function() {
    function make({admin_mode, update_browser_callback}) {
      var city_slug = URI.parse(window.location.href).path.split("/")[1];

      if(city_slug) {
        var my = {};

        my.displayed_timespan = DisplayedTimespan.make({
          city_slug: city_slug,
          admin_mode: admin_mode,
          update_browser_callback: update_browser_callback,
        });

        function update_browser() {
          my.displayed_timespan.update_browser();
        }

        return {
          update_browser: update_browser,
        }
      } else {
        return {
          update_browser: () => undefined,
        }
      }
    }
    
    return {
      make: make,
    }
  })();

  $(function() {
    var my = {};

    function update_browser() {
      my.admin_mode.update_browser();
      my.city.update_browser();
    };

    my.admin_mode = AdminMode.make({update_browser_callback: update_browser});

    my.city = City.make({admin_mode: my.admin_mode, update_browser_callback: update_browser})

    update_browser();
  });
})();
