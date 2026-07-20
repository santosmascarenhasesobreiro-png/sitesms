
document.addEventListener("DOMContentLoaded", () => {

  /* ==============================
     CARROSSEL DE VÍDEOS (TOPO)
  ============================== */
  (function initVideoCarousel() {
    const videoTrack   = document.querySelector(".carousel-track.video");
    const leftVideoBtn = document.querySelector(".carousel-btn.left.video");
    const rightVideoBtn= document.querySelector(".carousel-btn.right.video");

    if (!videoTrack || !leftVideoBtn || !rightVideoBtn) return;

    const videos = videoTrack.querySelectorAll("video");
    if (!videos.length) return;

    let currentIndex = 0;
    const visibleCount = 3;

    function getCardWidth() {
      const first = videos[0];
      if (!first) return 0;
      const rect = first.getBoundingClientRect();
      // 20px de gap assumido no layout original
      return (rect.width || first.offsetWidth || 0) + 20;
    }

    function updateVideoCarousel() {
      videos.forEach(v => {
        v.classList.remove("active");
        v.style.opacity = "0.6";
        v.style.transform = "scale(1)";
        v.style.zIndex = "0";
      });

      const videoWidth = getCardWidth();
      videoTrack.style.transform = `translateX(-${currentIndex * videoWidth}px)`;

      const highlightIndex = currentIndex + 1;
      if (videos[highlightIndex]) {
        const el = videos[highlightIndex];
        el.classList.add("active");
        el.style.opacity = "1";
        el.style.transform = "scale(1.05)";
        el.style.zIndex = "2";
      }
    }

    const maxStep = Math.max(1, videos.length - visibleCount + 1);

    function nextSlide() {
      currentIndex = (currentIndex + 1) % maxStep;
      updateVideoCarousel();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + maxStep) % maxStep;
      updateVideoCarousel();
    }

    rightVideoBtn.addEventListener("click", nextSlide);
    leftVideoBtn.addEventListener("click", prevSlide);

    // autoplay
    let auto = setInterval(nextSlide, 5000);
    // pausa ao focar com mouse/teclado
    videoTrack.addEventListener("mouseenter", () => { clearInterval(auto); });
    videoTrack.addEventListener("mouseleave", () => { auto = setInterval(nextSlide, 5000); });

    updateVideoCarousel();
  })();


  /* ==============================
     CARROSSEL DE FRASES "VOCÊ SABIA?"
  ============================== */
  (function initVoceSabia() {
    const sec   = document.querySelector('.vc-sabia-fundo');
    if (!sec) return;

    const card   = sec.querySelector('.vc-card') || sec;
    const items  = Array.from(sec.querySelectorAll('.vc-sabia-carousel .vc-item'));
    const prev   = sec.querySelector('.vc-prev');
    const next   = sec.querySelector('.vc-next');
    const dotsEl = sec.querySelector('.vc-dots');

    if (!items.length) return;

    let dots = [];
    if (dotsEl) {
      dotsEl.innerHTML = "";
      items.forEach((_, idx) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', `Ir para item ${idx + 1}`);
        b.dataset.index = String(idx);
        dotsEl.appendChild(b);
      });
      dots = Array.from(dotsEl.querySelectorAll('button'));
    }

    let i = 0;
    let timer = null;

    function show(idx) {
      items[i].classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');

      i = (idx + items.length) % items.length;

      items[i].classList.add('active');
      if (dots[i]) dots[i].classList.add('active');
    }

    function nextItem() { show(i + 1); }
    function prevItem() { show(i - 1); }

    function start() {
      stop();
      timer = setInterval(nextItem, 4000);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    dots.forEach(d => d.addEventListener('click', () => { show(Number(d.dataset.index)); start(); }));
    if (next) next.addEventListener('click', () => { nextItem(); start(); });
    if (prev) prev.addEventListener('click', () => { prevItem(); start(); });

    if (card) {
      card.addEventListener('mouseenter', stop);
      card.addEventListener('mouseleave', start);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { nextItem(); start(); }
        if (e.key === 'ArrowLeft')  { prevItem(); start(); }
      });
      // garantir foco via keyboard se for card
      if (card.tabIndex < 0) card.tabIndex = 0;
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });

    if (dots[0]) dots[0].classList.add('active');
    show(0);
    start();
  })();


  /* ==============================
     SLIDESHOW COM EFEITO DE PULO
  ============================== */
  (function initSlideshowBounce() {
    const slides = document.querySelectorAll(".slideshow-bounce .slide-container img");
    if (!slides.length) return;

    let currentIndex = 0;

    function showSlide(index) {
      slides.forEach(slide => {
        slide.classList.remove("active");
        slide.style.zIndex = "0";
      });
      slides[index].classList.add("active");
      slides[index].style.zIndex = "1";
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }

    showSlide(currentIndex);
    setInterval(nextSlide, 3000);
  })();


  /* ==============================
     MODAL PARA "Atuação Jurídica"
  ============================== */
  (function initModalCards() {
    const modal      = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc  = document.getElementById("modal-desc");
    const modalLink  = document.getElementById("modal-link");
    const modalClose = document.getElementById("modal-close");

    if (!modal || !modalTitle || !modalDesc || !modalLink || !modalClose) return;

    const cardsData = {
      equipe: {
        title: "Nossa Equipe",
        description: "Conheça os profissionais especializados que atuam no nosso escritório, prontos para lhe atender.",
        url: "equipe.html"
      },
      areas: {
        title: "Áreas que Atuamos",
        description: "Direito Civil, Família, Trabalhista, Consumidor e outras áreas para melhor lhe atender.",
        url: "areas.html"
      },
      causas: {
        title: "Causas de Sucesso",
        description: "Confira algumas vitórias importantes em processos onde atuamos com dedicação e sucesso.",
        url: "casos.html"
      }
    };

    function openModal(key) {
      const data = cardsData[key];
      if (!data) return;
      modalTitle.textContent = data.title;
      modalDesc.textContent  = data.description;
      modalLink.href         = data.url;
      modal.classList.add("show");
    }
    function closeModal() {
      modal.classList.remove("show");
    }

    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

    const cardEquipe = document.querySelector(".contato-card.equipe a");
    const cardAreas  = document.querySelector(".contato-card.areas a");
    const cardCausas = document.querySelector(".contato-card.causas a");

    if (cardEquipe) cardEquipe.addEventListener("click", e => { e.preventDefault(); openModal("equipe"); });
    if (cardAreas)  cardAreas.addEventListener("click",  e => { e.preventDefault(); openModal("areas");  });
    if (cardCausas) cardCausas.addEventListener("click", e => { e.preventDefault(); openModal("causas"); });
  })();


  /* ==============================
     CHATBOT FLUTUANTE
  ============================== */
  (function initChatbot() {
    const chatbot           = document.getElementById("chatbot");
    const toggleBtn         = document.getElementById("chatbot-toggle");
    const closeBtn          = document.getElementById("chatbot-close");
    const messagesContainer = document.getElementById("chatbot-messages");
    const inputField        = document.getElementById("chatbot-input");

    if (!chatbot || !toggleBtn || !closeBtn || !messagesContainer || !inputField) return;

    toggleBtn.addEventListener("click", () => {
      chatbot.style.display = "flex";
      toggleBtn.style.display = "none";
      inputField.focus();
    });

    closeBtn.addEventListener("click", () => {
      chatbot.style.display = "none";
      toggleBtn.style.display = "block";
    });

    const respostas = {
      "processo": "Podemos lhe ajudar, me conte seu caso.",
      "juridico": "Jurídico blabla.",
      "ola": "Olá, como posso ajudar?",
      "horário": "Nosso atendimento é de segunda a sexta, das 9h às 18h.",
      "documentos": "Para iniciar seu processo, leve RG, CPF e comprovante de residência.",
      "áreas": "Atuamos em Direito Civil, Família, Trabalhista e mais.",
      "contato": "Você pode nos ligar no (XX) XXXX-XXXX ou enviar WhatsApp pelo site."
    };

    function appendMessage(text, className) {
      const msg = document.createElement("div");
      msg.classList.add("message", className);
      msg.textContent = text;
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function botResponse(input) {
      const low = input.toLowerCase();
      for (let key in respostas) {
        if (low.includes(key)) return respostas[key];
      }
      return "Desculpe, não entendi sua pergunta. Pode reformular?";
    }

    function sendMessage() {
      const input = inputField.value.trim();
      if (!input) return;
      appendMessage(input, "user");
      inputField.value = "";
      const response = botResponse(input);
      setTimeout(() => appendMessage(response, "bot"), 600);
    }

    inputField.addEventListener("keydown", e => {
      if (e.key === "Enter") sendMessage();
    });
  })();


  /* ==============================
     NÚMEROS ANIMADOS EM #destaques
  ============================== */
  (function initAnimatedNumbers() {
    const destaquesSection = document.querySelector('#destaques');
    if (!destaquesSection) return;

    function formatarNumero(num) {
      if (num >= 1_000_000_000) return '+' + (num / 1_000_000_000).toFixed(0) + ' Bi';
      if (num >= 1_000_000)     return '+' + (num / 1_000_000).toFixed(0)     + ' mi';
      if (num >= 1000)          return '+' + num.toLocaleString('pt-BR');
      return String(num);
    }

    function animarNumeros() {
      const numeros = destaquesSection.querySelectorAll('.destaque h2');
      numeros.forEach((el) => {
        const valorFinal = Number(el.getAttribute('data-numero')) || 0;
        const duracao = 1800; // ms
        const incremento = Math.max(1, Math.ceil(valorFinal / (duracao / 20)));
        let atual = 0;

        const contador = setInterval(() => {
          atual += incremento;
          if (atual >= valorFinal) {
            el.textContent = formatarNumero(valorFinal);
            clearInterval(contador);
          } else {
            el.textContent = formatarNumero(atual);
          }
        }, 20);
      });
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animarNumeros();
          obs.unobserve(entry.target); // roda só uma vez
        }
      });
    }, { threshold: 0.5 });

    observer.observe(destaquesSection);
  })();

}); // fim do DOMContentLoaded
