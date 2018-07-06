"use strict";
const fs = require("fs-extra");
const path = require("path");

const browserify = require("browserify");
const modernizr = require("modernizr");
const mustache = require("mustache");
const sass = require("node-sass");

const multi_yaml = require("./multi-yaml");


const data_directory = process.argv[2];
const output_directory = process.argv[3];

console.log("generator", data_directory, output_directory);

const data = multi_yaml.load(data_directory);

fs.emptydirSync(output_directory);

fs.copySync("skeleton", output_directory);

const modernizr_features = [
  ["test/es6/arrow"],
  ["test/es6/collections", "es6collections"],
  ["test/hashchange"],
  ["test/history"]
]

modernizr.build(
  {
    "minify": false,
    "classPrefix": "mdrn-",
    "options": [
      "domPrefixes",
      "prefixes",
      "addTest",
      "atRule",
      "hasEvent",
      "mq",
      "prefixed",
      "prefixedCSS",
      "prefixedCSSValue",
      "testAllProps",
      "testProp",
      "testStyles",
      "html5shiv",
      "setClasses"
    ],
    "feature-detects": Array.from(modernizr_features.map(([detect]) => detect))
  },
  function(result) {
    fs.outputFileSync(path.join(output_directory, "modernizr.js"), result)
  }
)

browserify("index.js").bundle(function(error, result) {
  if(error) {
    throw error
  } else {
    fs.outputFileSync(path.join(output_directory, "index.js"), result)
  }
})

sass.render(
  {
    data: '$modernizr-features: "' + modernizr_features.map(([detect, feature]) => ".mdrn-" + (feature || detect.split("/").slice(-1)[0])).join("") + '";\n\n@import "index.scss"'
  },
  function(error, result) {
    if(error) {
      throw error
    } else {
      fs.outputFileSync(path.join(output_directory, "index.css"), result.css)
    }
  }
);

function render(content_template, content_data, destination) {
  const static_content = mustache.render(fs.readFileSync(path.join("templates", "static_content", content_template), "utf8"), content_data);
  fs.outputFileSync(
    path.join(output_directory, destination),
    mustache.render(
      fs.readFileSync("templates/container.html", "utf8"),
      {static_content: static_content}
    )
  );
}

render("index.html", {}, "index.html");

for(const city_slug in data.cities) {
  const city = Object.assign({}, data.cities[city_slug], {slug: city_slug});

  const tags = (function() {
    var tags = [];
    for(const tag_slug in city.tags) {
      const tag = Object.assign({}, city.tags[tag_slug], {slug: tag_slug});
      tags.push(tag);
    }
    return tags.sort((t1, t2) => t1.display_order - t2.display_order).map(({slug, title}) => ({slug: slug, title: title}));
  })();

  render(
    "city/index.html",
    {
      city: city,
      tags: tags,
      first_week: {slug: "2018-W21"}  // @todo Compute instead of hard-coding
    },
    path.join(city_slug, "index.html")
  );

  // fs.ensureDirSync(output_directory + "/" + city_slug);

  // const events = new Set();
  // for(const tag_slug in city.events) {
  //   const tagged_events = city.events[tag_slug];

  //   tagged_events.forEach(event => events.add(event));
  // }

  // console.log(city_slug, events.size);
}
