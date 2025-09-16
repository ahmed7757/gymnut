import DOMPurify from 'isomorphic-dompurify';

// HTML sanitization options
const sanitizeOptions = {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
};

// SQL injection patterns to detect
const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /(\b(OR|AND)\s+['"]\s*=\s*['"])/gi,
    /(UNION\s+SELECT)/gi,
    /(DROP\s+TABLE)/gi,
    /(INSERT\s+INTO)/gi,
    /(UPDATE\s+SET)/gi,
    /(DELETE\s+FROM)/gi
];

// XSS patterns to detect
const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
    /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /onmouseover\s*=/gi
];

// Path traversal patterns
const pathTraversalPatterns = [
    /\.\.\//g,
    /\.\.\\/g,
    /\.\.%2f/gi,
    /\.\.%5c/gi,
    /\.\.%252f/gi,
    /\.\.%255c/gi
];

export class InputSanitizer {
    /**
     * Sanitize string input by removing dangerous characters and patterns
     */
    static sanitizeString(input: string, options: {
        maxLength?: number;
        allowHtml?: boolean;
        allowSpecialChars?: boolean;
    } = {}): string {
        if (typeof input !== 'string') {
            return '';
        }

        const { maxLength = 1000, allowHtml = false, allowSpecialChars = true } = options;

        let sanitized = input.trim();

        // Check for SQL injection
        if (this.detectSQLInjection(sanitized)) {
            throw new Error('Invalid input: potential SQL injection detected');
        }

        // Check for XSS
        if (this.detectXSS(sanitized)) {
            throw new Error('Invalid input: potential XSS attack detected');
        }

        // Check for path traversal
        if (this.detectPathTraversal(sanitized)) {
            throw new Error('Invalid input: potential path traversal detected');
        }

        // HTML sanitization
        if (!allowHtml) {
            sanitized = DOMPurify.sanitize(sanitized, sanitizeOptions);
        }

        // Remove or escape special characters if not allowed
        if (!allowSpecialChars) {
            sanitized = sanitized.replace(/[<>'"&]/g, '');
        }

        // Limit length
        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        return sanitized;
    }

    /**
     * Sanitize email input
     */
    static sanitizeEmail(email: string): string {
        if (typeof email !== 'string') {
            throw new Error('Email must be a string');
        }

        const sanitized = email.trim().toLowerCase();

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized)) {
            throw new Error('Invalid email format');
        }

        // Check for dangerous patterns
        if (this.detectSQLInjection(sanitized) || this.detectXSS(sanitized)) {
            throw new Error('Invalid email: contains dangerous patterns');
        }

        return sanitized;
    }

    /**
     * Sanitize numeric input
     */
    static sanitizeNumber(input: any, options: {
        min?: number;
        max?: number;
        allowFloat?: boolean;
    } = {}): number {
        const { min = -Infinity, max = Infinity, allowFloat = true } = options;

        let num: number;

        if (typeof input === 'number') {
            num = input;
        } else if (typeof input === 'string') {
            // Check for dangerous patterns in string
            if (this.detectSQLInjection(input) || this.detectXSS(input)) {
                throw new Error('Invalid number: contains dangerous patterns');
            }

            num = allowFloat ? parseFloat(input) : parseInt(input, 10);
        } else {
            throw new Error('Input must be a number or numeric string');
        }

        if (isNaN(num)) {
            throw new Error('Invalid number format');
        }

        if (num < min || num > max) {
            throw new Error(`Number must be between ${min} and ${max}`);
        }

        return num;
    }

    /**
     * Sanitize object input recursively
     */
    static sanitizeObject<T extends Record<string, any>>(
        obj: T,
        schema: Record<string, any>
    ): T {
        if (typeof obj !== 'object' || obj === null) {
            throw new Error('Input must be an object');
        }

        const sanitized = {} as T;

        for (const [key, value] of Object.entries(obj)) {
            // Sanitize key
            const sanitizedKey = this.sanitizeString(key, { maxLength: 50, allowSpecialChars: false });

            if (!schema[sanitizedKey]) {
                continue; // Skip unknown properties
            }

            const fieldSchema = schema[sanitizedKey];

            try {
                if (fieldSchema.type === 'string') {
                    sanitized[sanitizedKey as keyof T] = this.sanitizeString(value, fieldSchema.options) as T[keyof T];
                } else if (fieldSchema.type === 'email') {
                    sanitized[sanitizedKey as keyof T] = this.sanitizeEmail(value) as T[keyof T];
                } else if (fieldSchema.type === 'number') {
                    sanitized[sanitizedKey as keyof T] = this.sanitizeNumber(value, fieldSchema.options) as T[keyof T];
                } else if (fieldSchema.type === 'array') {
                    sanitized[sanitizedKey as keyof T] = this.sanitizeArray(value, fieldSchema.itemSchema) as T[keyof T];
                } else if (fieldSchema.type === 'object') {
                    sanitized[sanitizedKey as keyof T] = this.sanitizeObject(value, fieldSchema.schema) as T[keyof T];
                } else {
                    sanitized[sanitizedKey as keyof T] = value;
                }
            } catch (error) {
                throw new Error(`Error sanitizing field '${sanitizedKey}': ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        return sanitized;
    }

    /**
     * Sanitize array input
     */
    static sanitizeArray<T>(input: any[], itemSchema: any): T[] {
        if (!Array.isArray(input)) {
            throw new Error('Input must be an array');
        }

        return input.map((item, index) => {
            try {
                if (itemSchema.type === 'string') {
                    return this.sanitizeString(item, itemSchema.options);
                } else if (itemSchema.type === 'email') {
                    return this.sanitizeEmail(item);
                } else if (itemSchema.type === 'number') {
                    return this.sanitizeNumber(item, itemSchema.options);
                } else if (itemSchema.type === 'object') {
                    return this.sanitizeObject(item, itemSchema.schema);
                } else {
                    return item;
                }
            } catch (error) {
                throw new Error(`Error sanitizing array item at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }

    /**
     * Detect SQL injection patterns
     */
    private static detectSQLInjection(input: string): boolean {
        return sqlInjectionPatterns.some(pattern => pattern.test(input));
    }

    /**
     * Detect XSS patterns
     */
    private static detectXSS(input: string): boolean {
        return xssPatterns.some(pattern => pattern.test(input));
    }

    /**
     * Detect path traversal patterns
     */
    private static detectPathTraversal(input: string): boolean {
        return pathTraversalPatterns.some(pattern => pattern.test(input));
    }
}

// Predefined sanitization schemas
export const sanitizationSchemas = {
    userProfile: {
        name: { type: 'string', options: { maxLength: 100, allowSpecialChars: false } },
        email: { type: 'email' },
        age: { type: 'number', options: { min: 13, max: 120, allowFloat: false } },
        height: { type: 'number', options: { min: 100, max: 250, allowFloat: true } },
        weight: { type: 'number', options: { min: 30, max: 300, allowFloat: true } },
        goal: { type: 'string', options: { maxLength: 20, allowSpecialChars: false } },
        diseases: {
            type: 'array',
            itemSchema: { type: 'string', options: { maxLength: 50, allowSpecialChars: false } }
        }
    },

    mealLog: {
        foodName: { type: 'string', options: { maxLength: 200, allowSpecialChars: false } },
        category: { type: 'string', options: { maxLength: 20, allowSpecialChars: false } },
        quantity: { type: 'number', options: { min: 0, max: 10000, allowFloat: true } },
        calories: { type: 'number', options: { min: 0, max: 10000, allowFloat: true } },
        protein: { type: 'number', options: { min: 0, max: 1000, allowFloat: true } },
        carbs: { type: 'number', options: { min: 0, max: 1000, allowFloat: true } },
        fat: { type: 'number', options: { min: 0, max: 1000, allowFloat: true } }
    },

    workoutPlan: {
        fitnessLevel: { type: 'string', options: { maxLength: 20, allowSpecialChars: false } },
        workoutDays: { type: 'number', options: { min: 1, max: 7, allowFloat: false } },
        method: { type: 'string', options: { maxLength: 100, allowSpecialChars: false } }
    }
};

// Middleware function for request sanitization
export function sanitizeRequest<T>(
    req: Request,
    schema: Record<string, any>
): Promise<T> {
    return req.json().then((data: any) => {
        return InputSanitizer.sanitizeObject(data, schema);
    });
}
