
// ============================================
// DOM Elements
// ============================================
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

// Desktop links are the links in the top nav bar only
const desktopNavLinks = navbar
    ? navbar.querySelectorAll('.hidden.md\\:flex a[href^="#"]')
    : [];

// Mobile links are the links inside the mobile dropdown
const mobileNavLinks = mobileMenu
    ? mobileMenu.querySelectorAll('a[href^="#"]')
    : [];

// ============================================
// Navbar Scroll Effect
// ============================================
function handleNavbarScroll() {
    if (!navbar) return;

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
    if (!mobileMenu || !mobileMenuBtn) return;

    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('active');

    const icon = mobileMenuBtn.querySelector('i');
    if (icon) {
        if (mobileMenu.classList.contains('hidden')) {
            icon.setAttribute('data-lucide', 'menu');
        } else {
            icon.setAttribute('data-lucide', 'x');
        }
        if (window.lucide) lucide.createIcons();
    }
}

function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuBtn) return;

    if (!mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('active');

        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', 'menu');
            if (window.lucide) lucide.createIcons();
        }
    }
}

// ============================================
// Smooth Scroll for Desktop Links
// ============================================
function handleDesktopSmoothScroll(e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) return;

    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;

    targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    history.pushState(null, '', targetId);
}

// ============================================
// Mobile Link Click
// ============================================
function handleMobileNavClick(e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) return;

    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;

    closeMobileMenu();

    // Let the menu collapse first, then scroll
    setTimeout(() => {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        history.pushState(null, '', targetId);
    }, 50);
}

// ============================================
// Intersection Observer for Fade-in Animations
// ============================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

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
    if (!navbar) return;

    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            const allNavLinks = document.querySelectorAll('nav a[href^="#"]');

            allNavLinks.forEach(link => {
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
    const copyElements = document.querySelectorAll('[data-copy]');

    copyElements.forEach(element => {
        element.addEventListener('click', async function () {
            const textToCopy = this.getAttribute('data-copy');

            try {
                await navigator.clipboard.writeText(textToCopy);

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

    setTimeout(typeWriter, 500);
}

// ============================================
// Initialize All Functions
// ============================================
function init() {
    window.addEventListener('scroll', handleNavbarScroll);

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    desktopNavLinks.forEach(link => {
        link.addEventListener('click', handleDesktopSmoothScroll);
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', handleMobileNavClick);
    });

    initScrollAnimations();
    window.addEventListener('scroll', highlightActiveNavLink);
    initCopyToClipboard();

    // initTypingEffect(); // optional

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
    if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
    }
});

// ============================================
// Performance: Debounce Scroll Events
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

window.addEventListener('scroll', debounce(highlightActiveNavLink, 50));