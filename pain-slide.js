import { animate, stagger } from 'https://esm.sh/motion@11.15.0';

const ease = [0.2, 0.8, 0.2, 1];
const bounce = [0.34, 1.45, 0.64, 1];
let painControls = [];

function stopPain() {
  painControls.forEach((c) => c.stop?.());
  painControls = [];
}

function asElements(...items) {
  return items
    .flat()
    .filter((el) => el instanceof Element);
}

function runAnim(els, keyframes, options) {
  const list = asElements(els);
  if (!list.length) return null;
  const ctrl = animate(list.length === 1 ? list[0] : list, keyframes, options);
  painControls.push(ctrl);
  return ctrl;
}

function restartFlowDots(slide) {
  slide.querySelectorAll('.pain-flow-dot animateMotion').forEach((node) => {
    const dot = node.parentElement;
    const next = node.cloneNode(true);
    node.remove();
    dot.appendChild(next);
  });
}

function playPainSlide(slide) {
  const inner = slide.querySelector('.slide-inner');
  if (!inner) return;

  stopPain();
  slide.classList.remove('pain-live');
  restartFlowDots(slide);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasStage = Boolean(inner.querySelector('.pain-stage'));
  const headItems = [...inner.querySelectorAll('.pain-head > *')];
  const tokens = [...inner.querySelectorAll('.pain-token')];
  const paths = [...inner.querySelectorAll('.pain-flow-path')];
  const core = inner.querySelector('.pain-core');
  const bars = [...inner.querySelectorAll('.pain-bar i')];
  const cards = [...inner.querySelectorAll('.pain-card')];
  const accents = [...inner.querySelectorAll('.pain-card-accent')];
  const painNos = [...inner.querySelectorAll('.pain-no')];
  const cardTitles = [...inner.querySelectorAll('.pain-card b')];
  const cardCopy = [...inner.querySelectorAll('.pain-card > span:last-child')];
  const banner = inner.querySelector('.warning-banner');

  const instant = { duration: 0 };

  runAnim(headItems, { opacity: 0, y: 16 }, instant);
  runAnim(tokens, { opacity: 0, x: -12 }, instant);
  runAnim(paths, { pathLength: 0 }, instant);
  runAnim(core, { opacity: 0, scale: 0.9 }, instant);
  runAnim(bars, { scaleY: 0 }, instant);
  runAnim(cards, { opacity: 0, y: 28, scale: 0.9, rotateX: 8 }, instant);
  runAnim(accents, { scaleX: 0 }, instant);
  runAnim(painNos, { opacity: 0, scale: 0.4 }, instant);
  runAnim(cardTitles, { opacity: 0, x: -10 }, instant);
  runAnim(cardCopy, { opacity: 0, y: 8 }, instant);
  runAnim(banner, { opacity: 0, y: 12 }, instant);

  const finish = () => slide.classList.add('pain-live');

  if (reduced) {
    runAnim(
      [...headItems, ...tokens, core, ...cards, banner],
      { opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0 },
      instant
    );
    runAnim(bars, { scaleY: 1 }, instant);
    runAnim(accents, { scaleX: 1 }, instant);
    runAnim(paths, { pathLength: 1 }, instant);
    runAnim(painNos, { opacity: 1, scale: 1 }, instant);
    runAnim(cardTitles, { opacity: 1, x: 0 }, instant);
    runAnim(cardCopy, { opacity: 1, y: 0 }, instant);
    finish();
    return;
  }

  const cardStart = hasStage ? 1.25 : 0.42;
  const bannerDelay = hasStage ? 1.95 : cardStart + 0.55 + cards.length * 0.09;

  runAnim(headItems, { opacity: [0, 1], y: [16, 0] }, {
    duration: 0.55,
    delay: stagger(0.08, { startDelay: 0.05 }),
    ease,
  });

  if (hasStage) {
    runAnim(tokens, { opacity: [0, 1], x: [-12, 0] }, {
      duration: 0.45,
      delay: stagger(0.07, { startDelay: 0.35 }),
      ease,
    });
    runAnim(paths, { pathLength: [0, 1] }, {
      duration: 0.9,
      delay: stagger(0.08, { startDelay: 0.55 }),
      ease,
    });
    runAnim(core, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.65, delay: 0.95, ease });
    runAnim(bars, { scaleY: [0, 1] }, {
      duration: 0.75,
      delay: stagger(0.1, { startDelay: 1.15 }),
      ease,
    });
  }

  runAnim(cards, { opacity: [0, 1], y: [28, 0], scale: [0.9, 1], rotateX: [8, 0] }, {
    duration: 0.62,
    delay: stagger(0.09, { startDelay: cardStart }),
    ease,
  });
  runAnim(accents, { scaleX: [0, 1] }, {
    duration: 0.5,
    delay: stagger(0.09, { startDelay: cardStart + 0.06 }),
    ease,
  });
  runAnim(painNos, { opacity: [0, 1], scale: [0.4, 1.12, 1] }, {
    duration: 0.48,
    delay: stagger(0.09, { startDelay: cardStart + 0.14 }),
    ease: bounce,
  });
  runAnim(cardTitles, { opacity: [0, 1], x: [-10, 0] }, {
    duration: 0.45,
    delay: stagger(0.09, { startDelay: cardStart + 0.2 }),
    ease,
  });
  runAnim(cardCopy, { opacity: [0, 1], y: [8, 0] }, {
    duration: 0.42,
    delay: stagger(0.09, { startDelay: cardStart + 0.26 }),
    ease,
  });

  const bannerAnim = runAnim(
    banner,
    { opacity: [0, 1], y: [12, 0] },
    { duration: 0.6, delay: bannerDelay, ease }
  );

  if (bannerAnim?.finished) bannerAnim.finished.then(finish);
  else finish();

  if (hasStage && core) {
    runAnim(
      core,
      {
        boxShadow: [
          '0 0 0 rgba(230,255,69,0)',
          '0 0 34px rgba(230,255,69,.16)',
          '0 0 0 rgba(230,255,69,0)',
        ],
      },
      { duration: 2.8, repeat: Infinity, delay: 1.4, ease: 'easeInOut' }
    );

    paths.forEach((path, i) => {
      runAnim(
        path,
        {
          stroke: [
            'rgba(255,255,255,.14)',
            'rgba(230,255,69,.42)',
            'rgba(255,255,255,.14)',
          ],
        },
        { duration: 2.4, repeat: Infinity, delay: 1.2 + i * 0.08, ease: 'easeInOut' }
      );
    });
  }
}

function boot() {
  const slide = document.querySelector('[data-pain-slide]');
  if (!slide) return;

  slide.classList.add('pain-init');

  window.addEventListener('pain-slide-play', () => playPainSlide(slide));
  window.addEventListener('deckchange', (e) => {
    const slides = window.__deckSlides;
    const painIdx = slides?.indexOf(slide) ?? -1;
    if (e.detail?.index !== painIdx) {
      stopPain();
      slide.classList.remove('pain-live');
    }
  });

  const slides = window.__deckSlides;
  if (slides && slides[window.__deckIndex?.() ?? 0] === slide) {
    playPainSlide(slide);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
