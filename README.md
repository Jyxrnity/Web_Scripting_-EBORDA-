# Web_Scripting_-EBORDA-

A modern, responsive user registration and login system with a personalized welcome dashboard.

## System Overview

This system provides a complete user authentication flow with registration, login, and a personalized welcome experience. It features modern UI design with glassmorphism effects, floating animations, and comprehensive form validation.

## File Structure

```
project/
├── index.html          # Login/Registration page
├── index.css           # Styles for login/registration
├── indexes.js          # Login/registration functionality
├── welcome.html        # Welcome dashboard page
├── welcome.css         # Styles for welcome page
├── welcome.js          # Welcome page functionality
└── README.md           # This file
```

## System Flow

### 1. Entry Point (index.html)
```
User arrives → index.html
├── Registration Form (default)
└── Login Form (toggle available)
```

**Features:**
- Toggle between registration and login forms
- Real-time form validation
- Animated UI with floating shapes
- Responsive design

### 2. Registration Process
```
User fills registration form
├── Full Name (required, min 2 chars)
├── Email (required, valid format, unique check)
├── Username (required, min 3 chars, alphanumeric + underscore, unique check)
├── Password (required, min 6 chars)
├── Confirm Password (required, must match)
├── Gender (required, radio selection)
├── Hobbies (required, checkbox selection)
└── Country (required, dropdown selection)

Validation passes → User data stored in memory
└── Redirect to welcome.html with user data in sessionStorage
```

### 3. Login Process
```
User fills login form
├── Username/Email (required)
└── Password (required)

Credentials validated against stored users
└── If valid: Redirect to welcome.html with user data in sessionStorage
└── If invalid: Show error message
```

### 4. Welcome Dashboard (welcome.html)
```
Page loads → Check for user data in sessionStorage
├── If no data: Redirect to index.html with auth required message
└── If data found: Display personalized dashboard
```

**Dashboard Features:**
- Personalized greeting with user's name
- User profile section with avatar (initials)
- Quick action cards (placeholder functionality)
- Recent activity timeline
- Logout functionality

### 5. Data Storage Strategy

**Current Implementation (Client-Side Demo):**
- Users stored in JavaScript array during session
- Current user stored in sessionStorage for page navigation
- Data persists only during browser session

**Production Considerations:**
- Replace in-memory storage with server-side database
- Implement proper authentication tokens
- Add password hashing
- Use secure HTTP-only cookies instead of sessionStorage

## User Data Structure

```javascript
{
  id: "timestamp_string",
  fullName: "John Doe",
  email: "john@example.com",
  username: "johndoe",
  password: "plaintext", // Should be hashed in production
  gender: "male",
  hobbies: ["reading", "sports", "music"],
  country: "us",
  joinDate: "2025-01-15T10:30:00.000Z",
  lastLogin: "2025-01-15T10:30:00.000Z"
}
```

## Validation Rules

### Registration Validation
- **Full Name**: Minimum 2 characters
- **Email**: Valid format, uniqueness check
- **Username**: 3+ characters, alphanumeric + underscore only, uniqueness check
- **Password**: Minimum 6 characters
- **Confirm Password**: Must match password
- **Gender**: Required selection
- **Hobbies**: At least one selection required
- **Country**: Required selection

### Login Validation
- **Username/Email**: Required, accepts either username or email
- **Password**: Required

## Security Considerations

**Current State (Demo):**
- Client-side validation only
- Passwords stored in plaintext
- No CSRF protection
- No rate limiting

**Production Requirements:**
- Server-side validation
- Password hashing (bcrypt/scrypt)
- HTTPS enforcement
- CSRF tokens
- Rate limiting
- Input sanitization
- XSS protection

## Browser Compatibility

- Modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- Responsive design for mobile/tablet
- Graceful degradation for reduced motion preferences

## Setup Instructions

1. **Clone/Download Files**: Ensure all files are in the same directory
2. **Open in Browser**: Start with `index.html`
3. **Local Server (Recommended)**: Use a local server for best experience
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

## Usage Flow

1. **Start**: Open `index.html` in browser
2. **Register**: Fill out registration form with valid data
3. **Login**: Use registered credentials to log in
4. **Dashboard**: View personalized welcome page
5. **Logout**: Click logout to return to login page

## Customization

### Styling
- Modify colors in CSS custom properties
- Adjust animations in `@keyframes` sections
- Update glassmorphism effects via `backdrop-filter`

### Functionality
- Add new form fields in HTML and validation in JavaScript
- Extend user data structure
- Implement additional dashboard features

### Countries/Hobbies
- Update dropdown options in `index.html`
- Modify validation arrays in `indexes.js`

## Development Notes

### Known Limitations
- Data doesn't persist between browser sessions
- No backend integration
- Client-side validation only
- No password recovery functionality

### Future Enhancements
- Database integration
- Email verification
- Password reset functionality
- User profile editing
- Admin dashboard
- Social login integration

## Troubleshooting

**Common Issues:**

1. **User data not appearing on welcome page**
   - Check browser console for JavaScript errors
   - Ensure sessionStorage is enabled
   - Verify successful registration/login

2. **Validation not working**
   - Check that `indexes.js` is properly loaded
   - Verify form field names match JavaScript references

3. **Styles not loading**
   - Ensure CSS files are in correct relative paths
   - Check for browser caching issues

**Debug Commands (Browser Console):**
```javascript
// View stored users
console.log(window.getUsers ? window.getUsers() : 'getUsers not available');

// View current user
console.log(sessionStorage.getItem('currentUser'));

// Clear all data
sessionStorage.clear();
```

## Contributing

When modifying this system:
1. Test all validation scenarios
2. Ensure responsive design remains intact
3. Verify accessibility features
4. Test on multiple browsers
5. Update documentation for any new features
