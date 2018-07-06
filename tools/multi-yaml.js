"use strict";
const fs = require("fs");
const path = require('path');

const yaml = require("js-yaml");


function merge_data(data, new_data) {
  if(!data) {
    return new_data;
  } else if(Array.isArray(data) && Array.isArray(new_data)) {
    return data.concat(new_data);
  } else if(Array.isArray(data) && typeof(new_data) == "object") {
    for(const k in new_data) {
      data.push(new_data[k]);
    }
    return data
  } else if(typeof(data) == "object" && typeof(new_data) == "object") {
    for(const k in new_data) {
      const v = data[k];
      if(v) {
        data[k] = merge_data(v, new_data[k]);
      } else {
        data[k] = new_data[k];
      }
    }
    return data;
  } else {
    throw new Error("Types incompatible for merging: " + typeof(data) + " and " + typeof(new_data));
  }
}

function load(dir_name) {
  const extensions = [".json", ".yml", ".yaml"];
  const no_data_to_load = "No data to load";

  const [is_file, file_contents] = (function() {
    var is_file = false;
    const file_contents = [];

    extensions.forEach(function(ext) {
      [dir_name + ext, dir_name + "/" + ext].forEach(function(file_name) {
        try {
          file_contents.push(fs.readFileSync(file_name));
          is_file = true;
        } catch {
        }
      });
    });

    return [is_file, file_contents];
  })();

  const [is_directory, directory_contents] = (function() {
    try {
      return [true, fs.readdirSync(dir_name)];
    } catch {
      return [false, []];
    }
  })();

  var data = null;

  file_contents.forEach(function(contents) {
    data = merge_data(data, yaml.safeLoad(contents));
  });

  if(is_directory) {
    const new_data = {};
    directory_contents.map(name => {
      const key = (function() {
        const [radix, ext] = name.split(".");
        if(extensions.indexOf("." + ext) != -1) {
          return radix;
        } else {
          return name;
        }
      })();

      if(key) {
        try {
          new_data[key] = load(dir_name + "/" + key);
        } catch(e) {
          if(e.message != no_data_to_load) {
            throw e;
          }
        }
      }
    });
    data = merge_data(data, new_data);
  };

  if(is_file || is_directory) {
    return data;
  } else {
    throw new Error(no_data_to_load);
  }
}

exports.load = load;
