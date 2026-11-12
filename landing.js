/* David Portela — interações da landing page
   - menu fixo que ganha fundo ao rolar
   - blocos que aparecem conforme entram na tela
   - destaque do item do menu da seção atual
   - transição de "slide" ao clicar no menu
   - formulário que monta a mensagem do WhatsApp */
(function () {
  'use strict';

  var SECTIONS = ['inicio', 'servicos', 'sobre', 'contato'];

  var app = document.getElementById('app');
  var header = document.querySelector('.hdr');
  var wipe = document.querySelector('.wipe');
  var navLinks = document.querySelectorAll('.nv[data-go], .mlink[data-go]');
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu-mobile');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var transitioning = false;

  // Abertura: o painel com o monograma cobre a tela e sai como um slide (CSS);
  // depois que as animações terminam, as classes de controle saem
  setTimeout(function () { wipe.classList.remove('intro'); }, 2200);
  setTimeout(function () { app.classList.remove('boot'); }, 3200);


  // Blocos que aparecem ao rolar
  if (hasIO) {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          reveal.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    document.querySelectorAll('[data-rv]').forEach(function (el) { reveal.observe(el); });
    app.classList.add('armed');
  }

  // Destaque do item do menu conforme a seção visível
  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle('on', a.getAttribute('data-go') === id);
    });
  }
  function currentSection() {
    var current = SECTIONS[0];
    SECTIONS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
    });
    return current;
  }

  // Menu fixo: fundo translúcido depois que a página começa a rolar
  function onScroll() {
    header.classList.toggle('sc', window.scrollY > 24);
    if (!transitioning) setActive(currentSection());
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu do celular (abre em tela cheia; os links usam a mesma transição de slide)
  function openMenu() {
    if (!menu) return;
    menu.classList.add('open');
    menu.inert = false;
    menu.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Fechar menu');
    document.documentElement.classList.add('menu-aberto');
    var current = menu.querySelector('.mlink.on') || menu.querySelector('a');
    if (current) current.focus({ preventScroll: true });
  }
  function closeMenu(returnFocus) {
    if (!menu || !menu.classList.contains('open')) return;
    menu.classList.remove('open');
    menu.inert = true;
    menu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Abrir menu');
    document.documentElement.classList.remove('menu-aberto');
    if (returnFocus) menuBtn.focus();
  }
  if (menu && menuBtn) {
    menu.inert = true;
    menuBtn.addEventListener('click', function () {
      if (menu.classList.contains('open')) closeMenu(true);
      else openMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu(true);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeMenu(false);
    });
  }

  // Transição de slide ao clicar no menu
  var t1, t2, t3;
  function scrollToSection(section, behavior) {
    var top = section.id === 'inicio' ? 0 : section.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    var html = document.documentElement;
    var previous = html.style.scrollBehavior;
    if (behavior === 'auto') html.style.scrollBehavior = 'auto';
    window.scrollTo({ top: Math.max(0, top), behavior: behavior });
    html.style.scrollBehavior = previous;
  }

  function go(id) {
    var section = document.getElementById(id);
    if (!section) return;
    setActive(id);
    if (history.replaceState) history.replaceState(null, '', '#' + id);

    if (reduceMotion) {
      closeMenu(false);
      scrollToSection(section, 'smooth');
      return;
    }

    clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    transitioning = true;
    document.querySelectorAll('.replay').forEach(function (s) { s.classList.remove('replay'); });
    wipe.classList.remove('out', 'intro');
    wipe.classList.add('in');

    t1 = setTimeout(function () {
      closeMenu(false); // o menu do celular fecha por trás do painel
      scrollToSection(section, 'auto');
      section.querySelectorAll('[data-rv]').forEach(function (el) { el.classList.add('in'); });
      void section.offsetWidth; // reinicia a animação se a mesma seção for escolhida de novo
      section.classList.add('replay');
      wipe.classList.remove('in');
      wipe.classList.add('out');
      t2 = setTimeout(function () {
        wipe.classList.remove('out');
        transitioning = false;
      }, 760);
      t3 = setTimeout(function () { section.classList.remove('replay'); }, 1900);
    }, 640);
  }

  document.querySelectorAll('[data-go]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      go(link.getAttribute('data-go'));
    });
  });

  // Formulário: envia direto para o e-mail do David pelo FormSubmit (sem servidor próprio).
  // Na primeira mensagem, o FormSubmit manda um e-mail de ativação para o endereço abaixo;
  // depois de confirmar uma vez, as mensagens passam a chegar normalmente.
  var EMAIL = 'davidportelaadv@gmail.com';
  var form = document.getElementById('contact-form');
  var formButton = document.getElementById('form-btn');
  var formButtonLabel = document.getElementById('form-btn-label');
  var formStatus = document.getElementById('form-status');

  function showStatus(message, success) {
    formStatus.textContent = message;
    formStatus.style.color = success ? '#E2C886' : '#F2B8A0';
  }

  if (form && window.fetch) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      if (data._honey) return; // robôs de spam preenchem o campo escondido
      if (data.assunto) data._subject = 'Novo contato pelo site: ' + data.assunto;

      formButton.disabled = true;
      formButtonLabel.textContent = 'Enviando…';
      showStatus('', true);

      fetch('https://formsubmit.co/ajax/' + EMAIL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (response) {
          return response.json().then(function (body) {
            if (!response.ok || String(body.success) !== 'true') throw new Error(body.message || 'Falha no envio');
          });
        })
        .then(function () {
          form.reset();
          showStatus('Mensagem enviada! Ela vai direto para o e-mail do David.', true);
        })
        .catch(function () {
          showStatus('Não foi possível enviar agora. Tente de novo em instantes ou escreva para ' + EMAIL + '.', false);
        })
        .then(function () {
          formButton.disabled = false;
          formButtonLabel.textContent = 'Enviar mensagem';
        });
    });
  }
})();
