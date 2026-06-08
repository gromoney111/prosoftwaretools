// Firebase Authentication - ProSoftwareTools
// Handles login, signup, logout, password reset, and auth state

// ===== Auth Functions =====

// Sign up new user
function signupUser(email, password, name) {
    return auth.createUserWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            // Update display name
            return userCredential.user.updateProfile({
                displayName: name
            }).then(function() {
                // Store name in localStorage
                localStorage.setItem('userName', name);
                localStorage.setItem('userEmail', email);
                return userCredential.user;
            });
        });
}

// Login existing user
function loginUser(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            var user = userCredential.user;
            localStorage.setItem('userName', user.displayName || user.email.split('@')[0]);
            localStorage.setItem('userEmail', user.email);
            return user;
        });
}

// Logout user
function logoutUser() {
    return auth.signOut().then(function() {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        updateAuthUI(null);
    });
}

// Send password reset email
function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
}

// Auth state listener
function onAuthChanged(callback) {
    auth.onAuthStateChanged(function(user) {
        if (user) {
            localStorage.setItem('userName', user.displayName || user.email.split('@')[0]);
            localStorage.setItem('userEmail', user.email);
        }
        if (callback) callback(user);
    });
}

// ===== UI Update Functions =====

// Update navigation auth button
function updateAuthUI(user) {
    var authBtn = document.getElementById('authBtn');
    if (!authBtn) return;

    if (user || localStorage.getItem('userName')) {
        var name = (user && user.displayName) ? user.displayName : localStorage.getItem('userName') || 'User';
        var initial = name.charAt(0).toUpperCase();
        authBtn.outerHTML = '<div class="user-menu" id="authBtn">' +
            '<div class="user-avatar">' + initial + '</div>' +
            '<span>' + name.split(' ')[0] + '</span>' +
            '<a href="#" onclick="logoutUser(); return false;" title="Logout" style="color:var(--danger);margin-left:4px;"><i class="fas fa-sign-out-alt"></i></a>' +
            '</div>';
    } else {
        authBtn.outerHTML = '<a href="login.html" class="btn-login" id="authBtn"><i class="fas fa-user"></i> Login</a>';
    }
}

// ===== Error Messages =====
function getAuthErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/user-not-found':
            return 'No account found with this email address.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential':
            return 'Invalid email or password. Please try again.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password must be at least 6 characters long.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Contact support.';
        case 'auth/operation-not-allowed':
            return 'This sign-in method is not enabled.';
        default:
            return 'An error occurred. Please try again.';
    }
}

// ===== Form Validation =====
function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// ===== Show/Hide Password Toggle =====
function setupPasswordToggles() {
    var toggles = document.querySelectorAll('.password-toggle');
    toggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var input = this.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
}

// ===== Password Strength Indicator =====
function checkPasswordStrength(password) {
    var strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) return { level: 'weak', text: 'Weak', color: '#ef4444' };
    if (strength <= 2) return { level: 'fair', text: 'Fair', color: '#f59e0b' };
    if (strength <= 3) return { level: 'good', text: 'Good', color: '#0ea5e9' };
    return { level: 'strong', text: 'Strong', color: '#10b981' };
}

// ===== Show Error/Success Messages =====
function showAuthError(message) {
    var errorEl = document.getElementById('authError');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
    var successEl = document.getElementById('authSuccess');
    if (successEl) {
        successEl.style.display = 'none';
    }
}

function showAuthSuccess(message) {
    var successEl = document.getElementById('authSuccess');
    if (successEl) {
        successEl.textContent = message;
        successEl.style.display = 'block';
    }
    var errorEl = document.getElementById('authError');
    if (errorEl) {
        errorEl.style.display = 'none';
    }
}

function hideAuthMessages() {
    var errorEl = document.getElementById('authError');
    var successEl = document.getElementById('authSuccess');
    if (errorEl) errorEl.style.display = 'none';
    if (successEl) successEl.style.display = 'none';
}

// ===== Login Form Handler =====
function setupLoginForm() {
    var form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        hideAuthMessages();

        var email = document.getElementById('loginEmail').value.trim();
        var password = document.getElementById('loginPassword').value;
        var btn = form.querySelector('.auth-btn');

        // Validate
        if (!validateEmail(email)) {
            showAuthError('Please enter a valid email address.');
            return;
        }
        if (!validatePassword(password)) {
            showAuthError('Password must be at least 6 characters.');
            return;
        }

        // Disable button
        btn.disabled = true;
        btn.textContent = 'Logging in...';

        loginUser(email, password)
            .then(function() {
                showAuthSuccess('Login successful! Redirecting...');
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 1000);
            })
            .catch(function(error) {
                showAuthError(getAuthErrorMessage(error.code));
                btn.disabled = false;
                btn.textContent = 'Login';
            });
    });
}

// ===== Signup Form Handler =====
function setupSignupForm() {
    var form = document.getElementById('signupForm');
    if (!form) return;

    // Password strength indicator
    var passwordInput = document.getElementById('signupPassword');
    var strengthBar = document.getElementById('strengthBar');
    var strengthText = document.getElementById('strengthText');

    if (passwordInput && strengthBar) {
        passwordInput.addEventListener('input', function() {
            var val = this.value;
            if (val.length === 0) {
                strengthBar.style.width = '0%';
                strengthBar.style.background = 'transparent';
                if (strengthText) strengthText.textContent = '';
                return;
            }
            var result = checkPasswordStrength(val);
            var widthMap = { weak: '25%', fair: '50%', good: '75%', strong: '100%' };
            strengthBar.style.width = widthMap[result.level];
            strengthBar.style.background = result.color;
            if (strengthText) {
                strengthText.textContent = result.text;
                strengthText.style.color = result.color;
            }
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        hideAuthMessages();

        var name = document.getElementById('signupName').value.trim();
        var email = document.getElementById('signupEmail').value.trim();
        var password = document.getElementById('signupPassword').value;
        var confirmPassword = document.getElementById('signupConfirmPassword').value;
        var terms = document.getElementById('termsAgree');
        var btn = form.querySelector('.auth-btn');

        // Validate
        if (!name) {
            showAuthError('Please enter your full name.');
            return;
        }
        if (!validateEmail(email)) {
            showAuthError('Please enter a valid email address.');
            return;
        }
        if (!validatePassword(password)) {
            showAuthError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            showAuthError('Passwords do not match.');
            return;
        }
        if (terms && !terms.checked) {
            showAuthError('Please agree to the Terms of Service.');
            return;
        }

        // Disable button
        btn.disabled = true;
        btn.textContent = 'Creating Account...';

        signupUser(email, password, name)
            .then(function() {
                showAuthSuccess('Account created successfully! Redirecting...');
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 1500);
            })
            .catch(function(error) {
                showAuthError(getAuthErrorMessage(error.code));
                btn.disabled = false;
                btn.textContent = 'Create Account';
            });
    });
}

// ===== Forgot Password Form Handler =====
function setupForgotForm() {
    var form = document.getElementById('forgotForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        hideAuthMessages();

        var email = document.getElementById('forgotEmail').value.trim();
        var btn = form.querySelector('.auth-btn');

        // Validate
        if (!validateEmail(email)) {
            showAuthError('Please enter a valid email address.');
            return;
        }

        // Disable button
        btn.disabled = true;
        btn.textContent = 'Sending...';

        resetPassword(email)
            .then(function() {
                showAuthSuccess('Reset email sent! Check your inbox.');
                btn.disabled = false;
                btn.textContent = 'Send Reset Link';
            })
            .catch(function(error) {
                showAuthError(getAuthErrorMessage(error.code));
                btn.disabled = false;
                btn.textContent = 'Send Reset Link';
            });
    });
}

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', function() {
    // Setup password toggles
    setupPasswordToggles();

    // Setup forms based on what's on the page
    setupLoginForm();
    setupSignupForm();
    setupForgotForm();

    // Auth state listener - update nav on all pages
    onAuthChanged(function(user) {
        updateAuthUI(user);
    });
});
