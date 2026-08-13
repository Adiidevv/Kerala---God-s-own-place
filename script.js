/* =========================================
   NAVBAR
========================================= */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =========================================
   MOBILE MENU
========================================= */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});


/* Close mobile menu when link is clicked */

const links = document.querySelectorAll(".nav-links a");

links.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

    });

});


/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

const revealElements = document.querySelectorAll(
    ".story-grid, .nature-card, .culture-card, .festival-item, .gallery-item"
);

const revealObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("reveal");
                
                setTimeout(() => {
                    entry.target.classList.add("active");
                }, 100);

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================
   SMOOTH SCROLL
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (event) {

        const target = document.querySelector(
            this.getAttribute("href")
        );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth"
        });

    });

});


/* =========================================
   IMAGE ERROR HANDLING
========================================= */

const images = document.querySelectorAll("img");

images.forEach(image => {

    image.addEventListener("error", () => {

        image.style.display = "none";

    });

});


/* =========================================
   CURRENT YEAR
========================================= */

const year = new Date().getFullYear();

const footerText = document.querySelector(".footer-bottom p");

if (footerText) {

    footerText.textContent =
        `© ${year} Keralam. Made with ❤️ in Kerala.`;

}