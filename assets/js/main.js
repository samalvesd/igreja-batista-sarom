(function(){
  "use strict";

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ================= CONFIG ================= */
  var PASTOR_WHATSAPP_NUMBER = "5582996081198"; // ex: 5582999999999
  var waBtn = document.getElementById('whatsappBtn');
  waBtn.href = "https://wa.me/" + PASTOR_WHATSAPP_NUMBER;

  /* ================= NAVBAR SCROLL STATE ================= */
  var navbar = document.getElementById('navbar');
  function onScroll(){
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* Active link on scroll */
  var navLinks = document.querySelectorAll('[data-nav]');
  var sections = ['sobre','cultos','igrejas','contato'].map(function(id){ return document.getElementById(id); });
  function updateActive(){
    var y = window.scrollY + window.innerHeight/2;
    var current = null;
    sections.forEach(function(sec){ if(sec && sec.offsetTop <= y) current = sec.id; });
    navLinks.forEach(function(a){
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateActive, {passive:true});
  updateActive();

  /* ================= MOBILE MENU ================= */
  var toggle = document.getElementById('navToggle');
  var closeBtn = document.getElementById('navClose');
  var menu = document.getElementById('mobileMenu');
  function openMenu(){ menu.classList.add('open'); toggle.setAttribute('aria-expanded','true'); menu.querySelector('a').focus(); }
  function closeMenu(){ menu.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.focus(); }
  toggle.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && menu.classList.contains('open')) closeMenu(); });

  /* ================= GSAP SCROLLTRIGGER REVEALS ================= */
  if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);

    if(!prefersReduced){
      // Hero entrance
      gsap.timeline({defaults:{ease:'power3.out'}})
        .to('.hero-content [data-reveal]', {
          opacity:1, y:0, duration:1, stagger:0.15, delay:0.2
        });

      // Generic section reveals
      document.querySelectorAll('section:not(.hero) [data-reveal]').forEach(function(el){
        gsap.to(el, {
          opacity:1, y:0, duration:0.9, ease:'power3.out',
          scrollTrigger:{ trigger: el, start: 'top 85%' }
        });
      });

      // Cultos: sequential stagger
      gsap.utils.toArray('.culto-item').forEach(function(item, i){
        gsap.to(item, {
          opacity:1, y:0, duration:0.7, delay:i*0.08, ease:'power2.out',
          scrollTrigger:{ trigger: item, start:'top 90%' }
        });
      });

      // subtle parallax on about visual
      gsap.to('.about-visual', {
        y: -24, ease:'none',
        scrollTrigger:{ trigger:'#sobre', start:'top bottom', end:'bottom top', scrub:true }
      });
    } else {
      document.querySelectorAll('[data-reveal]').forEach(function(el){
        el.style.opacity = 1; el.style.transform = 'none';
      });
    }
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function(el){
      el.style.opacity = 1; el.style.transform = 'none';
    });
  }

  /* ================= THREE.JS — HERO PARTICLES ================= */
  (function initHeroParticles(){
    if(prefersReduced || !window.THREE) return;
    var canvas = document.getElementById('hero-canvas');
    if(!canvas) return;

    var renderer, scene, camera, points, raf;
    var mouse = {x:0, y:0};

    function setup(){
      var w = canvas.clientWidth, h = canvas.clientHeight;
      renderer = new THREE.WebGLRenderer({canvas:canvas, alpha:true, antialias:true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(w, h, false);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(55, w/h, 0.1, 100);
      camera.position.z = 14;

      var count = 220;
      var positions = new Float32Array(count * 3);
      for(var i=0;i<count;i++){
        var r = 5 + Math.random()*7;
        var theta = Math.random()*Math.PI*2;
        var y = (Math.random()-0.5)*8;
        positions[i*3] = Math.cos(theta)*r;
        positions[i*3+1] = y;
        positions[i*3+2] = Math.sin(theta)*r - 4;
      }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      var mat = new THREE.PointsMaterial({
        color: 0xC6A15B, size: 0.045, transparent:true, opacity:0.55, sizeAttenuation:true
      });
      points = new THREE.Points(geo, mat);
      scene.add(points);

      // faint ring echoing the logo
      var ringGeo = new THREE.RingGeometry(6.6, 6.66, 80);
      var ringMat = new THREE.MeshBasicMaterial({color:0x688B58, transparent:true, opacity:0.12, side:THREE.DoubleSide});
      var ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI/2.3;
      ring.position.z = -4;
      scene.add(ring);
    }

    function animate(){
      raf = requestAnimationFrame(animate);
      if(points){
        points.rotation.y += 0.0007;
        points.rotation.x += 0.0002;
        camera.position.x += (mouse.x*0.6 - camera.position.x) * 0.02;
        camera.position.y += (-mouse.y*0.3 - camera.position.y) * 0.02;
        camera.lookAt(0,0,-4);
      }
      renderer.render(scene, camera);
    }

    function onResize(){
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if(!w || !h) return;
      camera.aspect = w/h; camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }

    window.addEventListener('mousemove', function(e){
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, {passive:true});
    window.addEventListener('resize', onResize);

    setup();
    animate();

    // cleanup if hero ever unmounts (SPA-safety, defensive)
    window.addEventListener('beforeunload', function(){
      cancelAnimationFrame(raf);
      renderer && renderer.dispose();
    });
  })();

  /* ================= MEMBER LIST ================= */
  (function memberModule(){
    var form = document.getElementById('memberForm');
    var input = document.getElementById('memberName');
    var list = document.getElementById('memberList');
    var empty = document.getElementById('memberEmpty');
    var msg = document.getElementById('formMsg');

    // In-memory data layer (dev only). Production: replace with Supabase/backend call.
    var members = [];

    function sanitize(str){
      return str.replace(/[<>"'`]/g, '').replace(/\s+/g,' ').trim();
    }

    function render(){
      list.innerHTML = '';
      empty.style.display = members.length ? 'none' : 'block';
      members.forEach(function(name){
        var li = document.createElement('li');
        li.textContent = name;
        list.appendChild(li);
        if(window.gsap && !prefersReduced){
          gsap.from(li, {opacity:0, y:8, duration:0.4, ease:'power2.out'});
        }
      });
    }

    function setMsg(text, type){
      msg.textContent = text;
      msg.className = 'form-msg' + (type ? ' ' + type : '');
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var raw = sanitize(input.value);

      if(!raw){
        setMsg('Por favor, digite um nome antes de enviar.', 'error');
        input.focus();
        return;
      }
      if(raw.length > 60){
        setMsg('O nome é muito longo. Use até 60 caracteres.', 'error');
        return;
      }
      var exists = members.some(function(m){ return m.toLowerCase() === raw.toLowerCase(); });
      if(exists){
        setMsg('Esse nome já está na lista. Obrigado por fazer parte!', 'error');
        return;
      }

      setMsg('Adicionando...', '');
      window.setTimeout(function(){
        members.push(raw);
        render();
        setMsg('Nome adicionado com sucesso. Bem-vindo(a) à família!', 'success');
        input.value = '';
      }, 250);
    });

    render();
  })();

  /* ================= GALLERY CAROUSEL ================= */
  (function galleryModule(){
    var viewport = document.getElementById('galleryViewport');
    var dotsWrap = document.getElementById('galleryDots');
    var prevBtn = document.getElementById('galleryPrev');
    var nextBtn = document.getElementById('galleryNext');

    var slides = [
      { src: 'assets/gallery/igreja-01.jpeg', caption: 'Confraternização em família' },
      { src: 'assets/gallery/igreja-02.jpeg', caption: 'Batismo nas águas' },
      { src: 'assets/gallery/igreja-03.jpeg', caption: 'Celebração de 10 anos da igreja' },
      { src: 'assets/gallery/igreja-04.jpeg', caption: 'Escola Bíblica - Iniciantes na Fé' },
      { src: 'assets/gallery/igreja-05.jpeg', caption: 'Culto especial: Mulheres que Oram' },
      { src: 'assets/gallery/igreja-06.jpeg', caption: 'Evangelismo', position: 'center 25%' },
      { src: 'assets/gallery/igreja-07.jpeg', caption: 'Homenagem em culto especial', position: 'center 25%' },
      { src: 'assets/gallery/igreja-08.jpeg', caption: 'Escola bíblica infantil' },
      { src: 'assets/gallery/igreja-09.jpeg', caption: 'Reunião de Mulheres - MUBISA' }
    ];

    var current = 0, timer = null;

    function build(){
      viewport.innerHTML = '';
      slides.forEach(function(slide, i){
        var div = document.createElement('div');
        div.className = 'gallery-slide' + (i===0 ? ' active' : '');
        div.setAttribute('role','group');
        div.setAttribute('aria-roledescription','slide');
        div.setAttribute('aria-label', (i+1) + ' de ' + slides.length);

        var img = document.createElement('img');
        img.src = slide.src;
        img.alt = slide.caption;
        img.loading = i === 0 ? 'eager' : 'lazy';
        // Fotos em retrato (pessoas de corpo inteiro): prioriza o topo (rostos)
        // em vez de cortar simetricamente e cortar cabeças.
        if(slide.position){ img.style.objectPosition = slide.position; }
        div.appendChild(img);

        var cap = document.createElement('span');
        cap.className = 'cap';
        cap.textContent = slide.caption;
        div.appendChild(cap);

        viewport.appendChild(div);
      });
      dotsWrap.innerHTML = '';
      slides.forEach(function(_, i){
        var b = document.createElement('button');
        b.className = 'gallery-dot' + (i===0 ? ' active' : '');
        b.setAttribute('aria-label', 'Ir para foto ' + (i+1));
        b.addEventListener('click', function(){ goTo(i); });
        dotsWrap.appendChild(b);
      });
    }

    function goTo(i){
      current = (i + slides.length) % slides.length;
      viewport.querySelectorAll('.gallery-slide').forEach(function(el, idx){
        el.classList.toggle('active', idx === current);
      });
      dotsWrap.querySelectorAll('.gallery-dot').forEach(function(el, idx){
        el.classList.toggle('active', idx === current);
      });
    }

    function next(){ goTo(current+1); }
    function prev(){ goTo(current-1); }

    function startAutoplay(){
      if(prefersReduced || slides.length < 2) return;
      stopAutoplay();
      timer = window.setInterval(next, 4500);
    }
    function stopAutoplay(){ if(timer){ clearInterval(timer); timer = null; } }

    prevBtn.addEventListener('click', function(){ prev(); stopAutoplay(); startAutoplay(); });
    nextBtn.addEventListener('click', function(){ next(); stopAutoplay(); startAutoplay(); });
    viewport.addEventListener('mouseenter', stopAutoplay);
    viewport.addEventListener('mouseleave', startAutoplay);
    viewport.addEventListener('keydown', function(e){
      if(e.key === 'ArrowRight'){ next(); stopAutoplay(); startAutoplay(); }
      if(e.key === 'ArrowLeft'){ prev(); stopAutoplay(); startAutoplay(); }
    });

    // swipe
    var touchX = null;
    viewport.addEventListener('touchstart', function(e){ touchX = e.touches[0].clientX; }, {passive:true});
    viewport.addEventListener('touchend', function(e){
      if(touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if(Math.abs(dx) > 40){ dx < 0 ? next() : prev(); stopAutoplay(); startAutoplay(); }
      touchX = null;
    }, {passive:true});

    build();
    startAutoplay();
  })();

  /* ================= VIDEO FALLBACK ================= */
  (function videoModule(){
    var video = document.getElementById('pastorVideo');
    var fallback = document.getElementById('videoFallback');
    video.addEventListener('error', function(){ fallback.style.display = 'flex'; }, true);
    video.addEventListener('loadeddata', function(){ fallback.style.display = 'none'; });
    fallback.style.display = 'flex';
  })();

})();
