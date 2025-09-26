// Enhanced form functionality with clean page navigation
document.addEventListener('DOMContentLoaded', function() {
    initializeForms();
    loadUsers();
});

// Users array to store all registered users (simulating JSON file)
let users = [];

// Initialize form functionality
function initializeForms() {
    setupInputEffects();
    setupFormValidation();
    
    // Show register form by default
    showForm('register');
}

// Load users from memory (using JavaScript variables instead of localStorage)
function loadUsers() {
    // In a real application, this would load from a server
    // For demo purposes, we'll start with an empty array each session
    users = [];
}

// Save users to memory (simulating database save)
function saveUsers() {
    // In a real application, this would save to a server
    // For demo purposes, we'll just keep in memory
    console.log('Users saved to memory:', users.length, 'users');
    return true;
}

// Form switching functionality
function showForm(formType) {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    // Clear any existing messages
    hideMessage();
    
    if (formType === 'register') {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        toggleBtns[0].classList.add('active');
        toggleBtns[1].classList.remove('active');
    } else {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        toggleBtns[0].classList.remove('active');
        toggleBtns[1].classList.add('active');
    }
    
    // Reset forms
    clearFormErrors();
}

// Setup input effects (floating labels)
function setupInputEffects() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // Handle initial state
        updateInputState(input);
        
        // Handle focus events
        input.addEventListener('focus', () => {
            const group = input.closest('.input-group, .select-group');
            if (group) {
                group.classList.add('focused');
            }
        });
        
        // Handle blur events
        input.addEventListener('blur', () => {
            const group = input.closest('.input-group, .select-group');
            if (group) {
                group.classList.remove('focused');
                updateInputState(input);
            }
        });
        
        // Handle input events
        input.addEventListener('input', () => {
            updateInputState(input);
            clearFieldError(input);
        });
        
        // Handle change events for selects
        input.addEventListener('change', () => {
            updateInputState(input);
        });
    });
}

function updateInputState(input) {
    const group = input.closest('.input-group, .select-group');
    const label = group?.querySelector('label');
    
    if (input.value.trim() !== '') {
        group?.classList.add('has-value');
        if (label && input.tagName === 'SELECT') {
            label.style.top = '0';
            label.style.fontSize = '0.75rem';
            label.style.color = '#ff6b35';
            label.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    } else {
        group?.classList.remove('has-value');
        if (label && input.tagName === 'SELECT') {
            label.style.top = '50%';
            label.style.fontSize = '1rem';
            label.style.color = '#888888';
            label.style.background = 'transparent';
        }
    }
}

// Password visibility toggle
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.nextElementSibling?.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.querySelector('.eye-icon').textContent = '🙈';
    } else {
        field.type = 'password';
        toggle.querySelector('.eye-icon').textContent = '👁️';
    }
}

// Form validation setup
function setupFormValidation() {
    // Real-time validation for all inputs
    const inputs = document.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

// Field validation
function validateField(field) {
    const fieldName = field.name || field.id;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required.`;
    }
    
    // Specific field validations
    switch (fieldName) {
        case 'fullName':
            if (value && value.length < 2) {
                isValid = false;
                errorMessage = 'Full name must be at least 2 characters long.';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            } else if (value && fieldName === 'email' && isEmailTaken(value)) {
                isValid = false;
                errorMessage = 'This email is already registered.';
            }
            break;
            
        case 'username':
            if (value && value.length < 3) {
                isValid = false;
                errorMessage = 'Username must be at least 3 characters long.';
            } else if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Username can only contain letters, numbers, and underscores.';
            } else if (value && isUsernameTaken(value)) {
                isValid = false;
                errorMessage = 'This username is already taken.';
            }
            break;
            
        case 'password':
            if (value && value.length < 6) {
                isValid = false;
                errorMessage = 'Password must be at least 6 characters long.';
            }
            break;
            
        case 'confirmPassword':
            const password = document.getElementById('password')?.value;
            if (value && value !== password) {
                isValid = false;
                errorMessage = 'Passwords do not match.';
            }
            break;
    }
    
    // Update field appearance
    updateFieldValidation(field, isValid, errorMessage);
    return isValid;
}

function updateFieldValidation(field, isValid, errorMessage) {
    const group = field.closest('.form-group');
    const errorElement = group?.querySelector('.error-message');
    
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
        if (errorElement) {
            errorElement.textContent = '';
        }
    } else {
        field.classList.remove('valid');
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
    }
}

function getFieldLabel(field) {
    const label = field.closest('.form-group')?.querySelector('label');
    return label?.textContent || field.name || 'Field';
}

// Check if email is already taken
function isEmailTaken(email) {
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Check if username is already taken
function isUsernameTaken(username) {
    return users.some(user => user.username.toLowerCase() === username.toLowerCase());
}

// Clear field error
function clearFieldError(field) {
    const group = field.closest('.form-group');
    const errorElement = group?.querySelector('.error-message');
    
    if (errorElement && errorElement.textContent) {
        field.classList.remove('error');
        errorElement.textContent = '';
    }
}

// Clear all form errors
function clearFormErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const errorFields = document.querySelectorAll('.error');
    
    errorMessages.forEach(element => {
        element.textContent = '';
    });
    
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}

// Registration validation
function validateRegistration() {
    const form = document.querySelector('.registration-form');
    const formData = new FormData(form);
    let isValid = true;
    
    // Validate all required fields
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate gender selection
    const genderSelected = formData.get('gender');
    if (!genderSelected) {
        showFieldError('genderError', 'Please select your gender.');
        isValid = false;
    }
    
    // Validate hobbies (optional but show message if none selected)
    const hobbies = formData.getAll('hobbies[]');
    if (hobbies.length === 0) {
        showFieldError('hobbiesError', 'Please select at least one hobby.');
        isValid = false;
    }
    
    if (isValid) {
        registerUser(formData);
    }
    
    return false; // Prevent default form submission
}

// Login validation
function validateLogin() {
    const form = document.querySelector('.login-form');
    const formData = new FormData(form);
    let isValid = true;
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('input[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            updateFieldValidation(field, false, `${getFieldLabel(field)} is required.`);
            isValid = false;
        }
    });
    
    if (isValid) {
        loginUser(formData);
    }
    
    return false; // Prevent default form submission
}

// Register new user
function registerUser(formData) {
    const submitBtn = document.querySelector('#registerForm .submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Show loading state
    submitBtn.classList.add('loading');
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    
    // Simulate API delay
    setTimeout(() => {
        try {
            const userData = {
                id: Date.now().toString(),
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                username: formData.get('username'),
                password: formData.get('password'), // In real app, this should be hashed
                gender: formData.get('gender'),
                hobbies: formData.getAll('hobbies[]'),
                country: formData.get('country'),
                joinDate: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            // Add user to array
            users.push(userData);
            
            // Save to memory
            if (saveUsers()) {
                // Store user data for the welcome page
                sessionStorage.setItem('currentUser', JSON.stringify(userData));
                
                // Registration successful
                showMessage('Account created successfully! Redirecting to welcome page...', 'success');
                
                // Redirect to welcome page
                setTimeout(() => {
                    window.location.href = 'welcome.html';
                }, 2000);
            } else {
                showMessage('Error saving account. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            showMessage('Registration failed. Please try again.', 'error');
        }
        
        // Hide loading state
        submitBtn.classList.remove('loading');
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }, 1500);
}

// Login user
function loginUser(formData) {
    const submitBtn = document.querySelector('#loginForm .submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Show loading state
    submitBtn.classList.add('loading');
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    
    const username = formData.get('username');
    const password = formData.get('password');
    
    // Simulate API delay
    setTimeout(() => {
        try {
            // Find user
            const user = users.find(u => 
                (u.username.toLowerCase() === username.toLowerCase() || 
                 u.email.toLowerCase() === username.toLowerCase()) && 
                u.password === password
            );
            
            if (user) {
                // Update last login
                user.lastLogin = new Date().toISOString();
                saveUsers();
                
                // Store user data for the welcome page
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                
                // Login successful
                showMessage('Login successful! Redirecting to welcome page...', 'success');
                
                // Redirect to welcome page
                setTimeout(() => {
                    window.location.href = 'welcome.html';
                }, 2000);
            } else {
                showMessage('Invalid username/email or password. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Login failed. Please try again.', 'error');
        }
        
        // Hide loading state
        submitBtn.classList.remove('loading');
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }, 1500);
}

// Show field error
function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Message display functions
function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    const messageElement = document.getElementById('message');
    
    if (messageContainer && messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageContainer.style.display = 'block';
        
        // Auto hide success and info messages
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                hideMessage();
            }, 5000);
        }
    }
}

function hideMessage() {
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
        messageContainer.style.display = 'none';
    }
}

// Add CSS for error states
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .form-group input.error,
    .form-group select.error {
        border-color: #e74c3c !important;
        background-color: rgba(231, 76, 60, 0.05) !important;
    }
    
    .form-group input.valid,
    .form-group select.valid {
        border-color: rgba(40, 167, 69, 0.3) !important;
        background-color: rgba(40, 167, 69, 0.05) !important;
    }
    
    .submit-btn.loading {
        cursor: not-allowed;
        opacity: 0.7;
        transform: none !important;
    }
`;
document.head.appendChild(errorStyles);

// Make functions globally accessible
window.showForm = showForm;
window.togglePassword = togglePassword;
window.validateRegistration = validateRegistration;
window.validateLogin = validateLogin;