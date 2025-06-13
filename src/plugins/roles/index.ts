// export default {
//     mounted(el: HTMLElement, binding: { value: string|[]; } ) {
//
//         const allowedRoles = typeof binding.value  === "string" ? binding.value.split('|'): binding.value;
//         const user = JSON.parse(<string>localStorage.getItem('userLogin'));
//
//         if (!user || !allowedRoles.includes(user.accountType)) {
//             if (el.parentNode) {
//                 el.parentNode.removeChild(el); // Remove the element if accountType doesn't match
//             }
//         }
//     },
// };


const listenersMap = new WeakMap<HTMLElement, () => void>();
const originalDisplayMap = new WeakMap<HTMLElement, string>();

const getUserData = () => {
    try {
        const userString = localStorage.getItem('userLogin');
        return userString ? JSON.parse(userString) : null;
    } catch (error) {
        console.warn('Error parsing user data from localStorage:', error);
        return null;
    }
};

const checkRolePermission = (allowedRoles: string[], userAccountType: string | undefined): boolean => {
    return !!(userAccountType && allowedRoles.includes(userAccountType));
};

export default {
    beforeMount(el: HTMLElement, binding: { value: string | []; }) {
        // IMMEDIATELY hide the element to prevent flickering
        const originalDisplay = el.style.display || '';
        originalDisplayMap.set(el, originalDisplay);
        el.style.display = 'none';

        const allowedRoles = Array.isArray(binding.value) ? binding.value : binding.value.split('|');
        const user = getUserData();

        const updateVisibility = () => {
            const currentUser = getUserData();
            const isAuthorized = currentUser && checkRolePermission(allowedRoles, currentUser.accountType);
            
            if (isAuthorized) {
                // Show the element by restoring original display value
                const storedDisplay = originalDisplayMap.get(el) || '';
                el.style.display = storedDisplay;
            } else {
                // Keep element hidden
                el.style.display = 'none';
            }
        };

        // Check permissions and show element if authorized
        updateVisibility();

        // Define the storage listener for dynamic role changes
        const storageListener = () => {
            updateVisibility();
        };

        // Listen for changes in localStorage
        window.addEventListener('storage', storageListener);

        // Store the listener in the WeakMap for cleanup
        listenersMap.set(el, storageListener);
    },
    
    beforeUpdate(el: HTMLElement, binding: { value: string | []; }) {
        const allowedRoles = Array.isArray(binding.value) ? binding.value : binding.value.split('|');
        const user = getUserData();
        const isAuthorized = user && checkRolePermission(allowedRoles, user.accountType);

        if (isAuthorized) {
            const storedDisplay = originalDisplayMap.get(el) || '';
            el.style.display = storedDisplay;
        } else {
            el.style.display = 'none';
        }
    },
    
    updated(el: HTMLElement, binding: { value: string | []; }) {
        // Handle cases where the binding value changes
        const allowedRoles = Array.isArray(binding.value) ? binding.value : binding.value.split('|');
        const user = getUserData();
        const isAuthorized = user && checkRolePermission(allowedRoles, user.accountType);

        if (isAuthorized) {
            const storedDisplay = originalDisplayMap.get(el) || '';
            el.style.display = storedDisplay;
        } else {
            el.style.display = 'none';
        }
    },
    
    unmounted(el: HTMLElement) {
        // Clean up listeners and references
        const storageListener = listenersMap.get(el);
        if (storageListener) {
            window.removeEventListener('storage', storageListener);
            listenersMap.delete(el);
        }
        originalDisplayMap.delete(el);
    }
};

