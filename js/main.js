// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    // ===== КАРУСЕЛЬ =====
    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dot"));

    let currentIndex = 0;
    const SLIDE_INTERVAL_MS = 8000;
    let timerId = null;

    function goToSlide(index) {
        if (!slides.length) return;

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
            goToSlide(currentIndex + 1);
        }, SLIDE_INTERVAL_MS);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
            startAutoSlide(); // перезапускаем таймер после ручного выбора
        });
    });

    startAutoSlide();

    // ===== МОБИЛЬНОЕ МЕНЮ (бургер) =====
    const nav = document.querySelector(".main-nav");
    const navToggle = document.querySelector(".nav-toggle");

    if (nav && navToggle) {
        navToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }
});
