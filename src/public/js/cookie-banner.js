(function () {
  "use strict";

  var COOKIE_NAME = "equipit_cookies_accepted";
  var banner = document.getElementById("cookieBanner");
  var acceptBtn = document.getElementById("cookieAccept");
  var declineBtn = document.getElementById("cookieDecline");
  var corsDisplay = document.getElementById("corsOriginsDisplay");

  function showBanner() {
    if (banner) banner.classList.remove("hidden");
  }

  function hideBanner() {
    if (banner) banner.classList.add("hidden");
  }

  function getCookie(name) {
    var match = document.cookie.match(
      "(?:^|;)\\s*" +
        name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        "\\s*=\\s*([^;]*)",
    );
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setConsentCookie(value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie =
      COOKIE_NAME +
      "=" +
      encodeURIComponent(value) +
      "; expires=" +
      expires +
      "; path=/; SameSite=Lax";
  }

  function loadCorsOrigins() {
    if (!corsDisplay) return;
    fetch("/api/cors-origins")
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data.origins && data.origins.length > 0) {
          corsDisplay.textContent = data.origins.join(", ");
        } else {
          corsDisplay.textContent = "(same origin only)";
        }
      })
      .catch(function () {
        corsDisplay.textContent = "(unavailable)";
      });
  }

  function init() {
    var consent = getCookie(COOKIE_NAME);

    if (consent === "true") {
      hideBanner();
      return;
    }

    showBanner();
    loadCorsOrigins();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      setConsentCookie("true", 365);
      hideBanner();
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      setConsentCookie("false", 30);
      hideBanner();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
