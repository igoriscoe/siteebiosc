// EBioSC 2025 - I Encontro de Biólogos de Santa Catarina
// JavaScript Functions

// Form Management Variables
let currentStep = 1;
const totalSteps = 7;
let formSteps, progressFill, currentStepSpan, prevBtn, nextBtn, submitBtn;

// Navigation Management Variables
let mainNav, navToggle, navMenu, navLinks;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    updateProgress();
    initializeAnimations();
    setupFormValidation();
    setupNavigation();
    setupSmoothScrolling();
});

function initializeElements() {
    // Form elements
    formSteps = document.querySelectorAll('.form-step');
    progressFill = document.getElementById('progressFill');
    currentStepSpan = document.getElementById('currentStep');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    submitBtn = document.getElementById('submitBtn');

    // Navigation elements
    mainNav = document.getElementById('mainNav');
    navToggle = document.querySelector('.nav-toggle');
    navMenu = document.querySelector('.nav-menu');
    navLinks = document.querySelectorAll('.nav-menu a');
}

// Navigation Functions
function setupNavigation() {
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navToggle && navMenu) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // Navigation scroll effect
    window.addEventListener('scroll', function() {
        if (mainNav) {
            if (window.scrollY > 100) {
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }
        }

        // Update active navigation link
        updateActiveNavLink();
    });
}

function setupSmoothScrolling() {
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                if (targetId === '#inicio') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 100;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150;

    if (sections && navLinks) {
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Handle header/home section
        if (window.scrollY < 200) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#inicio') {
                    link.classList.add('active');
                }
            });
        }
    }
}

// Form Functions
function changeStep(direction) {
    if (direction === 1 && !validateCurrentStep()) {
        return;
    }

    // Hide current step
    if (formSteps && formSteps[currentStep - 1]) {
        formSteps[currentStep - 1].classList.remove('active');
    }

    // Update step
    currentStep += direction;

    // Show new step
    if (currentStep >= 1 && currentStep <= totalSteps && formSteps) {
        if (formSteps[currentStep - 1]) {
            formSteps[currentStep - 1].classList.add('active');
        }
        updateProgress();
        updateButtons();
        
        // Generate summary on last step
        if (currentStep === totalSteps) {
            generateFormSummary();
        }
    }
}

function updateProgress() {
    if (progressFill && currentStepSpan) {
        const progress = (currentStep / totalSteps) * 100;
        progressFill.style.width = progress + '%';
        currentStepSpan.textContent = currentStep;
    }
}

function updateButtons() {
    if (prevBtn) {
        prevBtn.disabled = currentStep === 1;
    }
    
    if (nextBtn && submitBtn) {
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
        } else {
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
        }
    }
}

function validateCurrentStep() {
    if (!formSteps || !formSteps[currentStep - 1]) return true;
    
    const currentStepElement = formSteps[currentStep - 1];
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (field.type === 'checkbox' || field.type === 'radio') {
            const groupName = field.name;
            const checkedFields = currentStepElement.querySelectorAll(`[name="${groupName}"]:checked`);
            if (checkedFields.length === 0) {
                isValid = false;
                showFieldError(field, 'Este campo é obrigatório');
            } else {
                clearFieldError(field);
            }
        } else {
            if (!field.value.trim()) {
                isValid = false;
                showFieldError(field, 'Este campo é obrigatório');
            } else {
                clearFieldError(field);
            }
        }
    });

    // Email validation
    const emailField = currentStepElement.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            isValid = false;
            showFieldError(emailField, 'Por favor, insira um e-mail válido');
        }
    }

    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = '#e74c3c';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#e9ecef';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function generateFormSummary() {
    const form = document.getElementById('registrationForm');
    const summary = document.getElementById('formSummary');
    
    if (!form || !summary) return;
    
    const formData = new FormData(form);
    
    let summaryHTML = '<h4 style="margin-bottom: 1.5rem; color: var(--primary-green);">Resumo da Inscrição</h4>';
    
    // Personal Information
    summaryHTML += `<div style="margin-bottom: 1rem;"><strong>Nome:</strong> ${formData.get('fullName') || 'Não informado'}</div>`;
    summaryHTML += `<div style="margin-bottom: 1rem;"><strong>E-mail:</strong> ${formData.get('email') || 'Não informado'}</div>`;
    summaryHTML += `<div style="margin-bottom: 1rem;"><strong>Telefone:</strong> ${formData.get('phone') || 'Não informado'}</div>`;
    
    // Education
    const educationLabels = {
        'graduacao': 'Graduação',
        'especializacao': 'Especialização',
        'mestrado': 'Mestrado',
        'doutorado': 'Doutorado',
        'pos-doutorado': 'Pós-doutorado'
    };
    summaryHTML += `<div style="margin-bottom: 1rem;"><strong>Formação:</strong> ${educationLabels[formData.get('education')] || 'Não informado'}</div>`;
    
    // Interests
    const interests = formData.getAll('interests');
    if (interests.length > 0) {
        const interestLabels = {
            'ecologia': 'Ecologia e Meio Ambiente',
            'genetica': 'Genética e Biologia Molecular',
            'botanica': 'Botânica',
            'zoologia': 'Zoologia',
            'microbiologia': 'Microbiologia',
            'biotecnologia': 'Biotecnologia',
            'conservacao': 'Conservação',
            'educacao': 'Educação Ambiental'
        };
        summaryHTML += `<div style="margin-bottom: 1rem;"><strong>Áreas de Interesse:</strong> ${interests.map(i => interestLabels[i]).join(', ')}</div>`;
    }
    
    summary.innerHTML = summaryHTML;
}

function setupFormValidation() {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            // Only prevent default if not on the last step
            if (currentStep < totalSteps) {
                e.preventDefault();
                return false;
            }
            // Allow natural submission on last step
            if (!validateCurrentStep()) {
                e.preventDefault();
                return false;
            }
            submitForm();
        });

        // Real-time validation
        form.addEventListener('input', function(e) {
            if (e.target.hasAttribute('required')) {
                clearFieldError(e.target);
            }
        });
    }
}

function submitForm() {
    if (!validateCurrentStep()) {
        return;
    }

    // Show loading
    const registrationForm = document.getElementById('registrationForm');
    const loadingAnimation = document.getElementById('loadingAnimation');
    
    if (registrationForm && loadingAnimation) {
        registrationForm.style.display = 'none';
        loadingAnimation.style.display = 'block';
    }

    // Allow natural form submission to Formspree
    // Remove preventDefault to let the form submit normally
    if (loadingAnimation) {
        loadingAnimation.style.display = 'none';
    }
    
    // Show success animation first
    const successAnimation = document.getElementById('successAnimation');
    if (successAnimation) {
        successAnimation.classList.add('show');
    }
    
    // Submit the form naturally after showing success
    setTimeout(() => {
        registrationForm.submit();
    }, 1000);
}

function resetForm() {
    const form = document.getElementById('registrationForm');
    const successAnimation = document.getElementById('successAnimation');
    
    if (form) {
        form.reset();
    }
    
    currentStep = 1;
    
    // Hide all steps
    if (formSteps) {
        formSteps.forEach(step => step.classList.remove('active'));
        
        // Show first step
        if (formSteps[0]) {
            formSteps[0].classList.add('active');
        }
    }
    
    // Reset UI
    if (successAnimation) {
        successAnimation.classList.remove('show');
    }
    
    if (form) {
        form.style.display = 'block';
    }
    
    updateProgress();
    updateButtons();
}

// Animations and Effects
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Add floating animation delay randomization
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = Math.random() * 30 + 's';
        element.style.left = Math.random() * 100 + '%';
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (currentStep < totalSteps) {
            changeStep(1);
        } else {
            submitForm();
        }
    } else if (e.key === 'Escape') {
        if (currentStep > 1) {
            changeStep(-1);
        }
    }
});

// Form auto-save (localStorage)
function saveFormData() {
    const form = document.getElementById('registrationForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    localStorage.setItem('ebiosc_registration', JSON.stringify(data));
}

// Load saved form data
function loadFormData() {
    const saved = localStorage.getItem('ebiosc_registration');
    if (saved) {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            const field = document.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    const values = Array.isArray(data[key]) ? data[key] : [data[key]];
                    values.forEach(value => {
                        const specificField = document.querySelector(`[name="${key}"][value="${value}"]`);
                        if (specificField) {
                            specificField.checked = true;
                        }
                    });
                } else {
                    field.value = data[key];
                }
            }
        });
    }
}

// Auto-save on form changes
document.addEventListener('input', saveFormData);
document.addEventListener('change', saveFormData);

// Load saved data on page load
window.addEventListener('load', loadFormData);

// Newsletter form submission
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            const email = this.querySelector('input[type="email"]').value;
            const checkbox = this.querySelector('input[type="checkbox"]').checked;
            
            if (!email) {
                e.preventDefault();
                alert('Por favor, insira seu e-mail.');
                return false;
            }
            
            if (!checkbox) {
                e.preventDefault();
                alert('Por favor, aceite receber comunicações.');
                return false;
            }
            
            // Let the form submit naturally to Formspree
            alert('Enviando inscrição da newsletter...');
            return true;
        });
    }
});

// Make functions available globally for onclick handlers
window.changeStep = changeStep;
window.resetForm = resetForm;