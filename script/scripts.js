// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Smooth Scrolling ---
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    const scrollDuration = 1500;

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                let startTime = null;

                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = ease(timeElapsed, startPosition, distance, scrollDuration);
                    window.scrollTo(0, run);
                    if (timeElapsed < scrollDuration) requestAnimationFrame(animation);
                }

                function ease(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }

                requestAnimationFrame(animation);
            }
        });
    });

    // --- Scroll Animation for Gallery ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    galleryItems.forEach(item => {
        observer.observe(item);
    });

    // --- Hamburger Menu Functionality ---
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = mobileNav.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        mobileNav.classList.add('open');
    });

    mobileNavClose.addEventListener('click', () => {
        mobileNav.classList.remove('open');
    });

    // Close mobile nav when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });
    });

    // --- Floating Glass Animation (Combined Parallax and Float) ---
    const floatingGlasses = document.querySelectorAll('.floating-glass');

    function animateFloatingGlass() {
        const scrollY = window.scrollY;
        const time = Date.now();

        floatingGlasses.forEach(glass => {
            // Parallax values based on scroll
            const speedY = parseFloat(glass.getAttribute('data-speed-y'));
            const speedX = parseFloat(glass.getAttribute('data-speed-x'));
            const speedRotate = parseFloat(glass.getAttribute('data-speed-rotate'));

            const parallaxTranslateY = scrollY * speedY;
            const parallaxTranslateX = scrollY * speedX;
            const parallaxRotate = scrollY * speedRotate;

            // Continuous floating values based on time
            // Use different multipliers for more random movement
            const floatTranslateY = Math.sin(time * 0.0005 * speedY) * 10;
            const floatTranslateX = Math.cos(time * 0.0003 * speedX) * 15;
            const floatRotate = Math.sin(time * 0.0001 * speedRotate) * 5;

            // Combine both effects
            const totalTranslateX = parallaxTranslateX + floatTranslateX;
            const totalTranslateY = parallaxTranslateY + floatTranslateY;
            const totalRotate = parallaxRotate + floatRotate;

            glass.style.transform = `translate(${totalTranslateX}px, ${totalTranslateY}px) rotate(${totalRotate}deg)`;
        });

        // Loop the animation
        requestAnimationFrame(animateFloatingGlass);
    }

    // Start the animation loop
    animateFloatingGlass();
});

// --- Tab Functionality for About Me Section ---
const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute('data-tab');

        tabLinks.forEach(innerLink => {
            innerLink.classList.remove('active');
        });
        link.classList.add('active');

        tabContents.forEach(content => {
            if (content.id === targetTab) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    });
});