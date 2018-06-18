var Splight = {
  initialize: function(config) {
    this.now = moment();
    this.city = config.city.slug;

    this.fix_links();
  },

  fix_links: function() {
    var path = "/" + this.city + this.now.format("/GGGG-[W]WW/");
    $(".sp-now-week-link").prop("href", function(index, href) {
      return URI(href).path(path).toString();
    });
  },
}
