/**
 * Validation Functions for Railway Block Management System
 */

// Validate required field
function validateRequired(value, fieldName) {
    if (!value || String(value).trim() === '') {
        return { valid: false, message: `${fieldName} is required` };
    }
    return { valid: true };
}

// Validate date
function validateDate(dateString, fieldName) {
    if (!dateString) return { valid: true }; // Optional field
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return { valid: false, message: `${fieldName} is not a valid date` };
    }
    
    return { valid: true };
}

// Validate time
function validateTime(timeString, fieldName) {
    if (!timeString) return { valid: true }; // Optional field
    
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(timeString)) {
        return { valid: false, message: `${fieldName} must be in HH:MM format` };
    }
    
    return { valid: true };
}

// Validate number
function validateNumber(value, fieldName, min = 0, max = null) {
    if (!value && value !== 0) return { valid: true }; // Optional field
    
    const num = parseFloat(value);
    if (isNaN(num)) {
        return { valid: false, message: `${fieldName} must be a valid number` };
    }
    
    if (num < min) {
        return { valid: false, message: `${fieldName} cannot be less than ${min}` };
    }
    
    if (max !== null && num > max) {
        return { valid: false, message: `${fieldName} cannot be greater than ${max}` };
    }
    
    return { valid: true };
}

// Validate email
function validateEmail(email, fieldName = 'Email') {
    if (!email) return { valid: true }; // Optional field
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: `${fieldName} is not valid` };
    }
    
    return { valid: true };
}

// Validate phone number
function validatePhone(phone, fieldName = 'Phone') {
    if (!phone) return { valid: true }; // Optional field
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[-\s]/g, ''))) {
        return { valid: false, message: `${fieldName} must be a valid 10-digit number` };
    }
    
    return { valid: true };
}

// Validate text length
function validateLength(value, fieldName, minLength = 0, maxLength = 255) {
    if (!value) value = '';
    const length = String(value).length;
    
    if (length < minLength) {
        return { valid: false, message: `${fieldName} must be at least ${minLength} characters` };
    }
    
    if (length > maxLength) {
        return { valid: false, message: `${fieldName} cannot exceed ${maxLength} characters` };
    }
    
    return { valid: true };
}

// Validate file size
function validateFileSize(file, maxSizeMB) {
    if (!file) return { valid: true }; // Optional field
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return { valid: false, message: `File size cannot exceed ${maxSizeMB}MB` };
    }
    
    return { valid: true };
}

// Validate file type
function validateFileType(file, allowedTypes = []) {
    if (!file) return { valid: true }; // Optional field
    
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        return { valid: false, message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
    }
    
    return { valid: true };
}

// Validate form
function validateForm(formElement) {
    const errors = {};
    let isValid = true;
    
    const formData = new FormData(formElement);
    
    for (let [key, value] of formData.entries()) {
        const field = formElement.elements[key];
        if (!field) continue;
        
        // Get field type and required status
        const type = field.type || field.tagName.toLowerCase();
        const required = field.required;
        
        // Perform validations
        if (required) {
            const validation = validateRequired(value, field.label || key);
            if (!validation.valid) {
                errors[key] = validation.message;
                isValid = false;
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
            }
        }
        
        // Type-specific validation
        if (value && required) {
            if (type === 'email') {
                const validation = validateEmail(value);
                if (!validation.valid) {
                    errors[key] = validation.message;
                    isValid = false;
                    field.classList.add('is-invalid');
                }
            } else if (type === 'number') {
                const validation = validateNumber(value);
                if (!validation.valid) {
                    errors[key] = validation.message;
                    isValid = false;
                    field.classList.add('is-invalid');
                }
            } else if (type === 'date') {
                const validation = validateDate(value);
                if (!validation.valid) {
                    errors[key] = validation.message;
                    isValid = false;
                    field.classList.add('is-invalid');
                }
            } else if (type === 'time') {
                const validation = validateTime(value);
                if (!validation.valid) {
                    errors[key] = validation.message;
                    isValid = false;
                    field.classList.add('is-invalid');
                }
            }
        }
    }
    
    return { valid: isValid, errors };
}

// Clear validation errors
function clearValidationErrors(formElement) {
    const fields = formElement.querySelectorAll('.form-control, .form-select');
    fields.forEach(field => {
        field.classList.remove('is-invalid');
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.remove();
        }
    });
}

// Show field error
function showFieldError(fieldElement, message) {
    fieldElement.classList.add('is-invalid');
    
    // Remove existing feedback
    const existingFeedback = fieldElement.nextElementSibling;
    if (existingFeedback && existingFeedback.classList.contains('invalid-feedback')) {
        existingFeedback.remove();
    }
    
    // Add new feedback
    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    feedback.textContent = message;
    fieldElement.parentNode.insertBefore(feedback, fieldElement.nextSibling);
}

// Clear field error
function clearFieldError(fieldElement) {
    fieldElement.classList.remove('is-invalid');
    const feedback = fieldElement.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.remove();
    }
}