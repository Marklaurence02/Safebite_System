# SafeBite Backend API

This is the PHP backend for the SafeBite application, providing authentication and user management APIs.

## 📁 File Structure

```
backend/
├── config/
│   ├── database.php      # Database connection configuration
│   └── auth.php          # Authentication helper functions
├── api/
│   ├── login.php         # User login endpoint
│   ├── register.php      # User registration endpoint
│   ├── forgot-password.php # Password reset endpoint
│   └── logout.php        # User logout endpoint
├── test.php              # Backend test file
└── README.md             # This file
```

## 🚀 Setup Instructions

### 1. Database Setup
1. Start XAMPP and ensure Apache and MySQL services are running
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a new database named `safebite`
4. Import the SQL file: `database/safebite (7).sql`

### 2. Database Configuration
Edit `config/database.php` if needed:
```php
private $host = 'localhost';
private $db_name = 'safebite';
private $username = 'root';  // Default XAMPP username
private $password = '';       // Default XAMPP password
```

### 3. Test Backend
1. Open your browser and navigate to: `http://localhost/SafeBite/backend/test.php`
2. Verify that the database connection is successful
3. Check that existing users are displayed

## 🔌 API Endpoints

### Authentication Endpoints

#### POST `/backend/api/login.php`
**Login user with email and password**

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "user": {
        "user_id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "username": "johndoe",
        "email": "user@example.com",
        "role": "User",
        "full_name": "John Doe"
    },
    "session": {
        "token": "abc123...",
        "expires_at": "2025-01-15 10:30:00"
    }
}
```

#### POST `/backend/api/register.php`
**Register new user**

**Request Body:**
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "email": "user@example.com",
    "password": "password123",
    "confirm_password": "password123",
    "contact_number": "1234567890"
}
```

#### POST `/backend/api/forgot-password.php`
**Request password reset**

**Request Body:**
```json
{
    "email": "user@example.com"
}
```

#### POST `/backend/api/logout.php`
**Logout user (requires Authorization header)**

**Headers:**
```
Authorization: Bearer <session_token>
```

## 🔒 Security Features

- **Password Hashing**: Uses bcrypt for secure password storage
- **Session Management**: Secure session tokens with expiration
- **Input Sanitization**: All user inputs are sanitized
- **CORS Support**: Configured for cross-origin requests
- **SQL Injection Prevention**: Uses prepared statements
- **Activity Logging**: Tracks user login/logout activities

## 🧪 Testing

### Test with Existing Users
The database contains several test users:
- `marktiktok525@gmail.com`
- `marklaurencecaringal1@gmail.com`
- `benzoncarl010@gmail.com`

### Frontend Integration
The frontend JavaScript has been updated to use these API endpoints:
- Login form now calls `/backend/api/login.php`
- Registration form calls `/backend/api/register.php`
- Forgot password calls `/backend/api/forgot-password.php`

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check if MySQL service is running in XAMPP
   - Verify database name is `safebite`
   - Check username/password in `config/database.php`

2. **CORS Errors**
   - Ensure the backend is served from the same domain
   - Check that CORS headers are properly set

3. **404 Not Found**
   - Verify file paths are correct
   - Check that Apache is serving files from the correct directory

4. **500 Internal Server Error**
   - Check PHP error logs in XAMPP
   - Verify database table structure matches the SQL file

### Debug Mode
To enable debug mode, add this to the top of any PHP file:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## 📝 Notes

- The backend uses PDO for database operations
- Session tokens expire after 7 days
- Password reset OTPs expire after 15 minutes
- All API responses are in JSON format
- Activity logs are stored in the `activity_logs` table

## 🔄 Frontend Integration

The frontend JavaScript has been updated to:
- Make real API calls instead of simulated responses
- Handle authentication tokens
- Store user data in localStorage
- Provide proper error handling and user feedback 