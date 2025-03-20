// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded'); // Debug log
    
    // Initialize all components
    initializeAll();
});

function initializeAll() {
    // Basic functionality first
    setupMobileMenu();
    disableRightClick();
    setupSmoothScroll();
    
    // Then initialize more complex features
    setupIsotope();
    setupParticles();
    setupScrollMagic();
    setupThemeSwitcher();
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainHeader = document.getElementById('main-header');
    
    if (mobileToggle && mainHeader) {
        mobileToggle.addEventListener('click', function() {
            mainHeader.classList.toggle('open-nav');
        });
    }
}

// Disable Right Click
function disableRightClick() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
}

// Smooth Scroll
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const offset = 70;
                    const targetPosition = targetElement.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mainHeader = document.getElementById('main-header');
                    if (mainHeader && mainHeader.classList.contains('open-nav')) {
                        mainHeader.classList.remove('open-nav');
                    }
                }
            }
        });
    });
}

// Portfolio Filter (Isotope)
function setupIsotope() {
    const grid = document.querySelector('.img-grid');
    if (!grid) return;

    // Initialize Isotope if the library exists
    if (typeof Isotope !== 'undefined') {
        const iso = new Isotope(grid, {
            itemSelector: '.img-container'
        });

        // Filter buttons
        const filterButtons = document.querySelectorAll('#filter-btn button');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                iso.arrange({ filter: filterValue });

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('is-checked'));
                this.classList.add('is-checked');
            });
        });
    }
}

// Particles Background
function setupParticles() {
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer || typeof particlesJS === 'undefined') return;

    particlesJS('particles-js', {
        particles: {
            number: {
                value: 500,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#4a4ade'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: false
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            }
        },
        retina_detect: true
    });
}

// Scroll Animations
function setupScrollMagic() {
    if (typeof ScrollMagic === 'undefined') return;

    const controller = new ScrollMagic.Controller();

    // Navigation highlights
    const sections = ['hero', 'about', 'services', 'portfolio', 'contact'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            new ScrollMagic.Scene({
                triggerElement: `#${section}`,
                duration: element.offsetHeight
            })
            .setClassToggle(`#${section}-link`, 'active')
            .addTo(controller);
        }
    });

    // Animate about section
    if (document.querySelector('.about-text')) {
        new ScrollMagic.Scene({
            triggerElement: '.about-text',
            triggerHook: 0.7
        })
        .setClassToggle('.about-text', 'about-text-animate')
        .addTo(controller);
    }

    // Animate progress bars
    if (document.querySelector('.about-resume')) {
        new ScrollMagic.Scene({
            triggerElement: '.about-resume',
            triggerHook: 0.7
        })
        .setClassToggle('.inner-percent', 'inner-percent-animate')
        .addTo(controller);
    }

    // Animate service icons
    if (document.querySelector('.trigger')) {
        new ScrollMagic.Scene({
            triggerElement: '.trigger',
            triggerHook: 0.7
        })
        .setClassToggle('.icon', 'service-icon-animate')
        .addTo(controller);
    }
}

// Form submission (if needed)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your form submission logic here
    });
}

/*******************************************IMAGE GALLERY*******************************************/

/*******Filtering*******/

// init Isotope
var $grid = $('.img-grid').isotope({
  itemSelector: '.img-container',
  //layoutMode: 'fitRows',
});

// filter functions
var filterFns = {
  // show if number is greater than 50
  numberGreaterThan50: function() {

  },
};

// bind filter button click
$('#filter-btn').on( 'click', 'button', function() {
  var filterValue = $( this ).attr('data-filter');
  // use filterFn if matches value
  filterValue = filterFns[ filterValue ] || filterValue;
  $grid.isotope({ filter: filterValue });
});

// change is-checked class on buttons
$('.button-group').each( function( i, buttonGroup ) {
  var $buttonGroup = $( buttonGroup );
  $buttonGroup.on( 'click', 'button', function() {
    $buttonGroup.find('.is-checked').removeClass('is-checked');
    $( this ).addClass('is-checked');
  });
});

/*******Popup Image Gallary in Porfolio*******/

$('.popup-gallery').magnificPopup({
  type: 'image',
  gallery:{
    enabled:true
  }
});

/*******************************************DISABLE RIGHT CLICK*******************************************/


document.addEventListener('contextmenu', event => event.preventDefault());

/*******************************************CAROUSEL IN MY CLIENTS*******************************************/

$(document).ready(function(){
  $('.loop').owlCarousel({
    center: true,
    items:1,
    loop:true,
    margin:10,
    responsive:{
      600:{
        items:1
      }
    }
  });
});

/*******************************************SCROLL MAGIC*******************************************/

/*******Scroll for the links*******/
var controller = new ScrollMagic.Controller();

new ScrollMagic.Scene({triggerElement: "#hero", duration: $("#hero").height()}).setClassToggle("#hero-link", "active").addTo(controller);
new ScrollMagic.Scene({triggerElement: "#about", duration: $("#about").height() + 100}).setClassToggle("#about-link", "active").addTo(controller);
new ScrollMagic.Scene({triggerElement: "#services", duration: $("#services").height()}).setClassToggle("#services-link", "active").addTo(controller);
new ScrollMagic.Scene({triggerElement: "#portfolio", duration: $("#portfolio").height()}).setClassToggle("#portfolio-link", "active").addTo(controller);
new ScrollMagic.Scene({triggerElement: "#client", duration: $("#client").height() + 250}).setClassToggle("#client-link", "active").addTo(controller);
new ScrollMagic.Scene({triggerElement: "#contact", duration: $("#contact").height()}).setClassToggle("#contact-link", "active").addTo(controller);

/*******Other Scroll Magic Elements*******/

$(document).ready(function(){

  var controller2 = new ScrollMagic.Controller();

  //The about paragraph
  var about_scene = new ScrollMagic.Scene({
    triggerElement: '.about-text',
    triggerHook: .7
  })
  .setClassToggle('.about-text', 'about-text-animate')
  .reverse(false)
  .addTo(controller2);
    

  //Progress bars
  var progress_bar_scene = new ScrollMagic.Scene({

    triggerElement: '.about-resume',
    triggerHook: .7,

  })
  .setClassToggle('.inner-percent', 'inner-percent-animate')
  .reverse(false)
  .addTo(controller);
    
  //Icons in Services
  var about_scene = new ScrollMagic.Scene({
    triggerElement: '.trigger',
    triggerHook: .7
  })
  .setClassToggle('.icon', 'service-icon-animate')
  .reverse(false)
  .addTo(controller2);
    
});

/*******************************************MOBILE NAV*******************************************/
$('.mobile-toggle').click(function(){
  if($('#main-header').hasClass('open-nav')){
     $('#main-header').removeClass('open-nav');
  }else{
    $('#main-header').addClass('open-nav');
  }
});

/*******************************************NAV SCROLL*******************************************/
$('nav a').click(function(event) {
    var id = $(this).attr("href");
    var offset = 70;
    var target = $(id).offset().top - offset;
    $('html, body').animate({
        scrollTop: target
    }, 500);
    event.preventDefault();
});

/*******************************************PRELOAD*******************************************/
var overlay = document.getElementById("preload-overlay");

window.addEventListener('load', function(){
  overlay.style.display = "none";
})

/***********************Particles*************/

particlesJS("particles-js", {"particles":{"number":{"value":500,"density":{"enable":true,"value_area":800}},"color":{"value":"#4a4ade"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":6,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"repulse"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});var count_particles, stats, update; stats = new Stats; stats.setMode(0); stats.domElement.style.position = 'absolute'; stats.domElement.style.left = '0px'; stats.domElement.style.top = '0px'; document.body.appendChild(stats.domElement); count_particles = document.querySelector('.js-count-particles'); update = function() { stats.begin(); stats.end(); if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { count_particles.innerText = window.pJSDom[0].pJS.particles.array.length; } requestAnimationFrame(update); }; requestAnimationFrame(update);;


/***********************THEME SWITCH************/

// Theme Switcher functionality
function setupThemeSwitcher() {
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(themeIcon, savedTheme);
    }
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeIcon, newTheme);
    });
}

function updateThemeIcon(icon, theme) {
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Add this function for form submission without affecting other code
function submitForm() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Thank you! Your query has been submitted successfully.');
            form.reset();
        } else {
            alert('Something went wrong! Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong! Please try again.');
    });

    return false;
}



 
