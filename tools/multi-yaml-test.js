var assert = require("assert");

var m = require("./multi-yaml");

describe("multi-yaml", function() {
  describe("foo", function() {
    it("should return 42", function() {
      assert.equal(m.foo(), 42);
    });
  });
});
