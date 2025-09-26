<?php
session_start();

// Function to sanitize input data
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to authenticate user
function authenticateUser($username, $password) {
    if (!file_exists('users.txt')) {
        return false;
    }
    
    $users = file('users.txt', FILE_IGNORE_NEW_LINES);
    foreach ($users as $user) {
        $userData = explode('|', $user);
        if (count($userData) >= 4) {
            $storedUsername = $userData[2];
            $storedHashedPassword = $userData[3];
            
            if ($storedUsername === $username) {
                // Verify password
                if (password_verify($password, $storedHashedPassword)) {
                    // Return user data
                    return [
                        'fullName' => $userData[0],
                        'email' => $userData[1],
                        'username' => $userData[2],
                        'gender' => isset($userData[4]) ? $userData[4] : '',
                        'hobbies' => isset($userData[5]) ? $userData[5] : '',
                        'country' => isset($userData[6]) ? $userData[6] : '',
                        'registrationDate' => isset($userData[7]) ? $userData[7] : ''
                    ];
                }
                break;
            }
        }
    }
    return false;
}

// Function to log user login
function logUserLogin($username) {
    $logEntry = date('Y-m-d H:i:s') . " - User '$username' logged in\n";
    file_put_contents('login_logs.txt', $logEntry, FILE_APPEND | LOCK_EX);
}

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $errors = [];
    
    // Sanitize input data
    $username = sanitizeInput($_POST['username']);
    $password = $_POST['password']; // Don't sanitize password
    $remember = isset($_POST['remember']) ? true : false;
    
    // Basic validation
    if (empty($username)) {
        $errors[] = "Username is required";
    }
    
    if (empty($password)) {
        $errors[] = "Password is required";
    }
    
    // If no validation errors, attempt authentication
    if (empty($errors)) {
        $user = authenticateUser($username, $password);
        
        if ($user) {
            // Login successful
            $_SESSION['logged_in'] = true;
            $_SESSION['user_data'] = $user;
            $_SESSION['login_time'] = time();
            
            // Set remember me cookie if requested (expires in 30 days)
            if ($remember) {
                $cookieValue = base64_encode($username . ':' . time());
                setcookie('remember_user', $cookieValue, time() + (30 * 24 * 60 * 60), '/');
            }
            
            // Log the login
            logUserLogin($username);
            
            // Redirect to welcome page
            $message = "Welcome back, " . $user['fullName'] . "!";
            header("Location: welcome.php?message=" . urlencode($message) . "&type=success");
            exit();
        } else {
            $errors[] = "Invalid username or password";
        }
    }
    
    // If there are errors, redirect back with error message
    if (!empty($errors)) {
        $errorMessage = implode('. ', $errors);
        header("Location: index.html?message=" . urlencode($errorMessage) . "&type=error&form=login");
        exit();
    }
} else {
    // Check for remember me cookie
    if (isset($_COOKIE['remember_user']) && !isset($_SESSION['logged_in'])) {
        $cookieData = base64_decode($_COOKIE['remember_user']);
        $parts = explode(':', $cookieData);
        
        if (count($parts) == 2) {
            $username = $parts[0];
            $timestamp = $parts[1];
            
            // Check if cookie is still valid (30 days)
            if ((time() - $timestamp) < (30 * 24 * 60 * 60)) {
                // Auto-login user
                if (file_exists('users.txt')) {
                    $users = file('users.txt', FILE_IGNORE_NEW_LINES);
                    foreach ($users as $user) {
                        $userData = explode('|', $user);
                        if (count($userData) >= 4 && $userData[2] === $username) {
                            $_SESSION['logged_in'] = true;
                            $_SESSION['user_data'] = [
                                'fullName' => $userData[0],
                                'email' => $userData[1],
                                'username' => $userData[2],
                                'gender' => isset($userData[4]) ? $userData[4] : '',
                                'hobbies' => isset($userData[5]) ? $userData[5] : '',
                                'country' => isset($userData[6]) ? $userData[6] : '',
                                'registrationDate' => isset($userData[7]) ? $userData[7] : ''
                            ];
                            $_SESSION['login_time'] = time();
                            
                            logUserLogin($username);
                            header("Location: welcome.php?message=" . urlencode("Welcome back, " . $userData[0] . "!") . "&type=success");
                            exit();
                        }
                    }
                }
            } else {
                // Cookie expired, remove it
                setcookie('remember_user', '', time() - 3600, '/');
            }
        }
    }
    
    // If accessed directly without POST, redirect to login form
    header("Location: index.html?form=login");
    exit();
}
?>
