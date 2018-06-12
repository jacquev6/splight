function initialize_week(config) {
  function have_intersection(xs, ys) {
    for(var y of ys) {
      if(xs.has(y)) {
        return true;
      }
    }
    return false;
  }

  // Display settings
  var first_day = null;
  // All other display settings are stored in the #display_settings form.

  function next_day_url(url) {
    var uri = new URI(url);
    uri.path(config.week_paths.current);
    switch(first_day) {
      case "mardi":
        uri.fragment("mercredi");
        break
      case "mercredi":
        uri.fragment("jeudi");
        break
      case "jeudi":
        uri.fragment("vendredi");
        break
      case "vendredi":
        uri.fragment("samedi");
        break
      case "samedi":
        uri.fragment("dimanche");
        break
      case "dimanche":
        if(config.week_paths.next == undefined) {
          throw "no next day";
        } else {
          uri.path(config.week_paths.next).fragment("lundi");
        }
        break
      default:
        uri.fragment("mardi");
        break
    };
    return uri.toString();
  }

  function previous_day_url(url) {
    var uri = new URI(url);
    uri.path(config.week_paths.current);
    switch(first_day) {
      case "mardi":
        uri.fragment("lundi");
        break
      case "mercredi":
        uri.fragment("mardi");
        break
      case "jeudi":
        uri.fragment("mercredi");
        break
      case "vendredi":
        uri.fragment("jeudi");
        break
      case "samedi":
        uri.fragment("vendredi");
        break
      case "dimanche":
        uri.fragment("samedi");
        break
      default:
        if(config.week_paths.previous == undefined) {
          throw "no previous day";
        } else {
          uri.path(config.week_paths.previous).fragment("dimanche");
        }
        break
    };
    return uri.toString();
  }

  function get_display_settings_from_location() {
    var location = URI.parse(window.location.href);
    $("#display_settings").deserialize(location.query);
    first_day = location.fragment;
  }

  function filter_events() {
    var displayed_tags = new Set($("#display_settings input[name=tag]:checked").map((x, y) => $(y).val()).toArray());
    return config.all_events.filter(event => have_intersection(event.tags, displayed_tags));
  }

  function apply_display_settings(calendar) {
    var new_uri = URI(window.location.href);
    new_uri.query($("#display_settings").serialize());  // @todo Remove parameters that have their default value?
    new_uri.fragment(first_day);
    History.replaceState(null, window.document.title, new_uri.toString());

    $(".tagged").prop("href", function(index, href) {
      return URI(href).query($("#display_settings").serialize());
    });

    $(".next_day_link").show();
    try {
      $(".next_day_link").prop("href", (index, href) => next_day_url(href));
    } catch {
      $(".next_day_link").hide();
    }

    $(".previous_day_link").show();
    try {
      $(".previous_day_link").prop("href", (index, href) => previous_day_url(href));
    } catch {
      $(".previous_day_link").hide();
    }

    var view_type = $("#display_settings input[name=view_type]:checked").val();
    var view_duration = (function () {
      switch($("#display_settings input[name=view_duration]:checked").val()) {
        case "1": return "Day"
        case "3": return "ThreeDays"
        default: return "Week"
      }
    })();
    calendar.changeView(view_type + view_duration, config.days[first_day]);

    $("#agenda_settings").toggle(view_type == "agenda");
    $(".previous_next_days_links").toggle(view_duration != "Week");
    $(".previous_next_weeks_links").toggle(view_duration == "Week");

    calendar.option("slotEventOverlap", $("#display_settings input[name=overlap]").is(":checked"));

    var events = filter_events();
    calendar.option("minTime", {hour: Math.min(...events.map(e => moment(e.start).hour())) - 1});
    // @todo Use max(e.end) + 1 (when e.end is populated)
    calendar.option("maxTime", {hour: Math.max(...events.map(e => moment(e.start).hour())) + 3});

    calendar.refetchEventSources(calendar.getEventSources());
  }

  function event_source(start, end, timezone, callback) {
    callback(filter_events());
  }

  $(function() {
    $(".script").show();

    get_display_settings_from_location();

    $("#calendar").fullCalendar({
      header: false,
      defaultDate: config.defaultDate,
      defaultView: "agendaWeek",
      locale: "fr",
      allDaySlot: false,
      height: "auto",
      events: event_source,
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

    var calendar = $('#calendar').fullCalendar('getCalendar');

    apply_display_settings(calendar);

    $("#display_settings input").on("change", function() {
      apply_display_settings(calendar);
    });
    $(window).on("hashchange", function() {
      get_display_settings_from_location();
      apply_display_settings(calendar);
    });
  });
}
