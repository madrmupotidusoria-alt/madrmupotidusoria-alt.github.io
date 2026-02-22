// Modern Error Handling System for SCANORA
class ErrorSystem {
    constructor() {
        this.errors = [];
        this.errorContainer = null;
        this.toastContainer = null;
        this.init();
    }

    init() {
        this.createErrorContainers();
        this.setupGlobalErrorHandling();
    }

    createErrorContainers() {
        // Create main error container for full-screen errors
        this.errorContainer = document.createElement('div');
        this.errorContainer.className = 'error-overlay';
        this.errorContainer.innerHTML = `
            <div class="error-modal">
                <div class="error-content">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="error-details">
                        <h3 class="error-title">Error</h3>
                        <p class="error-message"></p>
                        <div class="error-actions">
                            <button class="error-btn primary" onclick="errorSystem.dismiss()">OK</button>
                            <button class="error-btn secondary" onclick="errorSystem.retry()">Retry</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.errorContainer);

        // Create toast container for notifications
        this.toastContainer = document.createElement('div');
        this.toastContainer.className = 'toast-container';
        document.body.appendChild(this.toastContainer);
    }

    setupGlobalErrorHandling() {
        // Override console methods for centralized error logging
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        const originalConsoleLog = console.log;

        console.error = (...args) => {
            this.handleError('error', args[0], args);
            originalConsoleError.apply(console, args);
        };

        console.warn = (...args) => {
            this.handleError('warning', args[0], args);
            originalConsoleWarn.apply(console, args);
        };

        console.log = (...args) => {
            // Log info messages normally
            originalConsoleLog.apply(console, args);
        };

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError('error', 'Unhandled Promise Rejection', [event.reason]);
        });

        // Handle global JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError('error', 'JavaScript Error', [event.message, event.filename, event.lineno]);
        });
    }

    // Error types with their configurations
    errorTypes = {
        // Form Validation Errors
        INVALID_EMAIL: {
            type: 'validation',
            severity: 'error',
            title: 'Invalid Email Format',
            message: 'Please enter a valid email address',
            icon: 'fa-envelope',
            action: 'focus'
        },
        PASSWORD_TOO_SHORT: {
            type: 'validation',
            severity: 'error',
            title: 'Password Too Short',
            message: 'Password must be at least 8 characters long',
            icon: 'fa-lock',
            action: 'focus'
        },
        PASSWORDS_NO_MATCH: {
            type: 'validation',
            severity: 'error',
            title: 'Passwords Do Not Match',
            message: 'Passwords do not match',
            icon: 'fa-exclamation-circle',
            action: 'focus'
        },
        USERNAME_TAKEN: {
            type: 'validation',
            severity: 'warning',
            title: 'Username Already Taken',
            message: 'This username is already registered',
            icon: 'fa-user',
            action: 'focus'
        },

        // Authentication Errors
        INVALID_CREDENTIALS: {
            type: 'auth',
            severity: 'error',
            title: 'Invalid Credentials',
            message: 'Invalid email or password',
            icon: 'fa-shield-alt',
            action: 'retry'
        },
        ACCOUNT_LOCKED: {
            type: 'auth',
            severity: 'error',
            title: 'Account Locked',
            message: 'Your account has been temporarily locked',
            icon: 'fa-lock',
            action: 'contact'
        },
        TOO_MANY_ATTEMPTS: {
            type: 'auth',
            severity: 'error',
            title: 'Too Many Attempts',
            message: 'Too many login attempts. Please try again later.',
            icon: 'fa-clock',
            action: 'cooldown'
        },

        // Search Errors
        NO_SEARCH_TERM: {
            type: 'search',
            severity: 'warning',
            title: 'No Search Term',
            message: 'Please enter a search term',
            icon: 'fa-search',
            action: 'focus'
        },
        NO_SEARCH_TYPES: {
            type: 'search',
            severity: 'warning',
            title: 'No Search Types',
            message: 'Please select at least one search type',
            icon: 'fa-filter',
            action: 'select'
        },
        NO_RESULTS: {
            type: 'search',
            severity: 'info',
            title: 'No Results Found',
            message: 'No results found for your search',
            icon: 'fa-search',
            action: 'none'
        },

        // API Errors
        API_TIMEOUT: {
            type: 'api',
            severity: 'error',
            title: 'Request Timeout',
            message: 'Request timed out. Please try again.',
            icon: 'fa-clock',
            action: 'retry'
        },
        API_UNAVAILABLE: {
            type: 'api',
            severity: 'error',
            title: 'Service Unavailable',
            message: 'Service temporarily unavailable. Please try again later.',
            icon: 'fa-server',
            action: 'retry'
        },
        RATE_LIMIT: {
            type: 'api',
            severity: 'warning',
            title: 'Rate Limit Reached',
            message: 'Too many requests. Please wait before trying again.',
            icon: 'fa-tachometer-alt',
            action: 'cooldown'
        },
        DATABASE_ERROR: {
            type: 'api',
            severity: 'error',
            title: 'Database Error',
            message: 'Database connection failed. Please try again.',
            icon: 'fa-database',
            action: 'retry'
        },

        // Network Errors
        NETWORK_ERROR: {
            type: 'network',
            severity: 'error',
            title: 'Network Error',
            message: 'Network connection failed. Please check your connection.',
            icon: 'fa-wifi',
            action: 'retry'
        },

        // Permission Errors
        PERMISSION_DENIED: {
            type: 'permission',
            severity: 'error',
            title: 'Access Denied',
            message: 'You do not have permission to perform this action.',
            icon: 'fa-ban',
            action: 'none'
        }
    };

    // Main error handler
    handleError(type, message, details = []) {
        const errorConfig = this.errorTypes[type] || this.errorTypes.GENERIC_ERROR;
        
        // Log to console for debugging
        console.error(`[${type.toUpperCase()}] ${message}`, ...details);

        // Show appropriate UI based on error type
        switch (errorConfig.type) {
            case 'validation':
                this.showInlineError(message, errorConfig);
                break;
            case 'auth':
                this.showModalError(errorConfig);
                break;
            case 'search':
                this.showInlineError(message, errorConfig);
                break;
            case 'api':
                this.showModalError(errorConfig);
                break;
            case 'network':
                this.showModalError(errorConfig);
                break;
            case 'permission':
                this.showModalError(errorConfig);
                break;
            default:
                this.showToast(message, 'info');
                break;
        }
    }

    // Show inline error (for form validation)
    showInlineError(message, errorConfig) {
        // Remove any existing inline errors
        document.querySelectorAll('.inline-error').forEach(el => el.remove());

        // Find the form field or show error message
        const form = document.querySelector('form');
        if (form) {
            const firstInput = form.querySelector('input, textarea');
            if (firstInput) {
                // Create inline error element
                const errorElement = document.createElement('div');
                errorElement.className = 'inline-error';
                errorElement.innerHTML = `
                    <i class="fas ${errorConfig.icon}"></i>
                    <span>${message}</span>
                `;
                
                // Insert after the input field
                firstInput.parentNode.insertBefore(errorElement, firstInput.nextSibling);
                
                // Auto-remove after 5 seconds
                setTimeout(() => {
                    if (errorElement.parentNode) {
                        errorElement.remove();
                    }
                }, 5000);

                // Focus the input field if specified
                if (errorConfig.action === 'focus') {
                    setTimeout(() => firstInput.focus(), 100);
                }
            }
        }
    }

    // Show modal error (for authentication, API errors)
    showModalError(errorConfig) {
        if (this.errorContainer) {
            this.errorContainer.style.display = 'flex';
            
            const errorContent = this.errorContainer.querySelector('.error-content');
            if (errorContent) {
                const errorIcon = errorContent.querySelector('.error-icon i');
                const errorTitle = errorContent.querySelector('.error-title');
                const errorMessage = errorContent.querySelector('.error-message');
                const primaryBtn = errorContent.querySelector('.error-btn.primary');
                const secondaryBtn = errorContent.querySelector('.error-btn.secondary');

                // Update content
                if (errorIcon) errorIcon.className = `fas ${errorConfig.icon}`;
                if (errorTitle) errorTitle.textContent = errorConfig.title;
                if (errorMessage) errorMessage.textContent = errorConfig.message;

                // Update button actions
                if (primaryBtn && secondaryBtn) {
                    switch (errorConfig.action) {
                        case 'retry':
                            primaryBtn.textContent = 'Retry';
                            secondaryBtn.textContent = 'Cancel';
                            secondaryBtn.onclick = () => this.dismiss();
                            break;
                        case 'contact':
                            primaryBtn.textContent = 'Contact Support';
                            secondaryBtn.onclick = () => this.dismiss();
                            break;
                        case 'cooldown':
                            primaryBtn.textContent = 'OK';
                            primaryBtn.onclick = () => this.dismiss();
                            break;
                        default:
                            primaryBtn.textContent = 'OK';
                            primaryBtn.onclick = () => this.dismiss();
                            break;
                    }
                }

                // Auto-dismiss after 8 seconds for non-critical errors
                if (errorConfig.severity !== 'error') {
                    setTimeout(() => this.dismiss(), 8000);
                }
            }
        }
    }

    // Show toast notification (for info, success messages)
    showToast(message, type = 'info', duration = 4000) {
        if (this.toastContainer) {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <div class="toast-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            this.toastContainer.appendChild(toast);

            // Auto-remove after duration
            setTimeout(() => {
                toast.classList.add('toast-hiding');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }, duration);
        }
    }

    // Dismiss current error
    dismiss() {
        if (this.errorContainer) {
            this.errorContainer.style.display = 'none';
        }
        
        // Remove any inline errors
        document.querySelectorAll('.inline-error').forEach(el => el.remove());
        
        // Remove any toasts
        document.querySelectorAll('.toast').forEach(el => el.remove());
    }

    // Retry last action
    retry() {
        // This can be customized based on context
        const lastAction = localStorage.getItem('lastFailedAction');
        if (lastAction) {
            // Implement retry logic based on last action
            console.log('Retrying last action:', lastAction);
            localStorage.removeItem('lastFailedAction');
        }
    }

    // Show success message
    showSuccess(message, title = 'Success') {
        this.showToast(message, 'success');
    }

    // Show warning message
    showWarning(message, title = 'Warning') {
        this.showToast(message, 'warning');
    }

    // Store failed action for retry functionality
    storeFailedAction(action) {
        localStorage.setItem('lastFailedAction', action);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorSystem;
} else {
    window.ErrorSystem = ErrorSystem;
}
