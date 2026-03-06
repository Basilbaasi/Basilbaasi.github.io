/**
 * Basil C K Portfolio - Minimal JavaScript
 * Clean, fast, and lightweight interactions
 */

// ============================================
// DOM Elements
// ============================================
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

// ============================================
// Navbar Scroll Effect
// ============================================
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// ============================================
// Mobile Menu Toggle
// ============================================
function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('active');
    
    // Toggle menu icon
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('hidden')) {
        icon.setAttribute('data-lucide', 'menu');
    } else {
        icon.setAttribute('data-lucide', 'x');
    }
    lucide.createIcons();
}

// ============================================
// Smooth Scroll for Navigation Links
// ============================================
function handleSmoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        // Close mobile menu if open
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
        
        // Calculate offset for fixed navbar
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        
        // Smooth scroll to target
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ============================================
// Intersection Observer for Fade-in Animations
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        observer.observe(section);
    });
}

// ============================================
// Active Navigation Link Highlighting
// ============================================
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('text-primary-400');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('text-primary-400');
                }
            });
        }
    });
}

// ============================================
// Copy to Clipboard Functionality
// ============================================
function initCopyToClipboard() {
    // Find all elements with data-copy attribute
    const copyElements = document.querySelectorAll('[data-copy]');
    
    copyElements.forEach(element => {
        element.addEventListener('click', async function() {
            const textToCopy = this.getAttribute('data-copy');
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                
                // Show feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
                
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
}

// ============================================
// Typing Effect for Hero Title (Optional)
// ============================================
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-effect');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    typingElement.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing after a short delay
    setTimeout(typeWriter, 500);
}

// ============================================
// Initialize All Functions
// ============================================
function init() {
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
    
    // Scroll animations
    initScrollAnimations();
    
    // Active nav link highlighting
    window.addEventListener('scroll', highlightActiveNavLink);
    
    // Copy to clipboard
    initCopyToClipboard();
    
    // Typing effect (optional)
    // initTypingEffect();
    
    // Initial check for navbar state
    handleNavbarScroll();
}

// ============================================
// Run on DOM Ready
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// Keyboard Navigation Support
// ============================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape key
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        toggleMobileMenu();
    }
});

// ============================================
// Performance: Debounce Scroll Events
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
window.addEventListener('scroll', debounce(highlightActiveNavLink, 50));
