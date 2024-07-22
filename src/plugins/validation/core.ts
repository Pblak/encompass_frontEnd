import {type validationRule} from '../validation/types';

export default function (rules: string, fieldName ?: string): validationRule[] {
    const rulesArray = rules.split('|');
    const validationRules: validationRule[] = [];

    fieldName = fieldName ? 'The ' + fieldName + ' field' : 'This field';

    rulesArray.forEach((rule) => {
        if (rule === 'required') {
            validationRules.push((v: string) => !!v || `${fieldName} is required`);
        }

        if (rule.startsWith('max:')) {
            const maxRuleParts = rule.split(':');
            const maxLength = parseInt(maxRuleParts[1], 10);

            if (maxRuleParts.length === 2) {
                // Handle max rule for objects
                validationRules.push((v: any) => {
                    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
                        return Object.keys(v).length <= maxLength || `${fieldName} must have fewer than ${maxLength + 1} properties`;
                    } else {
                        return v.length <= maxLength || `${fieldName} must be shorter than ${maxLength + 1} characters`;
                    }
                });
            } else {
                validationRules.push((v: string) => (v && v.length <= maxLength) || `${fieldName} must be less than ${maxLength} characters`);
            }
        }

        if (rule.startsWith('min:')) {
            const minRuleParts = rule.split(':');
            const minLength = parseInt(minRuleParts[1], 10);

            validationRules.push((v: any) => {
                if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
                    return Object.keys(v).length >= minLength || `${fieldName} must have at least ${minLength} properties`;
                } else {
                    return v.length >= minLength || `${fieldName} must be at least ${minLength} characters`;
                }
            });
        }

        if (rule === 'number') {
            validationRules.push((v: string) => !isNaN(Number(v)) || `${fieldName} must be a number`);
        }
        if (rule === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validationRules.push((v: string) => emailPattern.test(v) || `${fieldName} must be a valid email`);
        }
        if (rule === 'date') {
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            validationRules.push((v: string) => datePattern.test(v) || `${fieldName} must be a valid date (YYYY-MM-DD)`);
        }
        if (rule === 'alpha') {
            const alphaPattern = /^[A-Za-z]+$/;
            validationRules.push((v: string) => alphaPattern.test(v) || `${fieldName} must contain only alphabetic characters`);
        }
        if (rule === 'alphanumeric') {
            const alphanumericPattern = /^[A-Za-z0-9]+$/;
            validationRules.push((v: string) => alphanumericPattern.test(v) || `${fieldName} must contain only alphanumeric characters`);
        }
        if (rule === 'object') {
            validationRules.push((v: any) => typeof v === 'object' && !Array.isArray(v) || `${fieldName} is required`);
        }
        if (rule.includes(',')) {
            const keyRules = rule.split(','); // Split rules by comma
            keyRules.forEach(keyRule => {
                const [key, typeRule] = keyRule.split('='); // Split by equal sign to get key and type rule
                if (typeRule) {
                    const [type, subtype] = typeRule.split(':'); // Split type rule by colon if applicable
                    validationRules.push((v: any) => {
                        if (!(key.trim() in v)) {
                            return `${fieldName} must have the property '${key.trim()}'`;
                        }
                        switch (type.trim()) {
                            case 'number':
                                if (isNaN(Number(v[key.trim()]))) {
                                    return `${fieldName}.${key.trim()} must be a number`;
                                }
                                break;
                            case 'string':
                                if (typeof v[key.trim()] !== 'string') {
                                    return `${fieldName}.${key.trim()} must be a string`;
                                }
                                break;
                            case 'email':
                                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (!emailPattern.test(v[key.trim()])) {
                                    return `${fieldName}.${key.trim()} must be a valid email`;
                                }
                                break;
                            // Add more type validations as needed
                            default:
                                break;
                        }
                        return true;
                    });
                } else {
                    validationRules.push((v: any) => `${fieldName} must have the property '${key.trim()}'`);
                }
            });
        }
        // Add more rules as needed
    });
    return validationRules;
}