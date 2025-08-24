// --- Preloader Functionality ---
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Smooth Scrolling ---
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    const scrollDuration = 800;

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
            const speedY = parseFloat(glass.getAttribute('data-speed-y'));
            const speedX = parseFloat(glass.getAttribute('data-speed-x'));
            const speedRotate = parseFloat(glass.getAttribute('data-speed-rotate'));

            const parallaxTranslateY = scrollY * speedY;
            const parallaxTranslateX = scrollY * speedX;
            const parallaxRotate = scrollY * speedRotate;

            const floatTranslateY = Math.sin(time * 0.0005 * speedY) * 10;
            const floatTranslateX = Math.cos(time * 0.0003 * speedX) * 15;
            const floatRotate = Math.sin(time * 0.0001 * speedRotate) * 5;

            const totalTranslateX = parallaxTranslateX + floatTranslateX;
            const totalTranslateY = parallaxTranslateY + floatTranslateY;
            const totalRotate = parallaxRotate + floatRotate;

            glass.style.transform = `translate(${totalTranslateX}px, ${totalTranslateY}px) rotate(${totalRotate}deg)`;
        });

        requestAnimationFrame(animateFloatingGlass);
    }

    animateFloatingGlass();

    // --- JS-Powered 3D Coverflow Slider ---
    const coverflowContainer = document.querySelector('.coverflow-container-js');
    if (coverflowContainer) {
        const slides = coverflowContainer.querySelectorAll('.coverflow-slide-js');
        const prevBtn = coverflowContainer.querySelector('.prev-btn');
        const nextBtn = coverflowContainer.querySelector('.next-btn');
        let currentIndex = 0;
        let autoPlayInterval;

        function updateCoverflow() {
            slides.forEach((slide, i) => {
                const offset = (i - currentIndex + slides.length) % slides.length;
                
                let transform = '';
                let zIndex = 0;

                if (offset === 0) {
                    transform = 'translateX(0) translateZ(0) rotateY(0deg)';
                    zIndex = 10;
                    slide.classList.add('active');
                } else if (offset === 1) {
                    transform = 'translateX(35%) translateZ(-150px) rotateY(-35deg)';
                    zIndex = 9;
                    slide.classList.remove('active');
                } else if (offset === slides.length - 1) {
                    transform = 'translateX(-35%) translateZ(-150px) rotateY(35deg)';
                    zIndex = 9;
                    slide.classList.remove('active');
                } else if (offset === 2) {
                    transform = 'translateX(70%) translateZ(-300px) rotateY(-35deg)';
                    zIndex = 8;
                    slide.classList.remove('active');
                } else if (offset === slides.length - 2) {
                    transform = 'translateX(-70%) translateZ(-300px) rotateY(35deg)';
                    zIndex = 8;
                    slide.classList.remove('active');
                } else {
                    transform = offset < slides.length / 2 
                        ? 'translateX(100%) translateZ(-400px) rotateY(-35deg)' 
                        : 'translateX(-100%) translateZ(-400px) rotateY(35deg)';
                    zIndex = 7;
                    slide.classList.remove('active');
                }

                slide.style.transform = transform;
                slide.style.zIndex = zIndex;
                slide.style.opacity = zIndex < 8 ? '0' : '1';
            });
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCoverflow();
            }, 5000);
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCoverflow();
            resetAutoPlay();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCoverflow();
            resetAutoPlay();
        });

        slides.forEach((slide, i) => {
            slide.addEventListener('click', () => {
                currentIndex = i;
                updateCoverflow();
                resetAutoPlay();
            });
        });

        updateCoverflow();
        resetAutoPlay();
    }

    // --- MODIFICATION: MOVED ALL THE FOLLOWING BLOCKS INSIDE ---

    // --- Custom Video Player Logic ---
    const allVideoContainers = document.querySelectorAll('.video-container');
    allVideoContainers.forEach(container => {
        const video = container.querySelector('video');
        const playPauseBtn = container.querySelector('.play-pause-btn');
        const muteBtn = container.querySelector('.mute-btn');
        const fullscreenBtn = container.querySelector('.fullscreen-btn');
        const progressBar = container.querySelector('.progress-bar');
        const progressBarContainer = container.querySelector('.progress-bar-container');
        const unmuteIndicator = container.querySelector('.unmute-indicator');

        container.classList.add('paused');
        if (video.muted) {
            container.classList.add('muted');
        } else {
            container.classList.add('unmuted');
        }

        container.addEventListener('mouseenter', () => {
            if (video.paused) {
                video.muted = true;
                container.classList.add('muted');
                container.classList.remove('unmuted');
                video.play().catch(e => console.log("Autoplay prevented"));
            }
        });

        container.addEventListener('mouseleave', () => {
            if (container.dataset.unmuted === 'false') {
                video.pause();
                video.currentTime = 0;
            }
        });

        container.addEventListener('click', (e) => {
            if (e.target.closest('.video-controls')) return;
            if (container.dataset.unmuted === 'false') {
                video.muted = false;
                container.dataset.unmuted = 'true';
                container.classList.remove('muted');
                container.classList.add('unmuted');
                unmuteIndicator.classList.add('visible');
            } else {
                togglePlayPause();
            }
        });

        const togglePlayPause = () => {
            if (video.paused) video.play(); else video.pause();
        };

        video.addEventListener('play', () => {
            container.classList.remove('paused');
            container.classList.add('playing');
        });

        video.addEventListener('pause', () => {
            container.classList.remove('playing');
            container.classList.add('paused');
        });

        playPauseBtn.addEventListener('click', togglePlayPause);

        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            container.classList.toggle('muted', video.muted);
            container.classList.toggle('unmuted', !video.muted);
            container.dataset.unmuted = !video.muted ? 'true' : 'false';
            unmuteIndicator.classList.toggle('visible', !video.muted);
        });

        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(err => alert(`Error: ${err.message}`));
            } else {
                document.exitFullscreen();
            }
        });

        document.addEventListener('fullscreenchange', () => {
            container.classList.toggle('fullscreen', document.fullscreenElement === container);
        });
        
        video.addEventListener('timeupdate', () => {
            progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
        });
        
        progressBarContainer.addEventListener('click', (e) => {
            video.currentTime = (e.offsetX / progressBarContainer.clientWidth) * video.duration;
        });
    });
    
    // --- Tab Functionality for About Me Section ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.getAttribute('data-tab');
            tabLinks.forEach(innerLink => innerLink.classList.remove('active'));
            link.classList.add('active');
            tabContents.forEach(content => {
                if (content.id === targetTab) content.classList.add('active');
                else content.classList.remove('active');
            });
        });
    });

    // --- Google Apps Script Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const googleScriptURL = 'https://script.google.com/macros/s/AKfycbxCQtRlWkA3qAB07hCEpXkcXQw8rxdVPwu5hEwQvhfYaLLHEbapgdd07SjDuVu8ey_i/exec';
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        const formData = new FormData(contactForm);
        fetch(googleScriptURL, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    alert('Thank you! Your message has been sent successfully.');
                    contactForm.reset();
                } else {
                    throw new Error('Something went wrong on the server.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Sorry, there was an error sending your message. Please try again later.');
            })
            .finally(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
    });

}); // --- END OF DOMContentLoaded ---