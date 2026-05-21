(function () {
  if (localStorage.getItem('map_tuto_done') && !location.search.includes('tuto=1')) return;

  var steps = [
    {
      title: '★ Guide de la carte',
      text: 'Bienvenue. Ce guide rapide vous montre comment explorer les chants révolutionnaires du monde.',
      target: null
    },
    {
      title: 'Les époques',
      text: 'Ces boutons filtrent les chants par grande période : Renaissance, XIXe, XXe et XXIe siècle. Le curseur fonctionne aussi.',
      target: '.timeline-sidebar',
      pos: 'right',
      arrow: 'left'
    },
    {
      title: 'Cliquer sur un pays',
      text: 'Les pays colorés ont des chants liés. Cliquez sur l\'un d\'eux pour ouvrir sa fiche avec la liste des musiques.',
      target: '.map-svg-wrapper',
      pos: 'above',
      arrow: 'bottom'
    },
    {
      title: 'Les points ●',
      text: 'Chaque point sur la carte est un chant révolutionnaire. Cliquez dessus pour lire la fiche et écouter la musique.',
      target: '.map-svg-wrapper',
      pos: 'above',
      arrow: 'bottom'
    },
    {
      title: 'Recherche rapide',
      text: 'Tapez un titre, un artiste ou une ville pour filtrer instantanément les résultats affichés sur la carte.',
      target: '.search-bar',
      pos: 'below',
      arrow: 'top'
    },
    {
      title: '★ L\'île secrète',
      text: 'Un point doré est caché dans l\'Atlantique. Consultez toutes les fiches musicales de la carte pour le débloquer — il donne accès à la Zone Ludique.',
      target: null
    }
  ];

  var current = 0;

  var overlay = document.createElement('div');
  overlay.id = 'tuto-overlay';
  overlay.innerHTML =
    '<div id="tuto-spotlight"></div>' +
    '<div id="tuto-bubble"></div>';
  document.body.appendChild(overlay);

  var spotlight = document.getElementById('tuto-spotlight');
  var bubble    = document.getElementById('tuto-bubble');

  function show(i) {
    var step   = steps[i];
    var isLast = i === steps.length - 1;

    bubble.className = 'tuto-bubble';

    bubble.innerHTML =
      '<div class="tuto-counter">' + (i + 1) + ' / ' + steps.length + '</div>' +
      '<h3 class="tuto-title">' + step.title + '</h3>' +
      '<p class="tuto-text">' + step.text + '</p>' +
      '<div class="tuto-nav">' +
        '<button class="tuto-btn-next">' + (isLast ? 'Terminer ★' : 'Suivant →') + '</button>' +
        '<button class="tuto-btn-skip">Passer le guide</button>' +
      '</div>';

    bubble.querySelector('.tuto-btn-next').addEventListener('click', function () {
      isLast ? close() : show(i + 1);
    });
    bubble.querySelector('.tuto-btn-skip').addEventListener('click', close);

    if (!step.target) {
      spotlight.style.display = 'none';
      bubble.removeAttribute('style');
      bubble.classList.add('tuto-bubble--center');
      return;
    }

    var el = document.querySelector(step.target);
    if (!el) return;
    var r   = el.getBoundingClientRect();
    var pad = 8;

    spotlight.style.display = 'block';
    spotlight.style.top    = (r.top    - pad) + 'px';
    spotlight.style.left   = (r.left   - pad) + 'px';
    spotlight.style.width  = (r.width  + pad * 2) + 'px';
    spotlight.style.height = (r.height + pad * 2) + 'px';

    var bW = 272, gap = 16;
    var bTop, bLeft;

    if (step.pos === 'right') {
      bLeft = r.right + gap;
      bTop  = r.top + r.height / 2 - 100;
      bubble.classList.add('tuto-arrow--left');
    } else if (step.pos === 'above') {
      bTop  = r.top - 230;
      bLeft = r.left + r.width / 2 - bW / 2;
      bubble.classList.add('tuto-arrow--bottom');
    } else if (step.pos === 'below') {
      bTop  = r.bottom + gap;
      bLeft = r.left + r.width / 2 - bW / 2;
      bubble.classList.add('tuto-arrow--top');
    }

    bLeft = Math.max(12, Math.min(bLeft, window.innerWidth - bW - 12));
    bTop  = Math.max(64, bTop);

    bubble.style.cssText = 'top:' + bTop + 'px;left:' + bLeft + 'px;width:' + bW + 'px';
  }

  function close() {
    localStorage.setItem('map_tuto_done', '1');
    overlay.remove();
  }

  show(0);
})();
