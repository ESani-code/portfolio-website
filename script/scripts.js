// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Smooth Scrolling ---
    // This replaces the default browser smooth scroll to allow for custom speed.

    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    const scrollDuration = 1500; // Duration of the scroll in milliseconds (e.g., 1000 = 1 second)

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the default jump
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                let startTime = null;

                // Animation function
                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = ease(timeElapsed, startPosition, distance, scrollDuration);
                    window.scrollTo(0, run);
                    if (timeElapsed < scrollDuration) requestAnimationFrame(animation);
                }

                // Easing function for a smoother start and end
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


    // Example: Add a simple animation to gallery items on scroll
    // --- Scroll Animation for Gallery ---
    const galleryItems = document.querySelectorAll('.gallery-item');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // When the element is visible in the viewport
            if (entry.isIntersecting) {
                // Add the 'is-visible' class to trigger the CSS animation
                entry.target.classList.add('is-visible');
                // Stop observing the element so the animation only happens once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the item is visible
    });

    // Start observing each gallery item
    galleryItems.forEach(item => {
        observer.observe(item);
    });
});

// --- Tab Functionality for About Me Section ---
const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior

        // Get the target tab from the data attribute
        const targetTab = link.getAttribute('data-tab');

        // Update active state for tab links
        tabLinks.forEach(innerLink => {
            innerLink.classList.remove('active');
        });
        link.classList.add('active');

        // Show/hide tab content
        tabContents.forEach(content => {
            if (content.id === targetTab) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    });
});