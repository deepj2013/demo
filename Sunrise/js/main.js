(() => {
  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  const toTop = document.getElementById("toTop");
  const year = document.getElementById("year");
  const hoursStatus = document.getElementById("hoursStatus");
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxClose = document.getElementById("lightboxClose");

  if (year) year.textContent = new Date().getFullYear();

  /* Mobile nav */
  navToggle?.addEventListener("click", () => {
    mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open");
  });

  mainNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle?.classList.remove("is-open");
    });
  });

  /* Sticky header + back to top */
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 20);
    toTop?.classList.toggle("is-visible", y > 500);

    const sections = document.querySelectorAll("section[id]");
    let current = "home";
    sections.forEach((section) => {
      if (y >= section.offsetTop - 140) current = section.id;
    });
    mainNav?.querySelectorAll("a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* Hero slider */
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dotsWrap = document.getElementById("heroDots");
  let slideIndex = 0;
  let timer;

  const goTo = (index) => {
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === slideIndex));
    dotsWrap?.querySelectorAll("button").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === slideIndex);
    });
  };

  const startAuto = () => {
    clearInterval(timer);
    timer = setInterval(() => goTo(slideIndex + 1), 5500);
  };

  if (dotsWrap && slides.length) {
    slides.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `Go to slide ${i + 1}`);
      if (i === 0) btn.classList.add("is-active");
      btn.addEventListener("click", () => {
        goTo(i);
        startAuto();
      });
      dotsWrap.appendChild(btn);
    });
  }

  document.getElementById("heroPrev")?.addEventListener("click", () => {
    goTo(slideIndex - 1);
    startAuto();
  });
  document.getElementById("heroNext")?.addEventListener("click", () => {
    goTo(slideIndex + 1);
    startAuto();
  });

  startAuto();

  /* Hours status (Delhi) */
  if (hoursStatus) {
    try {
      const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      const day = now.getDay(); // 0 Sun
      const hour = now.getHours();
      const open = day !== 0 && hour >= 8 && hour < 14;
      if (open) {
        hoursStatus.textContent = "Open now · Closes 2:00 PM";
        hoursStatus.style.color = "#1aa89b";
      } else if (day === 0) {
        hoursStatus.textContent = "Closed today · Opens 8:00 AM Monday";
      } else if (hour < 8) {
        hoursStatus.textContent = "Closed · Opens 8:00 AM today";
      } else {
        const next = day === 6 ? "Monday" : "tomorrow";
        hoursStatus.textContent = `Closed · Opens 8:00 AM ${next}`;
      }
    } catch {
      hoursStatus.textContent = "Opens 8:00 AM on school days";
    }
  }

  /* Gallery lightbox */
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const img = item.querySelector("img");
      if (!img || !lightbox) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxTitle.textContent = item.dataset.title || img.alt;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  };

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* Contact form demo */
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    formSuccess.hidden = false;
    contactForm.reset();
    setTimeout(() => {
      formSuccess.hidden = true;
    }, 4000);
  });

  /* Scroll reveal */
  const revealTargets = document.querySelectorAll(
    ".feature-item, .program-card, .activity-item, .gallery-item, .staff-card, .news-card, .about-copy, .about-media, .contact-form, .contact-info"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el) => io.observe(el));
})();
