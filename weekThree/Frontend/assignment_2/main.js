(function () {
  "use strict";

  /* Mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* Testimonials carousel — one card per view under 768px */
  var root = document.querySelector("[data-carousel]");
  if (!root) return;

  var track = root.querySelector("[data-carousel-track]");
  var items = root.querySelectorAll("[data-carousel-item]");
  var prevBtn = root.querySelector("[data-carousel-prev]");
  var nextBtn = root.querySelector("[data-carousel-next]");

  if (!track || !items.length) return;

  var index = 0;
  var mq = window.matchMedia("(max-width: 768px)");

  function scrollToIndex(i) {
    if (!mq.matches) return;
    var el = items[i];
    if (!el) return;
    var trackRect = track.getBoundingClientRect();
    var itemRect = el.getBoundingClientRect();
    var nextLeft =
      track.scrollLeft +
      (itemRect.left - trackRect.left) -
      (track.clientWidth - itemRect.width) / 2;
    track.scrollTo({
      left: Math.max(0, nextLeft),
      behavior: "smooth",
    });
  }

  function updateIndexFromScroll() {
    if (!mq.matches) return;
    var trackRect = track.getBoundingClientRect();
    var center = trackRect.left + track.clientWidth / 2;
    var best = 0;
    var bestDist = Infinity;
    items.forEach(function (item, i) {
      var r = item.getBoundingClientRect();
      var mid = r.left + r.width / 2;
      var d = Math.abs(mid - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    index = best;
  }

  function go(delta) {
    if (!mq.matches) return;
    index = (index + delta + items.length) % items.length;
    scrollToIndex(index);
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { go(1); });

  var scrollTimer;
  track.addEventListener("scroll", function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateIndexFromScroll, 80);
  });

  mq.addEventListener("change", function (e) {
    if (!e.matches) {
      track.scrollLeft = 0;
      index = 0;
    }
  });
})();
