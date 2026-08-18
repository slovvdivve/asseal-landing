document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  navToggle?.addEventListener("click", () => {
    const isOpen = !mobileNav.classList.contains("hidden");
    mobileNav.classList.toggle("hidden");
    navToggle.setAttribute("aria-expanded", String(!isOpen));
  });
  mobileNav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => mobileNav.classList.add("hidden"));
  });

  // Scroll reveal. Content must never stay permanently invisible if the
  // observer fails to fire for any reason, so every element also gets a
  // hard time-based fallback in addition to the intersection trigger.
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
    setTimeout(() => {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      io.disconnect();
    }, 4000);
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Hero seal stamp-in
  const heroSeal = document.getElementById("heroSeal");
  if (heroSeal) {
    requestAnimationFrame(() => heroSeal.classList.add("seal-animate"));
  }

  // Services mobile carousel: dot indicators reflect and control which card is in view
  const servicesCarousel = document.getElementById("servicesCarousel");
  const servicesDots = document.querySelectorAll(".services-dot");
  if (servicesCarousel && servicesDots.length) {
    const cards = Array.from(servicesCarousel.children);

    function setActiveDot(index) {
      servicesDots.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle("bg-oxblood", active);
        dot.classList.toggle("bg-paper-line", !active);
        dot.setAttribute("aria-selected", String(active));
      });
    }

    servicesDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = Number(dot.getAttribute("data-index"));
        setActiveDot(index);
        cards[index]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      });
    });

    // Derived directly from scroll position rather than IntersectionObserver:
    // more reliable across browsers/environments and needs no threshold tuning.
    servicesCarousel.addEventListener("scroll", () => {
      const width = servicesCarousel.clientWidth || 1;
      const index = Math.round(servicesCarousel.scrollLeft / width);
      setActiveDot(Math.max(0, Math.min(cards.length - 1, index)));
    }, { passive: true });
  }

  // Process steps: click to reveal extra detail (easter-egg style progressive disclosure)
  document.querySelectorAll(".process-step-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const step = trigger.closest(".process-step");
      const detail = step.querySelector(".process-step-detail");
      const icon = trigger.querySelector(".process-step-icon");
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isOpen));
      detail.classList.toggle("hidden", isOpen);
      icon.textContent = isOpen ? "+" : "–";
    });
  });

  // Contact channel toggle
  const channelTelegram = document.getElementById("channelTelegram");
  const channelEmail = document.getElementById("channelEmail");
  const panelTelegram = document.getElementById("panelTelegram");
  const panelEmail = document.getElementById("panelEmail");

  function setChannel(channel) {
    const tgActive = channel === "telegram";
    panelTelegram.classList.toggle("hidden", !tgActive);
    panelEmail.classList.toggle("hidden", tgActive);
    channelTelegram.classList.toggle("btn-primary", tgActive);
    channelTelegram.classList.toggle("btn-ghost-dark", !tgActive);
    channelEmail.classList.toggle("btn-primary", !tgActive);
    channelEmail.classList.toggle("btn-ghost-dark", tgActive);
    channelTelegram.setAttribute("aria-selected", String(tgActive));
    channelEmail.setAttribute("aria-selected", String(!tgActive));
  }
  channelTelegram?.addEventListener("click", () => setChannel("telegram"));
  channelEmail?.addEventListener("click", () => setChannel("email"));

  // Email panel: build a mailto: link from the form fields.
  // NOTE: there is no backend yet (a custom admin panel is planned separately),
  // so this is a functional stopgap, not a silent form submission.
  const emailForm = document.getElementById("panelEmail");
  emailForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = emailForm.name.value.trim();
    const email = emailForm.email.value.trim();
    const phone = emailForm.phone.value.trim();
    const message = emailForm.message.value.trim();

    const subject = `Заявка с сайта Asseal — ${name}`;
    const bodyLines = [
      `Имя: ${name}`,
      `Email: ${email}`,
      phone ? `Телефон: ${phone}` : null,
      "",
      message,
    ].filter(Boolean);

    const mailto = `mailto:kirill@asseal.ae?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;
  });
});
