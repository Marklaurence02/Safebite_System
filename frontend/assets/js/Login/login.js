// Authentication App JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Global state management (equivalent to React useState)
    let currentView = 'login';
    
    // Get DOM elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotForm = document.getElementById('forgotForm');
    
    // Login form elements
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const togglePasswordIcon = togglePasswordBtn.querySelector('i');
    const signinBtn = document.querySelector('.signin-btn');
    
    // Signup form elements
    const signupNameInput = document.getElementById('signupName');
    const signupEmailInput = document.getElementById('signupEmail');
    const signupPasswordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleSignupPasswordBtn = document.getElementById('toggleSignupPassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    
    // Forgot password form elements
    const forgotEmailInput = document.getElementById('forgotEmail');
    
    // View elements
    const loginView = document.getElementById('loginView');
    const signupView = document.getElementById('signupView');
    const forgotView = document.getElementById('forgotView');
    
    // Toaster element
    const toaster = document.getElementById('toaster');

    // Create particle effects
    function createParticles() {
        const particleCount = 15;
        const container = document.querySelector('.App');
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            container.appendChild(particle);
        }
    }

    // Navigation function (equivalent to React handleNavigation)
    window.handleNavigation = function(view) {
        if (view === currentView) return;
        
        // Hide current view
        const currentViewElement = document.getElementById(currentView + 'View');
        currentViewElement.classList.add('slide-out');
        
        setTimeout(() => {
            // Remove active class from all views
            document.querySelectorAll('.auth-view').forEach(view => {
                view.classList.remove('active');
            });
            
            // Show new view
            const newViewElement = document.getElementById(view + 'View');
            newViewElement.classList.add('active', 'slide-in');
            
            // Update current view
            currentView = view;
            
            // Reset forms when switching views
            resetForms();
            
            // Focus on first input of new view
            setTimeout(() => {
                const firstInput = newViewElement.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
            
        }, 300);
    };

    // Reset all forms
    function resetForms() {
        loginForm.reset();
        signupForm.reset();
        forgotForm.reset();
        
        // Clear all errors
        document.querySelectorAll('.input-field').forEach(field => {
            field.classList.remove('error');
        });
        
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.remove();
        });
        
        // Reset password visibility
        resetPasswordVisibility();
    }

    // Reset password visibility toggles
    function resetPasswordVisibility() {
        const passwordToggles = document.querySelectorAll('.toggle-password');
        passwordToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        });
        
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.setAttribute('type', 'password');
        });
    }

    // Password visibility toggle function
    function setupPasswordToggle(buttonId, inputId) {
        const button = document.getElementById(buttonId);
        const input = document.getElementById(inputId);
        const icon = button.querySelector('i');
        
        button.addEventListener('click', function() {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } 
        });
    }

    // Setup password toggles
    setupPasswordToggle('togglePassword', 'password');
    setupPasswordToggle('toggleSignupPassword', 'signupPassword');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');

    // Form validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function validateName(name) {
        return name.trim().length >= 2;
    }

    function showError(input, message) {
        const inputField = input.closest('.input-field');
        inputField.classList.add('error');
        
        // Remove existing error message if any
        const existingError = inputField.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        inputField.parentNode.insertBefore(errorDiv, inputField.nextSibling);
    }

    function clearError(input) {
        const inputField = input.closest('.input-field');
        inputField.classList.remove('error');
        
        const errorMessage = inputField.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Real-time validation for login form
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !validateEmail(email)) {
            showError(this, 'Please enter a valid email address');
        } else {
            clearError(this);
        }
    });

    passwordInput.addEventListener('blur', function() {
        const password = this.value;
        if (password && !validatePassword(password)) {
            showError(this, 'Password must be at least 6 characters long');
        } else {
            clearError(this);
        }
    });

    // Real-time validation for signup form
    signupNameInput.addEventListener('blur', function() {
        const name = this.value.trim();
        if (name && !validateName(name)) {
            showError(this, 'Name must be at least 2 characters long');
        } else {
            clearError(this);
        }
    });

    signupEmailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !validateEmail(email)) {
            showError(this, 'Please enter a valid email address');
        } else {
            clearError(this);
        }
    });

    signupPasswordInput.addEventListener('blur', function() {
        const password = this.value;
        if (password && !validatePassword(password)) {
            showError(this, 'Password must be at least 6 characters long');
        } else {
            clearError(this);
        }
    });

    confirmPasswordInput.addEventListener('blur', function() {
        const password = signupPasswordInput.value;
        const confirmPassword = this.value;
        if (confirmPassword && password !== confirmPassword) {
            showError(this, 'Passwords do not match');
        } else {
            clearError(this);
        }
    });

    // Clear errors on input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value) {
                clearError(this);
            }
        });
    });

    // Login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Clear previous errors
        clearError(emailInput);
        clearError(passwordInput);
        
        // Validate form
        let isValid = true;
        
        if (!email) {
            showError(emailInput, 'Email or username is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!password) {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError(passwordInput, 'Password must be at least 6 characters long');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading state
        const submitBtn = this.querySelector('.signin-btn');
        submitBtn.classList.add('loading');
        submitBtn.querySelector('span').textContent = 'Signing In...';
        
        try {
            // Perform real login with PHP backend
            await performLogin(email, password);
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.querySelector('span').textContent = 'Sign In';
        }
    });

    // Signup form submission
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = signupNameInput.value.trim();
        const email = signupEmailInput.value.trim();
        const password = signupPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Clear previous errors
        clearError(signupNameInput);
        clearError(signupEmailInput);
        clearError(signupPasswordInput);
        clearError(confirmPasswordInput);
        
        // Validate form
        let isValid = true;
        
        if (!name) {
            showError(signupNameInput, 'Full name is required');
            isValid = false;
        } else if (!validateName(name)) {
            showError(signupNameInput, 'Name must be at least 2 characters long');
            isValid = false;
        }
        
        if (!email) {
            showError(signupEmailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(signupEmailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!password) {
            showError(signupPasswordInput, 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError(signupPasswordInput, 'Password must be at least 6 characters long');
            isValid = false;
        }
        
        if (!confirmPassword) {
            showError(confirmPasswordInput, 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError(confirmPasswordInput, 'Passwords do not match');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading state
        const submitBtn = this.querySelector('.signin-btn');
        submitBtn.classList.add('loading');
        submitBtn.querySelector('span').textContent = 'Creating Account...';
        
        try {
            // Perform real signup with PHP backend
            await performSignup(name, email, password);
        } catch (error) {
            console.error('Signup error:', error);
        } finally {
            // Reset button state
            const submitBtn = this.querySelector('.signin-btn');
            submitBtn.classList.remove('loading');
            submitBtn.querySelector('span').textContent = 'Create Account';
        }
    });

    // Forgot password form submission
    forgotForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = forgotEmailInput.value.trim();
        
        // Clear previous errors
        clearError(forgotEmailInput);
        
        // Validate form
        if (!email) {
            showError(forgotEmailInput, 'Email is required');
            return;
        } else if (!validateEmail(email)) {
            showError(forgotEmailInput, 'Please enter a valid email address');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('.signin-btn');
        submitBtn.classList.add('loading');
        submitBtn.querySelector('span').textContent = 'Sending Reset...';
        
        try {
            // Perform real password reset with PHP backend
            await performPasswordReset(email);
        } catch (error) {
            console.error('Password reset error:', error);
        } finally {
            // Reset button state
            const submitBtn = this.querySelector('.signin-btn');
            submitBtn.classList.remove('loading');
            submitBtn.querySelector('span').textContent = 'Reset Password';
        }
    });

    // Real login process with PHP backend
    async function performLogin(email, password) {
        try {
            // Force XAMPP path for backend
            const apiUrl = 'http://localhost/SafeBite/backend/api/login.php';
            
            console.log('Attempting login to:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonErr) {
                data = {};
            }

            if (response.ok && data.success) {
                // Store user data and session token
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                localStorage.setItem('sessionToken', data.session.token);
                localStorage.setItem('sessionExpires', data.session.expires_at);
                
                showToast(`Welcome back, ${data.user.full_name}! Redirecting...`, 'success');
                
                // Redirect to appropriate dashboard after a short delay
                setTimeout(() => {
                    if (data.user.role && data.user.role.toLowerCase() === 'admin') {
                        window.location.href = '../pages/ad-dashboard..html';
                    } else {
                        window.location.href = '../pages/User-Dashboard.html';
                    }
                }, 1000);
            } else {
                // Show backend error message if present
                showToast(data.error || 'Login failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            // Provide more specific error messages
            if (error.message && error.message.includes('Failed to fetch')) {
                showToast('Cannot connect to server. Make sure XAMPP is running and you\'re accessing via http://localhost', 'error');
            } else {
                showToast('Network or server error. Please try again.', 'error');
            }
        }
    }



    // Real signup process with PHP backend
    async function performSignup(name, email, password) {
        try {
            const [firstName, ...lastNameParts] = name.trim().split(' ');
            const lastName = lastNameParts.join(' ') || firstName;
            const username = email.split('@')[0]; // Generate username from email
            
            // Force XAMPP path for backend
            const apiUrl = 'http://localhost/SafeBite/backend/api/register.php';
            
            console.log('Attempting signup to:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    username: username,
                    email: email,
                    password: password,
                    confirm_password: password
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Signup response:', data);

            if (data.success) {
                showToast(`Account created successfully for ${data.user.full_name}! Please sign in.`, 'success');
                
                // Switch to login view after a short delay
                setTimeout(() => {
                    handleNavigation('login');
                }, 2000);
            } else {
                showToast(data.error || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            
            // Provide more specific error messages
            if (error.message.includes('Failed to fetch')) {
                showToast('Cannot connect to server. Make sure XAMPP is running and you\'re accessing via http://localhost', 'error');
            } else if (error.message.includes('HTTP error')) {
                showToast('Server error. Please check if the backend is working.', 'error');
            } else {
                showToast('Network error. Please check your connection.', 'error');
            }
        }
    }

    // Real password reset with PHP backend
    async function performPasswordReset(email) {
        try {
            // Force XAMPP path for backend
            const apiUrl = 'http://localhost/SafeBite/backend/api/forgot-password.php';
            
            console.log('Attempting password reset to:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Password reset response:', data);

            if (data.success) {
                showToast(data.message, 'info');
                
                // Switch to login view after a short delay
                setTimeout(() => {
                    handleNavigation('login');
                }, 2000);
            } else {
                showToast(data.error || 'Password reset failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Password reset error:', error);
            
            // Provide more specific error messages
            if (error.message.includes('Failed to fetch')) {
                showToast('Cannot connect to server. Make sure XAMPP is running and you\'re accessing via http://localhost', 'error');
            } else if (error.message.includes('HTTP error')) {
                showToast('Server error. Please check if the backend is working.', 'error');
            } else {
                showToast('Network error. Please check your connection.', 'error');
            }
        }
    }

    // Toast notification system (equivalent to React Toaster)
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        toaster.appendChild(toast);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Enter key to submit form
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            const form = e.target.closest('form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape key to clear form
        if (e.key === 'Escape') {
            resetForms();
        }
    });

    // Focus management
    emailInput.focus();
    
    // Auto-focus password field when email is entered
    emailInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            passwordInput.focus();
        }
    });

    // Add some interactive effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Initialize particle effects
    createParticles();

    console.log('Authentication app initialized successfully');
}); 