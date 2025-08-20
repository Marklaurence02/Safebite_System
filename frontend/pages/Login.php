<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SafeBite - Authentication</title>
    <link rel="stylesheet" href="../assets/css/Login-assets/login.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</head>
<body>
    <div class="App">
        <div class="login-container">
            <div class="login-card">
                <!-- Logo and Header -->
                <div class="logo-section">
                    <div class="logo-icon">
                        <span>S</span>
                    </div>
                    <h1 class="brand-name">SafeBite</h1>
                    <p class="welcome-text">Welcome back! Please sign in to continue.</p>
                </div>

                <!-- Login Form -->
                <div id="loginView" class="auth-view active">
                    <form class="login-form" id="loginForm">
                        <div class="input-group">
                            <label for="email">Email or Username</label>
                            <div class="input-field">
                                <i class="fas fa-user"></i>
                                <input type="text" id="email" name="email" placeholder="Enter your email or username" required>
                            </div>
                        </div>

                        <div class="input-group">
                            <label for="password">Password</label>
                            <div class="input-field">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="password" name="password" placeholder="Enter your password" required>
                                <button type="button" class="toggle-password" id="togglePassword">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>

                        <div class="forgot-password">
                            <a href="#" class="forgot-link" onclick="handleNavigation('forgot')">Forgot your password?</a>
                        </div>

                        <button type="submit" class="signin-btn">
                            <span>Sign In</span>
                        </button>
                    </form>

                    <!-- Sign Up Link -->
                    <div class="signup-section">
                        <p>Don't have an account? <a href="#" class="signup-link" onclick="handleNavigation('signup')">Sign up here</a></p>
                    </div>
                </div>

                <!-- Signup Form -->
                <div id="signupView" class="auth-view">
                    <form class="signup-form" id="signupForm">
                        <div class="input-group">
                            <label for="signupName">Full Name</label>
                            <div class="input-field">
                                <i class="fas fa-user"></i>
                                <input type="text" id="signupName" name="name" placeholder="Enter your full name" required>
                            </div>
                        </div>

                        <div class="input-group">
                            <label for="signupEmail">Email</label>
                            <div class="input-field">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="signupEmail" name="email" placeholder="Enter your email" required>
                            </div>
                        </div>

                        <div class="input-group">
                            <label for="signupPassword">Password</label>
                            <div class="input-field">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="signupPassword" name="password" placeholder="Create a password" required>
                                <button type="button" class="toggle-password" id="toggleSignupPassword">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <!-- Password strength bar -->
                            <div class="password-strength" style="margin-top:10px;">
                                <div class="strength-label" id="passwordStrengthLabel">Weak</div>
                                <div class="strength-track">
                                    <div class="strength-bar" id="passwordStrengthBar"></div>
                                </div>
                            </div>
                            <!-- Password requirements checklist -->
                            <div id="passwordRequirements" style="margin-top:8px; font-size:0.9rem; color:#b0b0b0; line-height:1.4;">
                                <ul style="list-style:none; padding-left:0; margin:0;">
                                    <li id="req-length">• At least 8 characters</li>
                                    <li id="req-upper">• One uppercase letter (A-Z)</li>
                                    <li id="req-lower">• One lowercase letter (a-z)</li>
                                    <li id="req-number">• One number (0-9)</li>
                                    <li id="req-special">• One special character (!@#$%^&* etc.)</li>
                                </ul>
                            </div>
                        </div>

                        <div class="input-group">
                            <label for="confirmPassword">Confirm Password</label>
                            <div class="input-field">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required>
                                <button type="button" class="toggle-password" id="toggleConfirmPassword">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>

                        <div class="recaptcha-wrap" style="margin:10px 0; transform: scale(0.85); transform-origin: 0 0;">
                            <div class="g-recaptcha" data-sitekey="6Le-aqwrAAAAAEXKtzu2pvOZjMT034GBPg_zkLNJ"></div>
                        </div>
                        <button type="submit" class="signin-btn">
                            <span>Create Account</span>
                        </button>
                    </form>

                    <!-- Back to Login Link -->
                    <div class="signup-section">
                        <p>Already have an account? <a href="#" class="signup-link" onclick="handleNavigation('login')">Sign in here</a></p>
                    </div>
                </div>

                <!-- Forgot Password Form -->
                <div id="forgotView" class="auth-view">
                    <form class="forgot-form" id="forgotForm">
                        <div class="input-group">
                            <label for="forgotEmail">Email</label>
                            <div class="input-field">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="forgotEmail" name="email" placeholder="Enter your email address" required>
                            </div>
                        </div>

                        <button type="submit" class="signin-btn">
                            <span>Reset Password</span>
                        </button>
                    </form>

                    <!-- Back to Login Link -->
                    <div class="signup-section">
                        <p>Remember your password? <a href="#" class="signup-link" onclick="handleNavigation('login')">Sign in here</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>



    <!-- Toaster for notifications -->
    <div id="toaster" class="toaster"></div>

    <script src="../assets/js/Login/login.js"></script>
</body>
</html>
