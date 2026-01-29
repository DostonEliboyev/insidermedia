import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes HTML content on the backend to prevent XSS attacks
 * 
 * WHY BACKEND SANITIZATION IS CRITICAL:
 * - Defense-in-depth: Even if frontend is compromised, backend protects
 * - Prevents malicious HTML from being stored in database
 * - Protects against API attacks that bypass frontend
 * - Ensures data integrity at the source
 * 
 * This sanitizes HTML before storing in the database, ensuring
 * only safe content is persisted.
 */
export const sanitizeHTML = (dirty) => {
  if (!dirty || typeof dirty !== 'string') return '';
  
  return sanitizeHtml(dirty, {
    // Allow safe HTML tags for rich text content
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span'
    ],
    // Allow safe attributes
    allowedAttributes: {
      'a': ['href', 'title'],
      'img': ['src', 'alt', 'title'],
      '*': ['class']
    },
    // Sanitize URLs to prevent javascript: and data: attacks
    allowedSchemes: ['http', 'https'],
    // Remove any script tags and event handlers automatically
    // sanitize-html blocks these by default
  });
};
