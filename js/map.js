(function () {

  var DOT_R = 5, PULSE_R = 14;
  var DOT_HOVER_R = 8, PULSE_HOVER_R = 20;

  var nameToKey = {
    'France': 'france',
    'Germany': 'allemagne',
    'Spain': 'espagne',
    'Italy': 'italie',
    'United Kingdom': 'uk',
    'Poland': 'pologne',
    'Czech Republic': 'republique-tcheque',
    'Hungary': 'hongrie',
    'Ukraine': 'ukraine',
    'Sweden': 'suede',
    'Norway': 'norvege',
    'Denmark': 'danemark',
    'Finland': 'finlande',
    'Greece': 'grece',
    'United States': 'usa',
    'Brazil': 'bresil',
    'Cuba': 'cuba',
    'South Africa': 'afrique-sud',
    'Jamaica': 'jamaique',
    'India': 'inde',
    'Russia': 'russie',
    'China': 'chine',
    'Argentina': 'argentine',
    'Chile': 'chili',
    'Iran': 'iran',
    'South Korea': 'coree-sud',
    'Nigeria': 'nigeria',
    'Egypt': 'egypte',
    'Mexico': 'mexique',
    'Colombia': 'colombie'
  };

  var countriesWithSites = {};
  revolutionaryMusicSites.forEach(function (s) { countriesWithSites[s.country] = true; });

  var countryNames = {
    'france': 'France',
    'allemagne': 'Allemagne',
    'espagne': 'Espagne',
    'italie': 'Italie',
    'uk': 'Royaume-Uni',
    'pologne': 'Pologne',
    'republique-tcheque': 'République tchèque',
    'hongrie': 'Hongrie',
    'ukraine': 'Ukraine',
    'suede': 'Suède',
    'norvege': 'Norvège',
    'danemark': 'Danemark',
    'finlande': 'Finlande',
    'grece': 'Grèce',
    'usa': 'États-Unis',
    'bresil': 'Brésil',
    'cuba': 'Cuba',
    'afrique-sud': 'Afrique du Sud',
    'jamaique': 'Jamaïque',
    'inde': 'Inde',
    'russie': 'Russie',
    'chine': 'Chine',
    'argentine': 'Argentine',
    'chili': 'Chili',
    'iran': 'Iran',
    'coree-sud': 'Corée du Sud',
    'nigeria': 'Nigeria',
    'egypte': 'Égypte',
    'mexique': 'Mexique',
    'colombie': 'Colombie'
  };

  var width = 960, height = 600;

  var svg = d3.select('#world-map');
  var loading = document.getElementById('map-loading');
  var zoomedKey = null;
  var sitesGroup = null;

  var tooltip = d3.select('body').append('div')
    .attr('class', 'map-tooltip')
    .style('display', 'none');

  var songDetail = document.getElementById('song-detail');

  var url = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

  d3.json(url).then(function (world) {
    loading.style.display = 'none';

    var countries = topojson.feature(world, world.objects.countries);

    var projection = d3.geoNaturalEarth1()
      .fitSize([width - 20, height - 20], {
        type: 'FeatureCollection',
        features: countries.features
      });

    var path = d3.geoPath().projection(projection);

    var g = svg.append('g');

    function counterScaleSites(k) {
      if (!sitesGroup) return;
      var s = Math.max(1, Math.sqrt(k));
      sitesGroup.selectAll('.site-dot').attr('r', DOT_R / s);
      sitesGroup.selectAll('.site-pulse').attr('r', PULSE_R / s);
      sitesGroup.selectAll('.island-dot').attr('r', 7 / s);
      sitesGroup.selectAll('.island-pulse').attr('r', 22 / s);
    }

    /* ── Réinitialisation à chaque chargement ── */
    localStorage.removeItem('mrv_viewed');
    localStorage.removeItem('map_tuto_done');
    var TOTAL_SONGS = revolutionaryMusicSites.length;

    function getViewedSet() {
      try { return new Set(JSON.parse(localStorage.getItem('mrv_viewed') || '[]')); }
      catch (e) { return new Set(); }
    }

    function markSongViewed(songKey) {
      var s = getViewedSet();
      s.add(songKey);
      try { localStorage.setItem('mrv_viewed', JSON.stringify([...s])); } catch (e) {}
      refreshIslandState();
    }

    function songKey(site) { return site.title + '|' + site.year; }

    function isUnlocked() { return getViewedSet().size >= TOTAL_SONGS; }

    function refreshIslandState() {
      if (!isUnlocked()) return;
      var dotEl   = document.querySelector('.island-dot');
      var labelEl = document.querySelector('.island-label');
      var pulseEl = document.querySelector('.island-pulse');
      if (!dotEl) return;
      dotEl.setAttribute('fill', '#f5c518');
      if (pulseEl) pulseEl.setAttribute('opacity', '0.6');
      if (labelEl) { labelEl.textContent = '✦'; labelEl.setAttribute('fill', '#f5c518'); }
      var outlineEl = document.querySelector('.island-label-outline');
      if (outlineEl) outlineEl.textContent = '✦';
    }

    var zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', function (event) {
        g.attr('transform', event.transform);
        counterScaleSites(event.transform.k);
      });

    svg.call(zoom);

    var featuresByKey = {};

    g.selectAll('path')
      .data(countries.features)
      .enter().append('path')
      .attr('d', path)
      .attr('class', function (d) {
        var key = nameToKey[d.properties.name];
        if (key && countriesWithSites[key]) featuresByKey[key] = d;
        return key && countriesWithSites[key] ? 'country has-data' : 'country no-data';
      })
      .attr('data-country', function (d) {
        return nameToKey[d.properties.name] || '';
      })
      .attr('data-name', function (d) {
        return d.properties.name;
      });

    g.selectAll('.country.has-data')
      .on('mouseenter', function (event, d) {
        var el = d3.select(this);
        var key = nameToKey[d.properties.name];
        var label = countryNames[key] || d.properties.name;
        if (zoomedKey && key !== zoomedKey) return;
        var figure = countryData && countryData[key] && countryData[key].figure;
        var figureHtml = figure ? '<br><span style="font-size:0.75rem;color:var(--text-muted)">Figure : ' + figure + '</span>' : '';
        tooltip.style('display', 'block')
          .html('<strong>' + label + '</strong>' + figureHtml + '<br><em>' + (zoomedKey ? 'Cliquez pour les infos du pays' : 'Cliquez pour zoomer') + '</em>')
          .style('left', (event.clientX + 12) + 'px')
          .style('top', (event.clientY - 10) + 'px');
        if (!zoomedKey) el.classed('hover', true);
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', (event.clientX + 12) + 'px')
          .style('top', (event.clientY - 10) + 'px');
      })
      .on('mouseleave', function () {
        d3.select(this).classed('hover', false);
        tooltip.style('display', 'none');
      })
      .on('click', function (event, d) {
        var key = nameToKey[d.properties.name];
        if (zoomedKey === key) { resetZoom(); return; }
        zoomToCountry(key, d);
        openCountryPanel(key);
      });

    function zoomToCountry(key, feature) {
      var bounds = path.bounds(feature);
      var dx = bounds[1][0] - bounds[0][0];
      var dy = bounds[1][1] - bounds[0][1];
      var x = (bounds[0][0] + bounds[1][0]) / 2;
      var y = (bounds[0][1] + bounds[1][1]) / 2;
      var scale = Math.max(1, Math.min(8, 0.85 / Math.max(dx / width, dy / height)));
      var translate = [width / 2 - scale * x, height / 2 - scale * y];

      zoomedKey = key;

      g.selectAll('.country.has-data').classed('active', false);
      g.selectAll('.country.has-data[data-country="' + key + '"]').classed('active', true);

      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
      );

      var btn = document.getElementById('reset-zoom-btn');
      var label = countryNames[key] || key;
      btn.innerHTML = '&#x2190; ' + label;
      btn.style.display = 'inline-block';
    }

    function resetZoom() {
      zoomedKey = null;
      g.selectAll('.country.has-data').classed('active', false);

      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
      );

      var btn = document.getElementById('reset-zoom-btn');
      btn.style.display = 'none';

      if (panel) panel.classList.remove('open');
    }

    window.resetMapZoom = resetZoom;

    /* ===== Revolutionary Music Sites ===== */
    if (typeof revolutionaryMusicSites !== 'undefined') {
      var defs = svg.append('defs');
      defs.append('radialGradient')
        .attr('id', 'pin-glow')
        .attr('cx', '50%').attr('cy', '50%')
        .attr('r', '50%')
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#ff3d00')
        .attr('stop-opacity', '0.6');

      sitesGroup = g.append('g').attr('class', 'music-sites');

      revolutionaryMusicSites.forEach(function (site) {
        var coords = projection([site.lon, site.lat]);
        if (!coords) return;

        var siteGroup = sitesGroup.append('g')
          .attr('class', 'music-site')
          .attr('data-epoch', site.epoch)
          .attr('data-title', site.title.toLowerCase())
          .attr('data-artist', site.artist.toLowerCase())
          .attr('data-city', site.city.toLowerCase())
          .attr('transform', 'translate(' + coords[0] + ',' + coords[1] + ')');

        siteGroup.append('circle')
          .attr('class', 'site-pulse')
          .attr('r', PULSE_R)
          .attr('fill', 'url(#pin-glow)')
          .attr('opacity', '0.4');

        siteGroup.append('circle')
          .attr('class', 'site-dot')
          .attr('r', DOT_R)
          .attr('fill', '#ff3d00')
          .attr('stroke', '#120a06')
          .attr('stroke-width', '2');

        var countryName = countryNames[site.country] || site.country;
        siteGroup.append('title')
          .text(site.title + '\n' + site.artist + ' (' + site.year + ')\n' + site.city + ', ' + countryName);

        siteGroup
          .on('mouseenter', function (event) {
            var k = d3.zoomTransform(svg.node()).k;
            var s = Math.max(1, Math.sqrt(k));
            d3.select(this).select('.site-dot')
              .transition().duration(150)
              .attr('r', DOT_HOVER_R / s)
              .attr('fill', '#ff6d00');
            d3.select(this).select('.site-pulse')
              .transition().duration(150)
              .attr('r', PULSE_HOVER_R / s)
              .attr('opacity', '0.6');
            tooltip.style('display', 'block')
              .html(
                '<strong>' + site.title + '</strong><br>' +
                site.artist + ' <em>(' + site.year + ')</em><br>' +
                '<span style="color:var(--text-muted)">' + site.city + ', ' + countryName + '</span><br>' +
                '<span style="font-size:0.75rem;color:var(--text-secondary)">' + site.desc + '</span>'
              )
              .style('left', (event.clientX + 12) + 'px')
              .style('top', (event.clientY - 10) + 'px');
          })
          .on('mousemove', function (event) {
            tooltip
              .style('left', (event.clientX + 12) + 'px')
              .style('top', (event.clientY - 10) + 'px');
          })
          .on('mouseleave', function () {
            var k = d3.zoomTransform(svg.node()).k;
            var s = Math.max(1, Math.sqrt(k));
            var self = d3.select(this);
            self.select('.site-dot')
              .transition().duration(150)
              .attr('r', DOT_R / s)
              .attr('fill', '#d32f2f');
            self.select('.site-pulse')
              .transition().duration(150)
              .attr('r', PULSE_R / s)
              .attr('opacity', '0.4');
            tooltip.style('display', 'none');
          })
          .on('click', function (event) {
            event.stopPropagation();
            showSongDetail(site, countryName, site.country);
          });
      });

      /* ── ÎLE SECRÈTE — Atlantique (lon=-30, lat=12) ── */
      (function () {
        var ISLAND_LON = -30, ISLAND_LAT = 12;
        var ic = projection([ISLAND_LON, ISLAND_LAT]);
        if (!ic) return;

        var unlocked = isUnlocked();

        // Gradient encre pour le halo
        defs.append('radialGradient')
          .attr('id', 'island-glow')
          .attr('cx', '50%').attr('cy', '50%').attr('r', '50%')
          .selectAll('stop')
          .data([
            { offset: '0%',   color: '#1a1410', opacity: 0.5 },
            { offset: '100%', color: '#1a1410', opacity: 0   }
          ])
          .enter().append('stop')
          .attr('offset',        function (d) { return d.offset; })
          .attr('stop-color',    function (d) { return d.color; })
          .attr('stop-opacity',  function (d) { return d.opacity; });

        var ig = sitesGroup.append('g')
          .attr('class', 'secret-island')
          .attr('transform', 'translate(' + ic[0] + ',' + ic[1] + ')')
          .style('cursor', 'pointer');

        // Anneau de pulse
        ig.append('circle')
          .attr('class', 'island-pulse')
          .attr('r', 22)
          .attr('fill', 'url(#island-glow)')
          .attr('opacity', unlocked ? '0.6' : '0.35');

        // Halo sombre derrière le dot pour faire ressortir le jaune
        ig.append('circle')
          .attr('r', 10)
          .attr('fill', '#1a1410')
          .attr('opacity', '0.18');

        // Dot central jaune avec contour sombre épais
        ig.append('circle')
          .attr('class', 'island-dot')
          .attr('r', 7)
          .attr('fill', unlocked ? '#f5c518' : '#c8a000')
          .attr('stroke', '#1a1410')
          .attr('stroke-width', '2.5');

        // Texte outline (couche du bas) — halo sombre pour lisibilité sur beige
        ig.append('text')
          .attr('class', 'island-label-outline')
          .attr('text-anchor', 'middle')
          .attr('y', -12)
          .attr('font-size', '11px')
          .attr('font-family', '"Courier Prime", monospace')
          .attr('font-weight', 'bold')
          .attr('stroke', '#1a1410')
          .attr('stroke-width', '3')
          .attr('stroke-linejoin', 'round')
          .attr('fill', 'none')
          .attr('pointer-events', 'none')
          .text(unlocked ? '✦' : '?');

        // Texte jaune par-dessus
        ig.append('text')
          .attr('class', 'island-label')
          .attr('text-anchor', 'middle')
          .attr('y', -12)
          .attr('font-size', '11px')
          .attr('font-family', '"Courier Prime", monospace')
          .attr('font-weight', 'bold')
          .attr('fill', unlocked ? '#f5c518' : '#c8a000')
          .attr('pointer-events', 'none')
          .text(unlocked ? '✦' : '?');

        ig.on('mouseenter', function (event) {
            var viewed   = getViewedSet();
            var remaining = TOTAL_SONGS - viewed.size;
            var locked   = remaining > 0;
            tooltip.style('display', 'block')
              .html(locked
                ? '<strong>??? Île inconnue</strong><br>' +
                  '<em>Un lieu légendaire perdu dans l\'Atlantique.</em><br>' +
                  '<span style="color:var(--text-muted)">Consulte encore <strong>' + remaining + '</strong> fiche(s) sur la carte pour le révéler.</span>'
                : '<strong>✦ Île des Rebelles</strong><br>' +
                  '<em>Terra Musica — territoire libre</em><br>' +
                  '<span style="color:var(--accent-warm)">Cliquez pour entrer dans la Zone Ludique ↗</span>'
              )
              .style('left', (event.clientX + 12) + 'px')
              .style('top',  (event.clientY - 10) + 'px');

            var k = d3.zoomTransform(svg.node()).k;
            var s = Math.max(1, Math.sqrt(k));
            d3.select(this).select('.island-dot')
              .transition().duration(150)
              .attr('r', 10 / s);
            d3.select(this).select('.island-pulse')
              .transition().duration(150)
              .attr('r', 30 / s)
              .attr('opacity', locked ? '0.35' : '0.7');
          })
          .on('mousemove', function (event) {
            tooltip.style('left', (event.clientX + 12) + 'px')
                   .style('top',  (event.clientY - 10) + 'px');
          })
          .on('mouseleave', function () {
            tooltip.style('display', 'none');
            var k = d3.zoomTransform(svg.node()).k;
            var s = Math.max(1, Math.sqrt(k));
            d3.select(this).select('.island-dot').transition().duration(150).attr('r', 7 / s);
            d3.select(this).select('.island-pulse').transition().duration(150).attr('r', 22 / s);
          })
          .on('click', function (event) {
            event.stopPropagation();
            if (isUnlocked()) {
              window.location.href = 'ludique.html';
            } else {
              var remaining = TOTAL_SONGS - getViewedSet().size;
              tooltip.style('display', 'block')
                .html('<strong>Accès refusé</strong><br>' +
                      'Il te reste <strong>' + remaining + '</strong> fiche(s) à écouter sur la carte.')
                .style('left', (event.clientX + 12) + 'px')
                .style('top',  (event.clientY - 10) + 'px');
              setTimeout(function () { tooltip.style('display', 'none'); }, 3000);
            }
          });
      })();
    }

    var _currentEpoch = null;
    var _currentSearch = '';

    function applyFilters() {
      var epochKeys = ['renaissance', 'xixe', 'xxe', 'xxie'];
      var selectedEpoch = epochKeys[_currentEpoch];
      var q = _currentSearch;
      sitesGroup.selectAll('.music-site').each(function () {
        var el = d3.select(this);
        var epochMatch = el.attr('data-epoch') === selectedEpoch;
        var searchMatch = !q ||
          el.attr('data-title').indexOf(q) !== -1 ||
          el.attr('data-artist').indexOf(q) !== -1 ||
          el.attr('data-city').indexOf(q) !== -1;
        el.style('display', epochMatch && searchMatch ? null : 'none');
      });
    }

    window.filterSitesByEpoch = function (epochIndex) {
      _currentEpoch = epochIndex;
      applyFilters();
    };

    window.filterSitesBySearch = function (query) {
      _currentSearch = query.toLowerCase().trim();
      applyFilters();
    };

    var epochSlider = document.getElementById('epoch-slider');
    if (epochSlider) filterSitesByEpoch(parseInt(epochSlider.value));

    /* ===== Country Panel ===== */
    var panel = document.getElementById('country-panel');
    var panelName = document.getElementById('panel-name');
    var panelFlag = document.getElementById('panel-flag');
    var panelFigure = document.getElementById('panel-figure');
    var panelSongs = document.getElementById('panel-songs');

    window.openCountryPanel = function (key) {
      if (!panel || !panelName || !panelFlag || !panelSongs) return;
      var country = countryData && countryData[key];
      if (!country) return;

      panelName.textContent = country.name;
      var fc = country.flag.toLowerCase();
      panelFlag.src = 'assets/img/flag-' + fc + (fc === 'za' ? '.png' : '.svg');
      panelFlag.alt = 'Drapeau ' + country.name;

      if (country.figure) {
        panelFigure.textContent = 'Figure emblématique : ' + country.figure;
        panelFigure.style.display = 'block';
      } else {
        panelFigure.style.display = 'none';
      }

      var songs = revolutionaryMusicSites.filter(function (s) { return s.country === key; });
      panelSongs.innerHTML = '';
      if (songs.length === 0) {
        panelSongs.innerHTML = '<li style="color:var(--text-muted);cursor:default;font-size:0.85rem">Aucun chant pour ce pays</li>';
      } else {
        songs.forEach(function (site) {
          var li = document.createElement('li');
          li.innerHTML = '<span class="song-title">' + site.title + '</span><span class="song-artist">' + site.artist + ' <span class="song-year">(' + site.year + ')</span></span>';
          li.addEventListener('click', function () {
            var cn = countryNames[site.country] || site.country;
            showSongDetail(site, cn, site.country);
          });
          panelSongs.appendChild(li);
        });
      }

      panel.classList.add('open');
    };

    window.closeCountryPanel = function () {
      if (panel) panel.classList.remove('open');
      if (zoomedKey) resetZoom();
    };

    function showSongDetail(site, countryName, countryKey) {
      if (!songDetail) return;

      // Marquer cette fiche comme consultée
      markSongViewed(songKey(site));

      var prevPlayer = document.getElementById('song-detail-player');
      if (prevPlayer && prevPlayer._audio) {
        prevPlayer._audio.pause();
        prevPlayer._audio.currentTime = 0;
      }
      document.getElementById('song-detail-title').textContent = site.title;
      document.getElementById('song-detail-artist').textContent = site.artist;
      document.getElementById('song-detail-year').textContent = site.year;
      document.getElementById('song-detail-location').textContent = site.city + ', ' + countryName;
      document.getElementById('song-detail-desc').textContent = site.desc;

      var extraEl = document.getElementById('song-detail-extra');
      if (site.histoire || site.pourquoi || site.impact) {
        if (site.histoire) document.getElementById('song-detail-histoire').textContent = site.histoire;
        if (site.pourquoi) document.getElementById('song-detail-pourquoi').textContent = site.pourquoi;
        if (site.impact) document.getElementById('song-detail-impact').innerHTML = site.impact.replace(/\n\n/g, '<br><br>');
        extraEl.style.display = 'block';
      } else {
        extraEl.style.display = 'none';
      }
      var epochNames = { renaissance: 'Renaissance', xixe: 'XIXe', xxe: 'XXe', xxie: 'XXIe' };
      document.getElementById('song-detail-epoch').textContent = epochNames[site.epoch] || site.epoch;

      var imgEl = document.getElementById('song-detail-image');
      if (site.image) {
        imgEl.style.backgroundImage = 'url(' + site.image + ')';
        imgEl.style.backgroundSize = 'cover';
        imgEl.style.backgroundPosition = 'center top';
        imgEl.style.backgroundColor = 'var(--accent)';
      } else if (countryKey && countryData[countryKey] && countryData[countryKey].photo) {
        imgEl.style.backgroundImage = 'url(assets/img/photo-' + countryData[countryKey].photo + '.jpg)';
        imgEl.style.backgroundSize = 'cover';
        imgEl.style.backgroundPosition = 'center';
        imgEl.style.backgroundColor = 'var(--accent)';
      } else {
        imgEl.style.backgroundImage = '';
        imgEl.style.background = 'var(--bg-panel)';
      }

      var playerEl = document.getElementById('song-detail-player');
      playerEl.innerHTML = '';

      if (site.audio) {
        playerEl.innerHTML =
          '<div class="audio-player">' +
            '<button class="player-play-btn" aria-label="Lecture">&#9654;</button>' +
            '<div class="player-body">' +
              '<div class="audio-label">' + site.title + ' — Écouter</div>' +
              '<div class="player-track">' +
                '<input type="range" class="player-progress" value="0" min="0" max="100" step="0.1">' +
                '<span class="player-time">0:00 / 0:00</span>' +
              '</div>' +
            '</div>' +
          '</div>';

        var audio = new Audio(site.audio);
        var playBtn = playerEl.querySelector('.player-play-btn');
        var progress = playerEl.querySelector('.player-progress');
        var timeEl = playerEl.querySelector('.player-time');

        function formatTime(s) {
          var m = Math.floor(s / 60);
          var sec = Math.floor(s % 60);
          return m + ':' + (sec < 10 ? '0' : '') + sec;
        }

        playBtn.addEventListener('click', function () {
          if (audio.paused) {
            audio.play();
            playBtn.innerHTML = '&#9646;&#9646;';
            playBtn.setAttribute('aria-label', 'Pause');
          } else {
            audio.pause();
            playBtn.innerHTML = '&#9654;';
            playBtn.setAttribute('aria-label', 'Lecture');
          }
        });

        audio.addEventListener('timeupdate', function () {
          if (audio.duration) {
            progress.value = (audio.currentTime / audio.duration) * 100;
            timeEl.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
          }
        });

        audio.addEventListener('ended', function () {
          playBtn.innerHTML = '&#9654;';
          playBtn.setAttribute('aria-label', 'Lecture');
          progress.value = 0;
          timeEl.textContent = '0:00 / ' + formatTime(audio.duration);
        });

        audio.addEventListener('loadedmetadata', function () {
          timeEl.textContent = '0:00 / ' + formatTime(audio.duration);
        });

        progress.addEventListener('input', function () {
          if (audio.duration) {
            audio.currentTime = (progress.value / 100) * audio.duration;
          }
        });

        /* Stopper la lecture quand on ferme la fiche */
        playerEl._audio = audio;
      } else {
        playerEl.innerHTML = '<p class="player-placeholder">Aucun audio disponible</p>';
      }

      if (panel) panel.classList.remove('open');
      songDetail.classList.add('open');
    }

    window.closeSongDetail = function () {
      var playerEl = document.getElementById('song-detail-player');
      if (playerEl && playerEl._audio) {
        playerEl._audio.pause();
        playerEl._audio.currentTime = 0;
      }
      if (songDetail) songDetail.classList.remove('open');
    };

  }).catch(function (err) {
    loading.textContent = 'Erreur de chargement de la carte : ' + err.message;
  });

})();
