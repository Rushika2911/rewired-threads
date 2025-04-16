// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = menuToggle.querySelector('[data-lucide]');
    
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      
      // Toggle menu icon between menu and X
      if (mobileMenu.classList.contains('hidden')) {
        menuIcon.setAttribute('data-lucide', 'menu');
      } else {
        menuIcon.setAttribute('data-lucide', 'x');
      }
      
      lucide.createIcons();
    });
    
    // Initialize GSAP animations
    initGSAPAnimations();
  });
  
  // Initialize GSAP animations
  function initGSAPAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    const heroTimeline = gsap.timeline();
    
    heroTimeline.fromTo(
      '#hero-overlay', 
      { opacity: 1 }, 
      { opacity: 0, duration: 1.5, ease: "power2.out" }
    ).fromTo(
      '#hero-text',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
      "-=1"
    );
    
    // Parallax effect on scroll for hero image
    gsap.to('#hero-image', {
      scrollTrigger: {
        trigger: '#hero',
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: 200,
      ease: "none",
    });
    
    // Text parallax (slower than the image)
    gsap.to('#hero-text', {
      scrollTrigger: {
        trigger: '#hero',
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: 100,
      ease: "none",
    });
    
    // Page entry animation
    gsap.fromTo(
      'main',
      { 
        opacity: 0, 
        y: 50 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'power3.out' 
      }
    );
    
    // Section title animation
    gsap.fromTo(
      '#section-title',
      { 
        opacity: 0, 
        y: 100
      },
      { 
        opacity: 1, 
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: '#products-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    // Product cards staggered animation
    const productCards = document.querySelectorAll('.product-card');
    
    gsap.fromTo(
      productCards,
      { 
        opacity: 0, 
        y: 100,
        scale: 0.8 
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#products-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }