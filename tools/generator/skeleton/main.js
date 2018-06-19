var Splight = (function() {
  function make_event_source() {
    return [];
  }

  return {
    initialize: function(config) {
      var self = this;

      self.is_admin = Cookies.getJSON("admin");

      if(config.city) {
        self.city = config.city.slug;
      } else {
        self.city = null;
      }

      if(config.displayed_week) {
        self.displayed_week = config.displayed_week.start_date;
        self.first_week = config.first_week.start_date;
        self.week_after = config.week_after.start_date;
      } else {
        self.displayed_week = null;
      }

      // @todo Password-protect admin mode
      $("#sp-admin-enter").on("click", function() {self.is_admin = true; self.update_browser()});
      $("#sp-admin-quit").on("click", function() {self.is_admin = false; self.update_browser()});

      if(self.displayed_week) {
        $("#sp-fullcalendar").fullCalendar({
          header: false,
          defaultDate: self.displayed_week,
          defaultView: "basicWeek",
          locale: "fr",
          allDaySlot: false,
          height: "auto",
          events: make_event_source(),
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

      self.update_browser();
    },

    update_browser: function() {
      var self = this;

      self.fix_admin();
      self.fix_links();
    },

    fix_admin: function() {
      var self = this;

      Cookies.set("admin", self.is_admin);
      $("#sp-admin").toggle(self.is_admin);
    },

    fix_links: function() {
      var self = this;

      if(self.city) {
        function fix_link_class(kwds) {
          var links = $(kwds.selector);
          var new_path = "/" + self.city + kwds.week.format("/GGGG-[W]WW/");
          links.prop("href", function(index, href) {
            return URI(href).path(new_path).toString();
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

        fix_link_class({
          selector: ".sp-now-week-link",
          week: moment(),
          global_condition: true,
          non_admin_condition: true,
        });

        if(self.displayed_week) {
          var previous_week = self.displayed_week.clone().subtract(1, "week");
          fix_link_class({
            selector: ".sp-previous-week-link",
            week: previous_week,
            global_condition: previous_week >= self.first_week,
            non_admin_condition: !moment().isSame(self.displayed_week, "isoWeek"),
          });

          var next_week = self.displayed_week.clone().add(1, "week");
          fix_link_class({
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
