/**
 * SECURITY: Role Validation Middleware
 * 
 * This middleware ensures that role fields cannot be manipulated
 * in any API requests, preventing privilege escalation attacks.
 * 
 * WHY THIS IS CRITICAL:
 * - Prevents users from setting themselves as admin via API
 * - Blocks role manipulation in update/create requests
 * - Enforces least-privilege security principle
 */

/**
 * Removes role field from request body to prevent manipulation
 * Role can only be set through secure seed scripts, not API
 */
export const removeRoleFromBody = (req, res, next) => {
  // SECURITY: Remove role field if present - prevents privilege escalation
  if (req.body && req.body.role) {
    delete req.body.role;
    // Log potential attack attempt
    console.warn(`[SECURITY] Attempted role manipulation blocked from IP: ${req.ip}`);
  }
  next();
};

/**
 * Validates that role field is not present in request
 * Throws error if role is attempted to be set
 */
export const validateNoRoleManipulation = (req, res, next) => {
  if (req.body && req.body.role) {
    return res.status(403).json({ 
      error: 'Role assignment is not allowed via API',
      message: 'Admin roles can only be assigned by system administrators'
    });
  }
  next();
};
