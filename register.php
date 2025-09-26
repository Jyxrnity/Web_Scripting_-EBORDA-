<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

// Function to sanitize input data
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to check if username or email already exists
function userExists($username, $email) {
    if (!file_exists('users.txt')) {
        return false;
    }
    
    $users = file('users.txt', FILE_IGNORE_NEW_LINES);
    foreach ($users as $user) {
        $userData = explode('|', $user);
        if (count($userData) >= 3) {
            $existingUsername = $userData[2];
            $existingEmail = $userData[1];
            
            if ($existingUsername === $username || $existingEmail === $email) {
                return true;
            }
        }
    }
    return false;
}

// Function to validate email format
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Function to validate password strength
function isStrongPassword($password) {
    return strlen($password) >= 6;
}

// Debug: Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "<h3>Form submitted successfully!</h3>";
    echo "<p>POST data received:</p>";
    echo "<pre>" . print_r($_POST, true) . "</pre>";
    
    $errors = [];
    
    // Sanitize and validate input data
    $fullName = sanitizeInput($_POST['fullName']);
    $email = sanitizeInput($_POST['email']);
    $username = sanitizeInput($_POST['username']);
    $password = $_POST['password']; // Don't sanitize password to preserve special characters
    $confirmPassword = $_POST['confirmPassword'];
    $gender = isset($_POST['gender']) ? sanitizeInput($_POST['gender']) : '';
    $hobbies = isset($_POST['hobbies']) ? $_POST['hobbies'] : [];
    $country = sanitizeInput($_POST['country']);
    
    echo "<p>Sanitized data:</p>";
    echo "<pre>";
    echo "Full Name: " . $fullName . "\n";
    echo "Email: " . $email . "\n";
    echo "Username: " . $username . "\n";
    echo "Gender: " . $gender . "\n";
    echo "Hobbies: " . print_r($hobbies, true) . "\n";
    echo "Country: " . $country . "\n";
    echo "</pre>";
    
    // Validation
    if (strlen($fullName) < 2) {
        $errors[] = "Full name must be at least 2 characters long";
    }
    
    if (!isValidEmail($email)) {
        $errors[] = "Please enter a valid email address";
    }
    
    if (strlen($username) < 3) {
        $errors[] = "Username must be at least 3 characters long";
    }
    
    if (!isStrongPassword($password)) {
        $errors[] = "Password must be at least 6 characters long";
    }
    
    if ($password !== $confirmPassword) {
        $errors[] = "Passwords do not match";
    }
    
    if (empty($gender)) {
        $errors[] = "Please select your gender";
    }
    
    if (empty($hobbies)) {
        $errors[] = "Please select at least one hobby";
    }
    
    if (empty($country)) {
        $errors[] = "Please select your country";
    }
    
    // Check if user already exists
    if (userExists($username, $email)) {
        $errors[] = "Username or email already exists";
    }
    
    // Display validation results
    if (!empty($errors)) {
        echo "<h3>Validation Errors:</h3>";
        echo "<ul>";
        foreach ($errors as $error) {
            echo "<li>" . $error . "</li>";
        }
        echo "</ul>";
    } else {
        echo "<h3>All validations passed!</h3>";
    }
    
    // If no errors, save user data
    if (empty($errors)) {
        // Hash the password for security
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Prepare hobbies string
        $hobbiesString = implode(',', $hobbies);
        
        // Prepare user data string
        // Format: fullName|email|username|hashedPassword|gender|hobbies|country|registrationDate
        $registrationDate = date('Y-m-d H:i:s');
        $userData = $fullName . '|' . $email . '|' . $username . '|' . $hashedPassword . '|' . 
                   $gender . '|' . $hobbiesString . '|' . $country . '|' . $registrationDate . "\n";
        
        echo "<h3>Attempting to save user data...</h3>";
        echo "<p>Data to save: " . htmlspecialchars($userData) . "</p>";
        
        // Check if directory is writable
        if (is_writable('.')) {
            echo "<p>✓ Directory is writable</p>";
        } else {
            echo "<p>✗ Directory is NOT writable</p>";
        }
        
        // Save to file
        $result = file_put_contents('users.txt', $userData, FILE_APPEND | LOCK_EX);
        
        if ($result !== false) {
            echo "<p>✓ File written successfully! Bytes written: " . $result . "</p>";
            
            // Registration successful
            $message = "Registration successful! You can now log in.";
            $messageType = "success";
            
            echo "<p>Redirecting to login form...</p>";
            echo "<p><a href='index.html?message=" . urlencode($message) . "&type=" . $messageType . "&form=login'>Click here if not redirected</a></p>";
            
            // Comment out redirect for debugging
            // header("Location: index.html?message=" . urlencode($message) . "&type=" . $messageType . "&form=login");
            // exit();
        } else {
            echo "<p>✗ Failed to write to file</p>";
            $errors[] = "Failed to save user data. Please try again.";
        }
    }
    
    // If there are errors, show them
    if (!empty($errors)) {
        $errorMessage = implode('. ', $errors);
        echo "<h3>Final Error Message:</h3>";
        echo "<p>" . $errorMessage . "</p>";
        echo "<p><a href='index.html?message=" . urlencode($errorMessage) . "&type=error'>Go back to form</a></p>";
        
        // Comment out redirect for debugging
        // header("Location: index.html?message=" . urlencode($errorMessage) . "&type=error");
        // exit();
    }
} else {
    echo "<h3>No POST data received</h3>";
    echo "<p>Request method: " . $_SERVER["REQUEST_METHOD"] . "</p>";
    echo "<p><a href='index.html'>Go to registration form</a></p>";
    
    // Comment out redirect for debugging
    // header("Location: index.html");
    // exit();
}
?>
