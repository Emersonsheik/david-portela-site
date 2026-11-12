/* David Portela — interações da landing page
   - menu fixo que ganha fundo ao rolar
   - blocos que aparecem conforme entram na tela
   - destaque do item do menu da seção atual
   - transição de "slide" ao clicar no menu
   - formulário que monta a mensagem do WhatsApp */
(function () {
  'use strict';

  var WHATSAPP = '5588988160959';
  var HEADER_OFFSET = 76;
  var SECTIONS = ['inicio', 'servicos', 'sobre', 'contato'];

  var app = document.getElementById('app');
  var header = document.querySelector('.hdr');
  var wipe = document.querySelector('.wipe');
  var navLinks = document.querySelectorAll('.nv[data-go]');
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

  // Transição de slide ao clicar no menu
  var t1, t2, t3;
  function scrollToSection(section, behavior) {
    var top = section.id === 'inicio' ? 0 : section.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
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
      scrollToSection(section, 'smooth');
      return;
    }

    clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    transitioning = true;
    document.querySelectorAll('.replay').forEach(function (s) { s.classList.remove('replay'); });
    wipe.classList.remove('out', 'intro');
    wipe.classList.add('in');

    t1 = setTimeout(function () {
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

  // Formulário: monta a mensagem e abre o WhatsApp (nada é salvo no site)
  var waButton = document.getElementById('wa-form');
  var fields = [
    ['f-nome', 'Nome'],
    ['f-tel', 'Telefone'],
    ['f-email', 'E-mail'],
    ['f-assunto', 'Assunto'],
    ['f-msg', 'Mensagem']
  ];

  function buildWhatsAppLink() {
    var lines = ['Olá, David! Vim pelo site e gostaria de agendar um atendimento.'];
    fields.forEach(function (field) {
      var el = document.getElementById(field[0]);
      var value = el ? el.value.trim() : '';
      if (value) lines.push(field[1] + ': ' + value);
    });
    waButton.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  if (waButton) {
    fields.forEach(function (field) {
      var el = document.getElementById(field[0]);
      if (!el) return;
      el.addEventListener('input', buildWhatsAppLink);
      el.addEventListener('change', buildWhatsAppLink);
    });
    buildWhatsAppLink();
  }
})();
