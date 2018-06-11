function set_location(uri) {
  History.replaceState(null, window.document.title, uri.toString());
}

function have_intersection(xs, ys) {
  for(var y of ys) {
    if(xs.has(y)) {
      return true;
    }
  }
  return false;
}

function initialize_week(config) {
  function get_tags_from_location() {
    var query = URI.parseQuery(URI.parse(window.location.href).query);
    var tags = [];
    for(var tag in config.tag_names) {
      if(_.has(query, tag)) {
        tags.push(tag);
      }
    }
    return tags;
  }

  function put_tags_in_location(tags) {
    tags = new Set(tags);
    function fix_query(data) {
      for(tag in config.tag_names) {
        if(tags.has(tag)) {
          data[tag] = null;
        } else {
          delete data[tag];
        }
      }
    }
    set_location(URI(window.location.href).search(fix_query));
    $("a.tagged").prop("href", function(index, href) {
      return URI(href).search(fix_query).toString();
    });
  }

  function get_tags_from_inputs() {
    var tags = [];
    $("#display_tags input").each(function() {
      var checkbox = $(this);
      if(checkbox.prop("checked")) {
        tags.push(checkbox.data("tag"));
      }
    });
    return tags;
  }

  function put_tags_in_inputs(tags) {
    $('#display_tags input').prop("checked", false);
    for(var tag of tags) {
      $('#display_tags input[data-tag="' + tag + '"]').prop("checked", true);
    }
  }

  function get_view_from_location() {
    var fragment = URI.parse(window.location.href).fragment;
    if(!fragment) {
      return {view: "agendaWeek"};
    }
    fragment = fragment.split("+");
    var range = (function (day) {
      switch(fragment[0]) {
        case "lundi": return config.days.lundi;
        case "mardi": return config.days.mardi;
        case "mercredi": return config.days.mercredi;
        case "jeudi": return config.days.jeudi;
        case "vendredi": return config.days.vendredi;
        case "samedi": return config.days.samedi;
        case "dimanche": return config.days.dimanche;
      }
    })(fragment[0]);
    if(!range) {
      return {view: "agendaWeek"};
    }
    var view = fragment.length > 1 && fragment[1] == "2" ? "agendaThreeDays" : "agendaDay";
    return {
      view: view,
      range: range,
      day: fragment[0],
    };
  }

  function get_view_from_form() {
    return {
      view: $("input[name=agenda_view]:checked").val(),
      // @todo Keep day when switching between agendaDay and agendaThreeDays
      range: config.days.lundi,
      day: "lundi",
    };
  }

  function set_view(calendar, view) {
    calendar.changeView(view.view, view.range);
    $("#agenda_views input[value=" + view.view + "]").prop("checked", true);
    var fragment = (function(view) {
      switch(view.view) {
        case "agendaDay":
          return view.day;
        case "agendaThreeDays":
          return view.day + "+2";
        default:
          return "";
      }
    })(view);
    if(fragment) {
      $(".previous_next_weeks_links").hide();
      $(".previous_next_days_links").show();
      var fragment_suffix = fragment.endsWith("+2") ? "+2" : "";
      var previous_fragment = (function() {
        switch(fragment.split("+")[0]) {
          case "mardi": return "lundi"
          case "mercredi": return "mardi"
          case "jeudi": return "mercredi"
          case "vendredi": return "jeudi"
          case "samedi": return "vendredi"
          case "dimanche": return "samedi"
        }
      })();
      var next_fragment = (function() {
        switch(fragment.split("+")[0]) {
          case "lundi": return "mardi"
          case "mardi": return "mercredi"
          case "mercredi": return "jeudi"
          case "jeudi": return "vendredi"
          case "vendredi": return "samedi"
          case "samedi": return "dimanche"
        }
      })();

      if(previous_fragment) {
        $(".previous_day_link").show();
        $(".previous_day_link").prop("href", function(index, href) {
          return URI(href).path(config.week_paths.current).fragment(previous_fragment + fragment_suffix).toString();
        });
      } else {
        if(config.week_paths.previous) {
          $(".previous_day_link").prop("href", function(index, href) {
            return URI(href).path(config.week_paths.previous).fragment("dimanche" + fragment_suffix).toString();
          });
        } else {
          $(".previous_day_link").hide();
        }
      }

      // @todo Hide .next_day_link at vendredi+2 (to avoid showing monday and tuesday of not-yet-published week)
      if(next_fragment) {
        $(".next_day_link").show();
        $(".next_day_link").prop("href", function(index, href) {
          return URI(href).path(config.week_paths.current).fragment(next_fragment + fragment_suffix).toString();
        });
      } else {
        if(config.week_paths.next) {
          $(".next_day_link").prop("href", function(index, href) {
            return URI(href).path(config.week_paths.next).fragment("lundi" + fragment_suffix).toString();
          });
        } else {
          $(".next_day_link").hide();
        }
      }
    } else {
      $(".previous_next_weeks_links").show();
      $(".previous_next_days_links").hide();
    }
    set_location(URI(window.location.href).fragment(fragment));
  }

  function eventSourceFunction(start, end, timezone, callback) {
    var displayed_tags = new Set(get_tags_from_inputs());
    callback(config.all_events.filter(event => have_intersection(event.tags, displayed_tags)));
  }

  $(function() {
    $(".script").show();

    put_tags_in_inputs(get_tags_from_location());
    put_tags_in_location(get_tags_from_inputs());

    $("#calendar").fullCalendar({
      header: false,
      defaultDate: config.defaultDate,
      defaultView: "agendaWeek",
      locale: "fr",
      allDaySlot: false,
      eventLimit: true,
      height: "auto",
      events: eventSourceFunction,
      views: {
        agendaThreeDays: {
          type: "agenda",
          duration: {days: 3},
        },
      },
    });

    var calendar = $('#calendar').fullCalendar('getCalendar');

    set_view(calendar, get_view_from_location());

    $("#display_tags input").on("change", function() {
      put_tags_in_location(get_tags_from_inputs());
      calendar.refetchEventSources(calendar.getEventSources());
    });

    $("#agenda_views input").on("change", function() {
      set_view(calendar, get_view_from_form());
    });
    $(window).on("hashchange", function() {
      set_view(calendar, get_view_from_location());
    });
  });
}
