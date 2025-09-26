// Welcome page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeWelcomePage();
});

function initializeWelcomePage() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        // No user data found, redirect to login
        redirectToLogin();
        return;
    }
    
    // Display user information
    displayUserInfo(currentUser);
    
    // Setup event listeners
    setupEventListeners();
}

// Get current user data from sessionStorage
function getCurrentUser() {
    try {
        const userData = sessionStorage.getItem('currentUser');
        if (userData) {
            return JSON.parse(userData);
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
    return null;
}

// Display user information on the welcome page
function displayUserInfo(user) {
    try {
        // Update header with user name
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = user.fullName || user.username || 'User';
        }
        
        // Update profile information
        const displayNameElement = document.getElementById('displayName');
        if (displayNameElement) {
            displayNameElement.textContent = user.fullName || user.username || 'User Name';
        }
        
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) {
            userEmailElement.textContent = user.email || 'user@example.com';
        }
        
        const userCountryElement = document.getElementById('userCountry');
        if (userCountryElement) {
            userCountryElement.textContent = getCountryName(user.country) || 'Not specified';
        }
        
        const userGenderElement = document.getElementById('userGender');
        if (userGenderElement) {
            userGenderElement.textContent = capitalizeFirstLetter(user.gender) || 'Not specified';
        }
        
        // Update user initials in avatar
        const userInitialsElement = document.getElementById('userInitials');
        if (userInitialsElement) {
            const initials = getInitials(user.fullName || user.username || 'U');
            userInitialsElement.textContent = initials;
        }
        
        // Display hobbies
        displayHobbies(user.hobbies || []);
        
        // Update join date
        const joinDateElement = document.getElementById('joinDate');
        if (joinDateElement && user.joinDate) {
            joinDateElement.textContent = formatJoinDate(user.joinDate);
        }
        
    } catch (error) {
        console.error('Error displaying user info:', error);
    }
}

// Display user hobbies as tags
function displayHobbies(hobbies) {
    const hobbiesListElement = document.getElementById('hobbiesList');
    if (!hobbiesListElement) return;
    
    // Clear existing hobbies
    hobbiesListElement.innerHTML = '';
    
    if (hobbies.length === 0) {
        hobbiesListElement.innerHTML = '<span style="color: #666; font-style: italic;">No hobbies specified</span>';
        return;
    }
    
    // Create hobby tags
    hobbies.forEach(hobby => {
        const hobbyTag = document.createElement('span');
        hobbyTag.className = 'hobby-tag';
        hobbyTag.textContent = capitalizeFirstLetter(hobby);
        hobbiesListElement.appendChild(hobbyTag);
    });
}

// Get user initials from full name
function getInitials(fullName) {
    if (!fullName) return 'U';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

// Capitalize first letter of a string
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Get full country name from country code
function getCountryName(countryCode) {
    const countries = {
        'us': 'United States',
        'uk': 'United Kingdom',
        'ca': 'Canada',
        'au': 'Australia',
        'de': 'Germany',
        'fr': 'France',
        'jp': 'Japan',
        'kr': 'South Korea',
        'cn': 'China',
        'in': 'India',
        'ph': 'Philippines',
        'sg': 'Singapore',
        'my': 'Malaysia',
        'th': 'Thailand',
        'other': 'Other'
    };
    
    return countries[countryCode] || countryCode || 'Not specified';
}

// Format join date for display
function formatJoinDate(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            const hours = Math.floor(diffInHours);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24 * 7) {
            const days = Math.floor(diffInHours / 24);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    } catch (error) {
        return 'Recently';
    }
}

// Setup event listeners for interactive elements
function setupEventListeners() {
    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Quick action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', handleActionClick);
    });
    
    // Activity items hover effects
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Handle logout
function logout() {
    // Show confirmation
    if (confirm('Are you sure you want to logout?')) {
        // Clear session data
        sessionStorage.removeItem('currentUser');
        
        // Show logout message
        showLogoutMessage();
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Handle quick action clicks
function handleActionClick(event) {
    const button = event.target;
    const actionCard = button.closest('.action-card');
    const actionTitle = actionCard.querySelector('h4').textContent;
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
    
    // Show action message
    showActionMessage(actionTitle);
}

// Show logout message
function showLogoutMessage() {
    // Create temporary logout message
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(255, 107, 53, 0.3);
        z-index: 9999;
        font-weight: 600;
        animation: slideInRight 0.5s ease;
    `;
    messageDiv.textContent = 'Logging out... See you soon!';
    
    // Add animation keyframes
    if (!document.querySelector('#logoutAnimation')) {
        const style = document.createElement('style');
        style.id = 'logoutAnimation';
        style.textContent = `
            @keyframes slideInRight {
                0% {
                    opacity: 0;
                    transform: translateX(100px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageDiv);
    
    // Remove message after delay
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 2000);
}

// Show action message
function showActionMessage(actionName) {
    // Create temporary action message
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        color: #333;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(255, 107, 53, 0.15);
        border: 1px solid rgba(255, 107, 53, 0.2);
        z-index: 9999;
        font-weight: 500;
        animation: actionPulse 0.6s ease;
    `;
    messageDiv.textContent = `${actionName} feature coming soon!`;
    
    // Add animation keyframes
    if (!document.querySelector('#actionAnimation')) {
        const style = document.createElement('style');
        style.id = 'actionAnimation';
        style.textContent = `
            @keyframes actionPulse {
                0% {
                    opacity: 0;
                    transform: translateX(-50%) scale(0.8);
                }
                50% {
                    transform: translateX(-50%) scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: translateX(-50%) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageDiv);
    
    // Remove message after delay
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 2500);
}

// Redirect to login page if no user data
function redirectToLogin() {
    // Show redirect message
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        padding: 2rem 3rem;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(255, 107, 53, 0.15);
        border: 1px solid rgba(255, 107, 53, 0.2);
        text-align: center;
        z-index: 9999;
        font-family: inherit;
    `;
    messageDiv.innerHTML = `
        <h3 style="color: #ff6b35; margin-bottom: 1rem; font-size: 1.5rem;">Authentication Required</h3>
        <p style="color: #666; margin-bottom: 2rem;">Please log in to access the welcome page.</p>
        <div style="width: 30px; height: 30px; border: 3px solid rgba(255, 107, 53, 0.3); border-top: 3px solid #ff6b35; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
    `;
    
    document.body.appendChild(messageDiv);
    
    // Redirect after showing message
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Make logout function globally accessible for HTML onclick
window.logout = logout;

// Add some additional styling for interactive elements
const welcomeStyles = document.createElement('style');
welcomeStyles.textContent = `
    .activity-item {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .activity-item:hover {
        box-shadow: 0 8px 25px rgba(255, 107, 53, 0.15);
    }
    
    .action-btn {
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .action-btn:active {
        transform: scale(0.95);
    }
    
    .hobby-tag {
        display: inline-block;
        margin: 0.25rem 0.5rem 0.25rem 0;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(welcomeStyles);