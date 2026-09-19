# Authentication & Security Architecture

CineStream implements a multi-layered authentication system designed for high security and seamless user experience.

## 1. Core Auth Mechanisms

### A. JWT (JSON Web Tokens)
- **Access Token:** Short-lived (15 min), stored in memory or HttpOnly Cookie.
- **Refresh Token:** Long-lived (7 days), stored in **HttpOnly, Secure, SameSite=Strict** Cookie.
- **Rotation:** Refresh tokens are rotated on every use. Reuse detection is implemented (stealing a refresh token invalidates the whole session).

### B. Passkey (WebAuthn) - *Planned*
- Support for Passwordless login using biometric or hardware keys.
- Implementation via `SimpleWebAuthn` library.

### C. MFA (Multi-Factor Authentication)
- **TOTP:** Google Authenticator, Authy.
- **Backup Codes:** One-time use codes for recovery.

## 2. Password Security
- **Hashing:** Argon2id (latest industry standard).
- **Complexity:** Enforced via `zod` validation.
- **Brute Force:** Rate limiting on login endpoints + temporary account lockout after 5 failed attempts.

## 3. Session Management
- **Device Tracking:** Users can see and revoke active sessions.
- **Session Versioning:** Changing password or revoking sessions increments the `session_version`, invalidating all current tokens.

## 4. Permission System (RBAC)
- **Roles:** `super_admin`, `admin`, `moderator`, `uploader`, `user`, etc.
- **Permissions:** Granular strings like `video.publish`, `comment.delete`.
- **Logic:** Handled via NestJS Guards using metadata decorators.

## 5. Security Logs & Auditing
- **Security Log:** Logs failed logins, password changes, MFA setup.
- **Audit Log:** Logs administrative actions (deleting content, banning users).

## 6. CSRF & XSS Protection
- **CSRF:** Use of custom headers for API calls + SameSite cookies.
- **XSS:** Strict Content Security Policy (CSP), HTML sanitization for comments.

## 7. Rate Limiting
- **Global:** Rate limit per IP.
- **Auth-specific:** Harder limits on Login/Register/Forgot Password.
- **Burst protection:** Token bucket algorithm.
