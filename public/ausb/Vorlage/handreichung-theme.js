/* =====================================================================
   Handreichung – Dark-Mode-Umschaltung
   Fachseminar Mathematik · Studienseminar Hameln
   ---------------------------------------------------------------------
   Setzt das Theme früh (vor dem ersten Paint) anhand der gespeicherten
   Wahl bzw. der Systemeinstellung und blendet einen Umschalt-Button ein.
   Einbinden im <head>, direkt nach dem Stylesheet:
     <script src="Vorlage/handreichung-theme.js"></script>
   Die Farben liegen ausschließlich im zentralen Stylesheet
   (handreichung-style.css, Block „Dark-Mode").
   ===================================================================== */
(function () {
  var root = document.documentElement;
  var KEY = "hr-theme";

  function store(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }
  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function apply(theme) {
    if (theme === "dark" || theme === "light") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }
  function effective() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  /* 1) Sofort anwenden – gespeicherte Wahl, sonst Systemeinstellung */
  var pref = stored();
  if (pref === "dark" || pref === "light") {
    apply(pref);
  } else {
    var prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    apply(prefersDark ? "dark" : "light");
  }

  /* 2) Umschalt-Button einblenden */
  function build() {
    if (document.querySelector(".theme-toggle")) return;
    var btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.type = "button";

    function paint() {
      var dark = effective() === "dark";
      // Sonne im Dark-Mode (Klick -> hell), Mond im Hellmodus (Klick -> dunkel)
      btn.textContent = dark ? "☀️" : "🌙";
      var label = dark ? "Hellen Modus einschalten" : "Dunklen Modus einschalten";
      btn.setAttribute("aria-label", label);
      btn.title = label;
    }

    btn.addEventListener("click", function () {
      var next = effective() === "dark" ? "light" : "dark";
      apply(next);
      store(next);
      paint();
    });

    paint();
    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
