function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function setupDodgingNoButton({
  playAreaSelector = ".play-area",
  noButtonSelector = ".btn-no",
  maxDodges = 8,        // after this, it stops dodging (set to 999 for "never clickable")
  dodgeDistance = 120   // feel of the jump
} = {}) {
  const area = document.querySelector(playAreaSelector);
  const noBtn = document.querySelector(noButtonSelector);
  if (!area || !noBtn) return;

  // Keep it inside play-area
  const placeRandom = () => {
    const a = area.getBoundingClientRect();
    const b = noBtn.getBoundingClientRect();

    // available area (padding feel)
    const minX = 10;
    const minY = 10;
    const maxX = a.width - b.width - 10;
    const maxY = a.height - b.height - 10;

    // random target
    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;

    noBtn.style.left = `${clamp(x, minX, maxX)}px`;
    noBtn.style.top  = `${clamp(y, minY, maxY)}px`;
    noBtn.style.bottom = "auto";
  };

  let dodges = 0;

  // On mobile, "hover" doesn't exist, so use pointer events + touchstart
  const dodge = (e) => {
    if (dodges >= maxDodges) return;
    dodges++;

    // make it feel "zippy"
    noBtn.style.transition = "transform 80ms ease";
    noBtn.style.transform = `translate(${(Math.random() - 0.5) * dodgeDistance}px, ${(Math.random() - 0.5) * dodgeDistance}px)`;
    setTimeout(() => {
      noBtn.style.transition = "";
      noBtn.style.transform = "";
      placeRandom();
    }, 90);

    // prevent accidental click on touch
    if (e && e.cancelable) e.preventDefault();
  };

  // start position
  noBtn.style.position = "absolute";
  noBtn.style.top = "auto";
  noBtn.style.left = "18px";
  noBtn.style.bottom = "18px";

  noBtn.addEventListener("pointerenter", dodge);
  noBtn.addEventListener("pointerdown", dodge);
  noBtn.addEventListener("touchstart", dodge, { passive: false });

  // Optional: if she somehow clicks NO after maxDodges, still proceed nicely.
  noBtn.addEventListener("click", () => {
    if (dodges < maxDodges) return; // should never happen, but just in case
    const next = noBtn.getAttribute("data-next");
    if (next) window.location.href = next;
  });

  // If screen rotates, re-place
  window.addEventListener("resize", () => placeRandom());

  // Put it somewhere random initially
  placeRandom();
}

function burstConfetti(count = 60) {
  const wrap = document.querySelector(".confetti");
  if (!wrap) return;
  wrap.innerHTML = "";
  for (let i = 0; i < count; i++){
    const s = document.createElement("span");
    s.style.left = `${Math.random() * 100}vw`;
    s.style.animationDelay = `${Math.random() * 0.3}s`;
    s.style.background = `hsl(${Math.random()*360}, 90%, 60%)`;
    s.style.width = `${6 + Math.random()*8}px`;
    s.style.height = `${10 + Math.random()*14}px`;
    wrap.appendChild(s);
  }
}
