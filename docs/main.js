var Splight = (function() {
  function make_event_source() {
    return [];
  }

  return {
    initialize: function(config) {
      this.city = config.city.slug;
      if(config.displayed_week) {
        this.displayed_week = config.displayed_week.start_date;
        this.first_week = config.first_week.start_date;
        this.week_after = config.week_after.start_date;
      } else {
        this.displayed_week = null;
      }

      this.fix_links();
    },

    fix_links: function() {
      var self = this;

      function make_week_path(m) {
        return "/" + self.city + m.format("/GGGG-[W]WW/");
      }

      function fix_link_class(kwds) {
        var links = $(kwds.selector);
        if(kwds.condition === undefined || kwds.condition) {
          var new_path = make_week_path(kwds.week);
          links.show();
          links.prop("href", function(index, href) {
            return URI(href).path(new_path).toString();
          });
        } else {
          links.hide();
        }
      }

      fix_link_class({selector: ".sp-now-week-link", week: moment()});

      if(self.displayed_week) {
        var previous_week = self.displayed_week.clone().subtract(1, "week");
        fix_link_class({
          selector: ".sp-previous-week-link",
          week: previous_week,
          condition: (
            previous_week >= self.first_week
            && !moment().isSame(self.displayed_week, "isoWeek")
          ),
        });

        var next_week = self.displayed_week.clone().add(1, "week");
        fix_link_class({
          selector: ".sp-next-week-link",
          week: next_week,
          condition: (
            next_week < self.week_after
            && !moment().add(4, "weeks").isSame(self.displayed_week, "isoWeek")
          ),
        });
      }
    },
  }
})();
