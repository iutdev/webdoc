document.addEventListener('DOMContentLoaded', function () {


  /* ===== Menu toggle (responsive) ===== */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-header nav');
  if (toggle) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  /* ===== MAP PAGE — Timeline & Epochs ===== */
  const epochNames = ['Renaissance', 'XIXe', 'XXe', 'XXIe'];
  const epochSlider = document.getElementById('epoch-slider');
  const epochLabel = document.getElementById('epoch-label');
  const epochLabelSide = document.getElementById('epoch-label-side');
  const epochBtns = document.querySelectorAll('.epoch-btn');

  function setEpoch(index) {
    if (epochLabel) epochLabel.textContent = epochNames[index] || epochNames[0];
    if (epochLabelSide) epochLabelSide.textContent = epochNames[index] || epochNames[0];
    if (epochSlider) epochSlider.value = index;

    epochBtns.forEach(function (btn, i) {
      btn.classList.toggle('active', i === index);
    });

    if (typeof filterSitesByEpoch === 'function') {
      filterSitesByEpoch(index);
    }
  }

  if (epochSlider) {
    setEpoch(0);
    epochSlider.addEventListener('input', function () {
      setEpoch(parseInt(this.value));
    });
  }

  epochBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const idx = Array.from(epochBtns).indexOf(this);
      setEpoch(idx);
    });
  });

  /* ===== MAP PAGE — Search ===== */
  var searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      if (typeof filterSitesBySearch === 'function') {
        filterSitesBySearch(this.value);
      }
    });
  }

  /* ===== COUNTRY PAGE — Simple display ===== */
  const countryPage = document.getElementById('country-page');
  if (countryPage && typeof countryData !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const countryKey = params.get('country');
    const data = countryData[countryKey];

    if (data) {
      document.title = data.name + ' — Musique & Révolutions';
      const header = document.getElementById('country-header');
      const flagCode = data.flag.toLowerCase();
      const flagExt = flagCode === 'za' ? 'png' : 'svg';
      header.style.backgroundImage = 'url(assets/img/flag-' + flagCode + '.' + flagExt + ')';
      header.innerHTML =
        '<div class="country-photo" style="background-image:url(assets/img/photo-' + data.photo + '.jpg)"></div>' +
        '<img class="panel-flag country-flag-img" src="assets/img/flag-' + flagCode + '.' + flagExt + '" alt="Drapeau ' + data.name + '">' +
        '<h1 class="country-title">' + data.name + '</h1>';

      const speech = document.getElementById('figure-speech');
      if (speech) speech.style.display = 'none';

      const timeline = document.getElementById('country-timeline');
      if (timeline) timeline.style.display = 'none';
    } else {
      document.getElementById('country-page').innerHTML =
        '<div style="text-align:center;padding:4rem 2rem">' +
          '<h1>Pays non trouvé</h1>' +
          '<p style="color:var(--text-secondary);margin-top:1rem">' +
            '<a href="map.html">Retourner à la carte</a>' +
          '</p>' +
        '</div>';
    }
  }

});
