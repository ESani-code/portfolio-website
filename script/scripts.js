// script.js

document.addEventListener('DOMContentLoaded', () => {
    // You can add JavaScript functionality here.

    // Example: Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
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