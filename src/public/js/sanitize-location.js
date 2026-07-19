(function () {
  function sanitize(input) {
    var cursorPos = input.selectionStart;
    var oldLength = input.value.length;
    var cleaned = input.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    input.value = cleaned;
    var removed = oldLength - cleaned.length;
    if (removed > 0 && cursorPos !== null) {
      var newPos = Math.max(0, cursorPos - (cursorPos > 0 ? removed : 0));
      input.setSelectionRange(newPos, newPos);
    }
  }

  var box = document.getElementById("boxNumber");
  var bay = document.getElementById("bayNumber");
  if (!box || !bay) return;
  box.addEventListener("input", function () {
    sanitize(box);
  });
  bay.addEventListener("input", function () {
    sanitize(bay);
  });
})();
