-- Cleanup Expired Sessions for SafeBite
-- Run this in phpMyAdmin to fix the authentication issue

-- First, check how many expired sessions exist
SELECT COUNT(*) as expired_sessions FROM sessions WHERE expires_at <= NOW();

-- Check how many total sessions exist
SELECT COUNT(*) as total_sessions FROM sessions;

-- Delete all expired sessions
DELETE FROM sessions WHERE expires_at <= NOW();

-- Verify cleanup
SELECT COUNT(*) as remaining_sessions FROM sessions;

-- Optional: Check if any sessions remain and their expiration dates
SELECT session_id, user_id, expires_at, created_at 
FROM sessions 
ORDER BY expires_at DESC;
