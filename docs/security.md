# Security Implementation

CineStream is built with a "Security by Design" approach to protect both users and intellectual property.

## 1. Authentication Security

### A. Password Storage
- **Algorithm:** Argon2id.
- **Why:** Argon2 is the winner of the Password Hashing Competition and is resistant to GPU-based cracking.
- **Config:** High memory and time cost settings for production.

### B. JWT Management
- **Security:** Tokens are signed with HS256 (or RS256 for public keys).
- **Rotation:** Refresh Token Rotation (RTR) is enforced.
- **Revocation:** All sessions can be revoked centrally in Redis/DB.

### C. MFA (Multi-Factor)
- Supports TOTP (App-based) as a second layer.
- Recovery via encrypted Backup Codes.

## 2. Infrastructure Security

### A. Nginx Hardening
- **Secure Link:** Validates requests for HLS segments using a secret key and timestamp.
- **Anti-Hotlink:** Checks `Referer` and `Origin` headers.
- **Rate Limiting:** Protects against DDoS and brute force on API/Auth.
- **Headers:** Implementation of Helmet.js standard headers (HSTS, CSP, X-Frame-Options).

### B. Network Isolation
- Database and Redis are strictly private and only accessible by the API/Worker containers.
- SSH access is limited to key-based authentication.

## 3. Data Protection

### A. Soft Deletes
- Accidental deletions can be recovered.
- Data is masked for analytics.

### B. Input Validation
- **Zod/Class-Validator:** Strict schema validation for all API inputs.
- **Sanitization:** Preventing XSS by sanitizing all user-generated content (comments).

### C. File Upload Security
- **Mime Check:** Only allowed types (mp4, mkv, jpg, png, webp).
- **Size Limits:** Enforced at Nginx and API level.
- **Scanning:** (Recommended) Integration with ClamAV for scanning uploaded media.

## 4. Operational Security

### A. Audit Logs
- Every administrative action is logged (Who, What, When, Before, After).

### B. Environment Secrets
- **Zero Hardcoding:** No secrets are stored in code.
- **Validation:** API will not start if critical secrets are missing from `.env`.

## 5. Security Incident Response
- Centralized `security_logs` table for tracking suspicious patterns.
- Automated lockout after repeated failed attempts.
- "Revoke All" session capability for security breaches.
