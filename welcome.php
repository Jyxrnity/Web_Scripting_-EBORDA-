<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    header("Location: index.html?message=" . urlencode("Please log in to access this page") . "&type=error&form=login");
    exit();
}

$user = $_SESSION['user_data'];
$hobbies = !empty($user['hobbies']) ? explode(',', $user['hobbies']) : [];

// Handle logout
if (isset($_GET['logout'])) {
    // Clear session
    session_destroy();
    
    // Clear remember me cookie
    if (isset($_COOKIE['remember_user'])) {
        setcookie('remember_user', '', time() - 3600, '/');
    }
    
    header("Location: index.html?message=" . urlencode("You have been logged out successfully") . "&type=success&form=login");
    exit();
}

// Get message from URL if present
$message = isset($_GET['message']) ? htmlspecialchars($_GET['message']) : '';
$messageType = isset($_GET['type']) ? htmlspecialchars($_GET['type']) : 'info';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
        }

        .header {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
        }

        .welcome-text h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .welcome-text p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .logout-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .logout-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
        }

        .card {
            background: rgba(255, 255, 255, 0.95);
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }

        .card h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.5rem;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }

        .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding: 10px;
            background: rgba(102, 126, 234, 0.05);
            border-radius: 8px;
        }

        .info-label {
            font-weight: 600;
            color: #555;
        }

        .info-value {
            color: #333;
        }

        .hobbies-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }

        .hobby-tag {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .message {
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-weight: 500;
        }

        .message.success {
            background: rgba(34, 197, 94, 0.1);
            color: #15803d;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .message.error {
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        @media (max-width: 768px) {
            .header {
                flex-direction: column;
                gap: 20px;
                text-align: center;
            }

            .welcome-text h1 {
                font-size: 2rem;
            }

            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <?php if ($message): ?>
            <div class="message <?php echo $messageType; ?>">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>

        <div class="header">
            <div class="welcome-text">
                <h1>Welcome, <?php echo htmlspecialchars($user['fullName']); ?>! 👋</h1>
                <p>You are successfully logged in to your dashboard</p>
            </div>
            <a href="?logout=1" class="logout-btn">Logout</a>
        </div>

        <div class="dashboard-grid">
            <div class="card">
                <h2>Profile Information</h2>
                
                <div class="info-item">
                    <span class="info-label">Full Name:</span>
                    <span class="info-value"><?php echo htmlspecialchars($user['fullName']); ?></span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Username:</span>
                    <span class="info-value"><?php echo htmlspecialchars($user['username']); ?></span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Email:</span>
                    <span class="info-value"><?php echo htmlspecialchars($user['email']); ?></span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Gender:</span>
                    <span class="info-value"><?php echo htmlspecialchars(ucfirst($user['gender'])); ?></span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Country:</span>
                    <span class="info-value"><?php echo htmlspecialchars($user['country']); ?></span>
                </div>
            </div>

            <div class="card">
                <h2>Your Hobbies</h2>
                <?php if (!empty($hobbies)): ?>
                    <div class="hobbies-list">
                        <?php foreach ($hobbies as $hobby): ?>
                            <span class="hobby-tag"><?php echo htmlspecialchars(ucfirst($hobby)); ?></span>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <p>No hobbies selected</p>
                <?php endif; ?>
            </div>

            <div class="card">
                <h2>Account Details</h2>
                
                <div class="info-item">
                    <span class="info-label">Registration Date:</span>
                    <span class="info-value">
                        <?php 
                        if (!empty($user['registrationDate'])) {
                            echo date('F j, Y', strtotime($user['registrationDate']));
                        } else {
                            echo 'N/A';
                        }
                        ?>
                    </span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Login Time:</span>
                    <span class="info-value">
                        <?php 
                        if (isset($_SESSION['login_time'])) {
                            echo date('F j, Y - g:i A', $_SESSION['login_time']);
                        } else {
                            echo 'N/A';
                        }
                        ?>
                    </span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Session Status:</span>
                    <span class="info-value" style="color: #15803d; font-weight: 600;">Active ✓</span>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
