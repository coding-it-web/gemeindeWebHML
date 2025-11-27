// js/main.js

// ---------- ЯЗЫК: определение и применение ----------

function detectLanguage() {
    const saved = localStorage.getItem("siteLang");
    if (saved === "de" || saved === "ru") {
        return saved;
    }

    const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage || "de"];
    const lower = browserLangs.map(l => (l || "").toLowerCase());

    if (lower.some(l => l.startsWith("ru") || l.startsWith("uk"))) {
        return "ru";
    }

    return "de";
}

function applyTranslations(lang) {
    // На всякий случай: если i18n ещё не подключён
    if (typeof i18n === "undefined") {
        document.documentElement.setAttribute("lang", lang === "ru" ? "ru" : "de");
        return;
    }

    const dict = i18n[lang] || i18n.de;

    document.documentElement.setAttribute("lang", lang === "ru" ? "ru" : "de");

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const value = dict[key];
        if (value) {
            el.textContent = value;
        }
    });
}

// ---------- ИНИЦИАЛИЗАЦИЯ ----------

document.addEventListener("DOMContentLoaded", () => {
    const initialLang = detectLanguage();
    applyTranslations(initialLang);

    setupLanguageSwitcher(initialLang);
    setupCarousel();
    setupMobileMenu();
    setupLocationAnimation();
});

// ---------- КАРУСЕЛЬ ----------

function setupCarousel() {
    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dot"));

    if (!slides.length) return;

    let currentIndex = 0;
    const SLIDE_INTERVAL_MS = 8000;
    let timerId = null;

    function goToSlide(index) {
        slides[currentIndex].classList.remove("is-active");
        if (dots[currentIndex]) {
            dots[currentIndex].classList.remove("is-active");
        }

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add("is-active");
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add("is-active");
        }
    }

    function startAutoSlide() {
        if (timerId) {
            clearInterval(timerId);
        }
        timerId = setInterval(() => {
            goToSlide(currentIndex + 1); //test
        }, SLIDE_INTERVAL_MS);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
            startAutoSlide();
        });
    });

    startAutoSlide();
}

// ---------- МОБИЛЬНОЕ МЕНЮ ----------

function setupMobileMenu() {
    const nav = document.querySelector(".main-nav");
    const navToggle = document.querySelector(".nav-toggle");

    if (!nav || !navToggle) return;

    const closeMenu = () => {
        if (nav.classList.contains("is-open")) {
            nav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    };

    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    document.addEventListener("click", (event) => {
        if (!nav.contains(event.target)) {
            closeMenu();
        }
    });
}

// ---------- ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА (дропдаун) ----------

function setupLanguageSwitcher(initialLang) {
    const switcher = document.querySelector(".lang-switcher");
    if (!switcher) return;

    const currentBtn = switcher.querySelector(".lang-current");
    const currentLabel = switcher.querySelector(".lang-current-label");
    const optionButtons = switcher.querySelectorAll(".lang-option");

    let currentLang = initialLang;

    function updateUI(lang) {
        currentLang = lang;

        if (currentLabel) {
            currentLabel.textContent = lang.toUpperCase();
        }

        optionButtons.forEach(btn => {
            const code = btn.getAttribute("data-lang-switch");
            const isActive = code === lang;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-selected", String(isActive));
        });
    }

    updateUI(initialLang);

    if (currentBtn) {
        currentBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = switcher.classList.toggle("is-open");
            currentBtn.setAttribute("aria-expanded", String(isOpen));
        });
    }

    optionButtons.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.stopPropagation();
            const newLang = btn.getAttribute("data-lang-switch");
            if (!newLang) return;

            if (newLang !== currentLang) {
                localStorage.setItem("siteLang", newLang);
                applyTranslations(newLang);
                updateUI(newLang);
            }

            switcher.classList.remove("is-open");
            if (currentBtn) {
                currentBtn.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Закрытие по клику вне
    document.addEventListener("click", (event) => {
        if (!switcher.contains(event.target) && switcher.classList.contains("is-open")) {
            switcher.classList.remove("is-open");
            if (currentBtn) {
                currentBtn.setAttribute("aria-expanded", "false");
            }
        }
    });

    // Закрытие по Esc
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && switcher.classList.contains("is-open")) {
            switcher.classList.remove("is-open");
            if (currentBtn) {
                currentBtn.setAttribute("aria-expanded", "false");
            }
        }
    });
}

// ---------- АНИМАЦИЯ СЕКЦИИ "НАШ ДОМ МОЛИТВЫ" ПРИ СКРОЛЛЕ ----------

function setupLocationAnimation() {
    const sectionBg = document.querySelector(".section-location-bg");
    if (!sectionBg) return;

    // Если IntersectionObserver не поддерживается (очень старые браузеры),
    // просто сразу показываем блок без анимации.
    if (!("IntersectionObserver" in window)) {
        sectionBg.classList.add("is-visible");
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sectionBg.classList.add("is-visible");
                    obs.unobserve(entry.target); // анимация только один раз
                }
            });
        },
        {
            threshold: 0.3 // 30% блока в зоне видимости – запускаем анимацию
        }
    );

    observer.observe(sectionBg);
}

