(function () {
  var form = document.querySelector('form[action*="/fulfill"]');
  if (!form) return;

  var errorEl = document.getElementById("fulfill-error");

  form.addEventListener("submit", function (e) {
    var box = document.getElementById("boxNumber");
    var bay = document.getElementById("bayNumber");
    if (!box || !bay) return;
    if (errorEl) errorEl.classList.add("hidden");
    if (!box.value.trim() || !bay.value.trim()) {
      e.preventDefault();
      if (errorEl) {
        errorEl.classList.remove("hidden");
        errorEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      box.focus();
    }
  });
})();
