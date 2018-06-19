var Splight = (function() {
  function make_events_cache() {
    return {
      days: {},

      get: function(start, end, callback) {
        var self = this;

        var required_keys = [];
        for(var d = start; d.isBefore(end); d.add(1, "day")) {
          required_keys.push(d.format("YYYY-MM-DD"));
        }

        var keys_to_fetch = new Set();
        for(var i = 0; i != required_keys.length; ++i) {
          var key = required_keys[i];
          if(!self.days.hasOwnProperty(key)) {
            keys_to_fetch.add(moment(key).startOf("isoWeek").format("GGGG-[W]WW"));
          }
        }

        if(keys_to_fetch.size > 0) {
          keys_to_fetch.forEach(function(k) {
            $.getJSON(
              "/reims/" + k + ".json",
              null,
              function(data) {
                keys_to_fetch.delete(k);
                for(day in data) {
                  var day_data = data[day];
                  self.days[day] = day_data;
                }
                if(keys_to_fetch.size == 0) {
                  self.call(required_keys, callback);
                }
              },
            )
          });
        } else {
          self.call(required_keys, callback);
        }
      },

      call: function(required_keys, callback) {
        var self = this;

        callback(required_keys.map(key => self.days[key]));
      }
    };
  }

  return {
    initialize: function(config) {
      var self = this;

      self.decrypt_key_sha = config.decrypt_key_sha;
      self.try_decrypt_key(Cookies.get("sp-decrypt-key"));

      self.is_admin = Cookies.getJSON("sp-is-admin");

      if(config.city) {
        self.city = config.city.slug;
      } else {
        self.city = null;
      }

      if(config.displayed_week) {
        self.displayed_week = config.displayed_week.start_date;
        self.first_week = config.first_week.start_date;
        self.week_after = config.week_after.start_date;
        self.events_cache = make_events_cache(self);
        var query = URI.parseQuery(URI.parse(window.location.href).query);
        self.display_all_tags = false;
        self.displayed_tags = new Set(Object.keys(query));
        if(self.displayed_tags.size == 0) {
          self.display_all_tags = true;
          self.displayed_tags = new Set($("input[name=displayed_tags]").map((x, y) => $(y).val()).toArray());
        }
      } else {
        self.displayed_week = null;
      }

      $("#sp-admin-enter").on("click", function() {
        // @todo Password-protect admin mode
        self.is_admin = true;
        self.update_browser();
      });
      $("#sp-admin-quit").on("click", function() {
        self.is_admin = false;
        self.update_browser();
      });
      $("#sp-admin-decrypt-key").on("change", function() {
        self.try_decrypt_key($(this).val());
        self.update_browser();
      });
      $("input[name=displayed_tags]").on("change", function() {
        self.displayed_tags = new Set($("input[name=displayed_tags]:checked").map((x, y) => $(y).val()).toArray());
        self.display_all_tags = $("input[name=displayed_tags]:not(:checked)").length == 0;
        self.update_browser();
      });

      if(self.displayed_week) {
        $("#sp-fullcalendar").fullCalendar({
          header: false,
          defaultDate: self.displayed_week,
          defaultView: "basicWeek",
          locale: "fr",
          allDaySlot: false,
          height: "auto",
          events: function(start, end, timezone, callback) {
            self.events_cache.get(start, end, function(eventss) {
              var events = [];
              var admin_only = false;
              for(var i = 0; i != eventss.length; ++i) {
                var day_data = eventss[i];
                if(day_data.encrypted) {
                  if(self.is_admin && self.decrypt_key) {
                    day_data = JSON.parse(CryptoJS.AES.decrypt(day_data.encrypted, self.decrypt_key).toString(CryptoJS.enc.Utf8));
                    admin_only = true;
                  } else {
                    day_data = [];
                  }
                }
                events = events.concat(day_data);
              }
              $("#sp-fullcalendar").toggleClass("sp-admin-only", admin_only);
              callback(events.filter(e => e.tags.some(t => self.displayed_tags.has(t))));
            });
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
      }

      self.update_browser(true);
    },

    try_decrypt_key: function(decrypt_key) {
      var self = this;

      if(CryptoJS.SHA1(decrypt_key).toString() == self.decrypt_key_sha) {
        self.decrypt_key = decrypt_key;
      } else {
        self.decrypt_key = undefined;
      }
    },

    update_browser: function(initial) {
      var self = this;

      self.update_admin();
      self.update_display_settings();
      if(!initial) self.update_calendar();
      self.update_links();
    },

    update_admin: function() {
      var self = this;

      Cookies.set("sp-is-admin", self.is_admin);
      $("#sp-admin").toggle(self.is_admin);
      if(self.decrypt_key) {
        Cookies.set("sp-decrypt-key", self.decrypt_key);
        $("#sp-admin-decrypt-key").val(self.decrypt_key);
      } else {
        Cookies.remove("sp-decrypt-key");
        $("#sp-admin-decrypt-key").val("");
      }
    },

    update_display_settings: function() {
      var self = this;

      $("input[name=displayed_tags]").each(function(index, input) {
        var input = $(input);
        input.prop("checked", self.display_all_tags || self.displayed_tags.has(input.val()));
      });
    },

    update_calendar: function() {
      var self = this;

      self.calendar.refetchEvents();
    },

    update_links: function() {
      var self = this;

      if(self.city) {
        var new_query = self.displayed_week ? (self.display_all_tags ? "" : Array.from(self.displayed_tags).join("&")) : undefined;

        function make_new_path(week) {
          return "/" + self.city + week.format("/GGGG-[W]WW/");
        }

        function update_link_class(kwds) {
          var links = $(kwds.selector);
          var new_path = make_new_path(kwds.week);
          links.prop("href", function(index, href) {
            var uri = URI(href);
            uri.path(new_path)
            if(self.displayed_week) uri.query(new_query);
            return uri.toString();
          });
          if(kwds.global_condition && kwds.non_admin_condition) {
            links.show();
            links.removeClass("sp-admin-only");
          } else if(kwds.global_condition && self.is_admin) {
            links.show();
            links.addClass("sp-admin-only");
          } else {
            links.hide();
          }
        }

        update_link_class({
          selector: ".sp-now-week-link",
          week: moment(),
          global_condition: true,
          non_admin_condition: true,
        });

        if(self.displayed_week) {
          history.replaceState(null, window.document.title, URI(window.location).path(make_new_path(self.displayed_week)).query(new_query).toString());

          var previous_week = self.displayed_week.clone().subtract(1, "week");
          update_link_class({
            selector: ".sp-previous-week-link",
            week: previous_week,
            global_condition: previous_week >= self.first_week,
            non_admin_condition: !moment().isSame(self.displayed_week, "isoWeek"),
          });

          var next_week = self.displayed_week.clone().add(1, "week");
          update_link_class({
            selector: ".sp-next-week-link",
            week: next_week,
            global_condition: next_week < self.week_after,
            non_admin_condition: !moment().add(4, "weeks").isSame(self.displayed_week, "isoWeek"),
          });
        }
      }
    },
  }
})();
