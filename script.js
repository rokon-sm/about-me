(function () {
  var C = window.CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- fill the page from config.js ---------- */
  document.title = C.tabTitle || C.name || "Profile";
  $("splash-text").textContent = C.splashText || "Tap to enter";
  $("name").textContent = C.name || "";
  $("bio").textContent = C.bio || "";
  $("avatar").src = C.avatar || "";

  var m = C.music || {};
  $("music-label").textContent = m.label || "Now playing";
  $("music-title").textContent = m.title || "";

  // favicon + background blur
  if (C.favicon) $("favicon").href = C.favicon;
  document.documentElement.style.setProperty("--bg-blur", (C.backgroundBlur == null ? 8 : C.backgroundBlur) + "px");

  var stats = $("stats"), counters = [];
  (C.stats || []).forEach(function (s) {
    var d = document.createElement("div");
    d.className = "stat";
    var b = document.createElement("b");
    var parts = /^(\D*)(\d+(?:\.\d+)?)(.*)$/.exec(String(s.value));
    if (parts) {                       // numbers count up from 0 once the card opens
      var target = parseFloat(parts[2]);
      var decimals = (parts[2].split(".")[1] || "").length;
      counters.push({ el: b, pre: parts[1], post: parts[3], target: target, decimals: decimals });
      b.textContent = parts[1] + (0).toFixed(decimals) + parts[3];
    } else {
      b.textContent = s.value;
    }
    var l = document.createElement("span"); l.textContent = s.label;
    d.appendChild(b); d.appendChild(l);
    stats.appendChild(d);
  });

  // background: image or video
  var bg = $("bg");
  if (C.background) {
    if (/\.(mp4|webm|ogg)$/i.test(C.background)) {
      var v = document.createElement("video");
      v.src = C.background; v.muted = true; v.loop = true; v.autoplay = true;
      v.playsInline = true; v.setAttribute("playsinline", "");
      bg.appendChild(v);
    } else {
      bg.style.backgroundImage = 'url("' + C.background + '")';
    }
  }

  /* ---------- toast ---------- */
  var toast = $("toast"), toastTimer;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }

  /* ---------- copy to clipboard ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {   // fallback for http / old browsers
      var t = document.createElement("textarea");
      t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      try { document.execCommand("copy") ? resolve() : reject(); }
      catch (e) { reject(e); }
      document.body.removeChild(t);
    });
  }

  /* ---------- icon buttons ---------- */
  document.querySelectorAll(".icon").forEach(function (btn) {
    var cfg = (C.links || {})[btn.dataset.key];
    if (!cfg) { btn.style.display = "none"; return; }
    btn.dataset.tip = cfg.tooltip || btn.dataset.key;
    btn.addEventListener("click", function () {
      if (cfg.type === "copy") {
        copyText(cfg.value).then(
          function () { showToast(cfg.toast || "Copied!"); },
          function () { showToast("Couldn't copy"); }
        );
      } else {
        window.open(cfg.value, "_blank", "noopener");
      }
    });
  });

  /* ---------- music ---------- */
  var audio = $("audio");
  if (m.file) {
    audio.src = m.file;
    audio.loop = m.loop !== false;
    audio.volume = typeof m.volume === "number" ? m.volume : 0.5;
  }
  $("music").addEventListener("click", function () {
    if (!m.file) return;
    if (audio.paused) { audio.play().catch(function () {}); this.classList.remove("paused"); }
    else { audio.pause(); this.classList.add("paused"); }
  });

  function runCounters() {
    var dur = 1800, start = null;
    function tick(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);              // ease-out
      counters.forEach(function (c) {
        c.el.textContent = c.pre + (c.target * e).toFixed(c.decimals) + c.post;
      });
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- splash: tap -> fullscreen -> reveal ---------- */
  var splash = $("splash"), card = $("card"), opened = false;

  function enter() {
    if (opened) return;
    opened = true;

    if (C.goFullscreen !== false) {
      var el = document.documentElement;
      var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      if (req) { try { var p = req.call(el); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
    }
    if (m.file) audio.play().catch(function () {});

    splash.classList.add("open");
    card.classList.remove("hidden");
    card.classList.add("show");
    setTimeout(function () { splash.style.display = "none"; }, 1000);
    setTimeout(runCounters, 1100);                                   // when the stats row appears
    setTimeout(function () { card.classList.add("done"); }, 1500);   // intro finished, hover effects take over
  }

  splash.addEventListener("click", enter);
  splash.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enter(); }
  });
})();
