"use strict";
const assert = require("assert").strict;
const fs = require("fs");
const path = require('path');

const yaml = require("js-yaml");

const multi_yaml = require("./multi-yaml");


describe("multi-yaml", function() {
  describe("load", function() {
    fs.readdirSync("multi-yaml-test/outputs").forEach(function(name) {
      const [base_name, status, ext] = name.split(".");
      const input_name = path.join("multi-yaml-test", "inputs", base_name);
      const output_name = path.join("multi-yaml-test", "outputs", name);
      const expected = yaml.safeLoad(fs.readFileSync(output_name));
      if(status == "ok") {
        it("should load '" + base_name + "'", function() {
          assert.deepEqual(multi_yaml.load(input_name), expected);
        });
      } else {
        it("should fail to load '" + base_name + "'", function() {
          try {
            multi_yaml.load(input_name);
          } catch(e) {
            assert.equal(e.message, expected);
            return;
          }
          assert.fail("Exception not raised");
        });
      }
    })
  })
});
