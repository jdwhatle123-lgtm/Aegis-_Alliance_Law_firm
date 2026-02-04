/**
 * Aegis & Alliance Law Firm - Main JavaScript
 * Interactive functionality and user experience enhancements
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeFormHandling();
    initializeAnimations();
    initializeMobileMenu();
    initializeContactForm();
});

/**
 * Navigation Functionality
 */
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
}

/**
 * Mobile Menu Functionality
 */
function initializeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

/**
 * Update Active Navigation Based on Scroll Position
 */
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Scroll Effects and Animations
 */
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.practice-card, .contact-item, .role-card, .hierarchy-level');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

/**
 * Form Handling
 */
function initializeFormHandling() {
    // Consultation button functionality
    const consultationBtns = document.querySelectorAll('.consultation-btn, .cta-primary');
    consultationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    const nameInput = document.getElementById('name');
                    if (nameInput) nameInput.focus();
                }, 500);
            }
        });
    });
    
    // Learn more buttons
    const learnMoreBtns = document.querySelectorAll('.cta-secondary, .card-cta');
    learnMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const practiceSection = document.getElementById('practice-areas');
            if (practiceSection) {
                practiceSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Contact Form Functionality
 */
function initializeContactForm() {
    const form = document.getElementById('consultation-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm(form)) {
            submitContactForm(form);
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

/**
 * Form Validation
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Individual Field Validation
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Remove existing error states
    clearFieldError(field);
    
    // Check if required field is empty
    if (field.required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/[\s\-\(\)\.]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Name validation
    if (fieldName === 'name' && value) {
        if (value.length < 2) {
            showFieldError(field, 'Name must be at least 2 characters');
            return false;
        }
    }
    
    // Message validation
    if (fieldName === 'message' && value) {
        if (value.length < 10) {
            showFieldError(field, 'Please provide more details (minimum 10 characters)');
            return false;
        }
    }
    
    return true;
}

/**
 * Show Field Error
 */
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    field.parentNode.appendChild(errorDiv);
}

/**
 * Clear Field Error
 */
function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Submit Contact Form
 */
function submitContactForm(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Request...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        practiceArea: formData.get('practice-area'),
        message: formData.get('message'),
        urgent: formData.get('urgent') ? true : false,
        timestamp: new Date().toISOString(),
        source: 'Website Contact Form'
    };
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        handleFormSubmissionResponse(form, submitBtn, originalText, true);
    }, 2000);
    
    // In a real implementation, you would make an API call:
    /*
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        handleFormSubmissionResponse(form, submitBtn, originalText, result.success);
    })
    .catch(error => {
        handleFormSubmissionResponse(form, submitBtn, originalText, false);
    });
    */
}

/**
 * Handle Form Submission Response
 */
function handleFormSubmissionResponse(form, submitBtn, originalText, success) {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    
    if (success) {
        // Show success message
        showFormMessage(form, 'success', 'Thank you! Your request has been received. A Dynasty legal advocate will contact you within 2 hours.');
        form.reset();
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Request Sent Successfully';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
        }, 3000);
        
    } else {
        // Show error message
        showFormMessage(form, 'error', 'There was an error sending your request. Please call our emergency hotline: (555) AEGIS-LAW');
        submitBtn.innerHTML = originalText;
    }
}

/**
 * Show Form Message
 */
function showFormMessage(form, type, message) {
    // Remove existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}-message`;
    messageDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> ${message}`;
    
    // Insert message before submit button
    const submitBtn = form.querySelector('.submit-btn');
    form.insertBefore(messageDiv, submitBtn);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 10000);
}

/**
 * Initialize Animations
 */
function initializeAnimations() {
    // Add staggered animation delays to practice cards
    const practiceCards = document.querySelectorAll('.practice-card');
    practiceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add hover effects to stats
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => {
        stat.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        stat.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

/**
 * Utility Functions
 */

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce function for input events
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Get element position
function getElementPosition(element) {
    let offsetTop = 0;
    while(element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
    }
    return offsetTop;
}

/**
 * Cookie Consent (if needed for future GDPR compliance)
 */
function initializeCookieConsent() {
    // This can be implemented for GDPR compliance
    // For now, it's a placeholder for future enhancement
}

/**
 * Analytics Integration (placeholder)
 */
function trackEvent(category, action, label) {
    // Google Analytics or other tracking can be integrated here
    console.log(`Track Event: ${category} - ${action} - ${label}`);
}

/**
 * Performance Optimization
 */
// Preload critical images
function preloadImages() {
    const criticalImages = [
        'images/aegis-alliance-logo.png',
        'images/dynasty-seal.png',
        'images/hero-pattern.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
window.addEventListener('load', preloadImages);

/**
 * Error Handling
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, this could send errors to a logging service
});

/**
 * Service Worker Registration (for future PWA features)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker can be registered here for caching and offline functionality
        // navigator.serviceWorker.register('/sw.js');
    });
}