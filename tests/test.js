module("carto-map-component Tests", {
    setup: function() {
    }
});

test('test name', function() {
    equal(true, true, "Message");
});
test("2 plus 2 should equal 4", function() {
   var expected = 4;
   var result = (2 + 3);
   ok(result == expected,"2 plus 2 was not 4, universe broken. Good luck fixing that.");
});