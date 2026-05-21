(function () {
  var THREE = window.THREE;
  if (!THREE || !window.d3 || !window.topojson) {
    console.warn('Globe: missing deps');
    return;
  }

  var d3 = window.d3, topojson = window.topojson;
  var W = 2048, H = 1024;

  var T = { VINTAGE: 22000, TRANS: 3000 };
  var TOTAL = T.VINTAGE + T.TRANS;

  var el = document.getElementById('globe-container');
  if (!el) return;

  var spinner = el.querySelector('.globe-spinner');
  var w = el.clientWidth || window.innerWidth;
  var h = el.clientHeight || window.innerHeight;
  var ready = false, startTime = null;
  var rotationSpeed = 0.004;

  /* === Scene === */
  var scene = new THREE.Scene();
  var cam = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  cam.position.set(0, 0.3, 3.8);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  el.appendChild(renderer.domElement);

  var dl = new THREE.DirectionalLight(0xffffff, 1.8);
  dl.position.set(5, 3, 5);
  scene.add(dl);
  var dl2 = new THREE.DirectionalLight(0xffeedd, 0.5);
  dl2.position.set(-3, -1, -4);
  scene.add(dl2);

  /* === Two meshes for cross-fade vintage → modern === */
  var geo = new THREE.SphereGeometry(1.5, 64, 64);

  var vintageMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9, metalness: 0, transparent: true, opacity: 1 });
  var modernMat  = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.5, metalness: 0.2, transparent: true, opacity: 0 });

  var vintageMesh = new THREE.Mesh(geo, vintageMat);
  var modernMesh  = new THREE.Mesh(geo, modernMat);
  scene.add(vintageMesh);
  scene.add(modernMesh);

  /* === D3 SVG → Image → Canvas (2 styles) === */
  function renderMapToImage(world, style, cb) {
    var countries = topojson.feature(world, world.objects.countries);
    var borders = topojson.mesh(world, world.objects.countries);
    var proj = d3.geoEquirectangular().fitSize([W, H], { type: 'Sphere' });
    var path = d3.geoPath(proj);
    var grat = d3.geoGraticule();

    var svg = d3.create('svg').attr('width', W).attr('height', H).attr('xmlns', 'http://www.w3.org/2000/svg');

    svg.append('rect').attr('width', W).attr('height', H);

    if (style === 'vintage') {
      svg.select('rect').attr('fill', '#0f1015');
      svg.append('path').attr('d', path(grat())).attr('fill', 'none').attr('stroke', 'rgba(180,160,120,0.08)').attr('stroke-width', 0.5);
      svg.append('path').attr('d', path(countries)).attr('fill', '#2e4d60').attr('stroke', 'none');
      svg.append('path').attr('d', path(borders)).attr('fill', 'none').attr('stroke', '#8a9fa8').attr('stroke-width', 1.0);
    } else {
      svg.select('rect').attr('fill', '#0d0d0d');
      svg.append('path').attr('d', path(grat())).attr('fill', 'none').attr('stroke', 'rgba(211,47,47,0.06)').attr('stroke-width', 0.5);
      svg.append('path').attr('d', path(countries)).attr('fill', '#1a1a1a').attr('stroke', 'none');
      svg.append('path').attr('d', path(borders)).attr('fill', 'none').attr('stroke', '#ff3d00').attr('stroke-width', 0.6);
    }

    var svgStr = new XMLSerializer().serializeToString(svg.node());
    var blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var img = new Image();
    img.onload = function () {
      URL.revokeObjectURL(url);
      var c = document.createElement('canvas');
      c.width = W; c.height = H;
      var ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);

      if (style === 'vintage') {
        var g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.6);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.6, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        for (var i = 0; i < 5000; i++) {
          ctx.fillStyle = 'rgba(255,255,255,' + (Math.random()*0.015) + ')';
          ctx.fillRect(Math.random()*W, Math.random()*H, 1, 1);
        }
      } else {
        var g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.65);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.7, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(255,61,0,0.06)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        for (var i = 0; i < 3000; i++) {
          ctx.fillStyle = 'rgba(255,61,0,' + (Math.random()*0.012) + ')';
          ctx.fillRect(Math.random()*W, Math.random()*H, 1, 1);
        }
      }

      cb(c);
    };
    img.src = url;
  }

  function texFromCanvas(c) {
    var t = new THREE.CanvasTexture(c);
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.flipY = true;
    t.needsUpdate = true;
    return t;
  }

  /* === Load world === */
  var loading = false;
  function loadTextures() {
    if (loading) return;
    loading = true;

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (world) {
        renderMapToImage(world, 'vintage', function (c) {
          vintageMat.map = texFromCanvas(c); vintageMat.needsUpdate = true;
          renderMapToImage(world, 'modern', function (c) {
            modernMat.map = texFromCanvas(c); modernMat.needsUpdate = true;
            ready = true;
            if (spinner) spinner.style.display = 'none';
          });
        });
      })
      .catch(function (e) {
        console.error('Globe error:', e);
        ready = true;
        if (spinner) spinner.style.display = 'none';
      });
  }

  setTimeout(loadTextures, 100);

  /* === Animation === */
  function loop(time) {
    requestAnimationFrame(loop);
    if (startTime === null && ready) { startTime = time; }
    tick(time);
    renderer.render(scene, cam);
  }

  function tick(time) {
    var dt = startTime === null ? 0 : time - startTime;

    if (!ready) {
      vintageMesh.rotation.y += 0.002;
      return;
    }

    /* Vintage phase */
    if (dt < T.VINTAGE) {
      vintageMesh.rotation.y += rotationSpeed;
      modernMesh.rotation.y = vintageMesh.rotation.y;
      vintageMesh.visible = true;  vintageMat.opacity = 1;
      modernMesh.visible = false;
      return;
    }

    /* Transition: vintage → modern */
    if (dt < TOTAL) {
      var p = (dt - T.VINTAGE) / T.TRANS;
      var e = 1 - Math.pow(1 - p, 3);
      vintageMesh.rotation.y += rotationSpeed;
      modernMesh.rotation.y = vintageMesh.rotation.y;
      vintageMat.opacity = 1 - e;  vintageMesh.visible = true;
      modernMat.opacity = e;       modernMesh.visible = true;
      return;
    }

    /* Modern phase (remain) */
    vintageMesh.rotation.y += rotationSpeed;
    modernMesh.rotation.y = vintageMesh.rotation.y;
    vintageMesh.visible = false;
    modernMat.opacity = 1;  modernMesh.visible = true;
  }

  requestAnimationFrame(loop);

  window.addEventListener('resize', function () {
    w = el.clientWidth || window.innerWidth;
    h = el.clientHeight || window.innerHeight;
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
