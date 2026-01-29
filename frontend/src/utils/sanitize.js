import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * 
 * WHY THIS IS CRITICAL:
 * - Without sanitization, malicious scripts in news content can execute
 * - Attackers could steal cookies, session tokens, or redirect users
 * - This is a common attack vector that can compromise user accounts
 * 
 * DOMPurify removes dangerous elements and attributes while preserving
 * safe HTML formatting (bold, italic, links, etc.)
 */
export const sanitizeHTML = (dirty) => {
  if (!dirty) return '';
  
  return DOMPurify.sanitize(dirty, {
    // Allow safe HTML tags for rich text content
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span'
    ],
    // Allow safe attributes
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style'],
    // Allow data URIs for images (with restrictions)
    ALLOW_DATA_ATTR: false,
    // Remove any script tags and event handlers
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
};
