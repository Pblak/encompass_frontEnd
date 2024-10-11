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

export default {
    beforeMount(el: HTMLElement, binding: { value: string | []; }) {
        const allowedRoles = Array.isArray(binding.value) ? binding.value : binding.value.split('|');
        const user = JSON.parse(<string>localStorage.getItem('userLogin'));

        // Store a reference to the original parent node
        const originalParent = el.parentNode;

        const updateVisibility = () => {
            if (!user || !allowedRoles.includes(user.accountType)) {
                // Remove the element if accountType doesn't match
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            } else if (originalParent && !el.parentNode) {
                // If the user is allowed and the element is not in the DOM, re-insert it
                originalParent.appendChild(el); // Reinsert the element if it was removed
            }
        };

        // Initial visibility check
        updateVisibility();

        // Define the storage listener
        const storageListener = () => {
            const updatedUser = JSON.parse(<string>localStorage.getItem('userLogin'));
            if (user !== updatedUser) {
                updateVisibility();
            }
        };

        // Listen for changes in localStorage (optional)
        window.addEventListener('storage', storageListener);

        // Store the listener in the WeakMap for cleanup
        listenersMap.set(el, storageListener);
    },
    beforeUpdate(el: HTMLElement, binding: { value: string | []; }) {
        const allowedRoles = Array.isArray(binding.value) ? binding.value : binding.value.split('|');
        const user = JSON.parse(<string>localStorage.getItem('userLogin'));

        if (!user || !allowedRoles.includes(user.accountType)) {
            // Remove the element if the accountType doesn't match during updates as well
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
    },
    unmounted(el: HTMLElement) {
        // Retrieve and remove the listener from the WeakMap
        const storageListener = listenersMap.get(el);
        if (storageListener) {
            window.removeEventListener('storage', storageListener);
            listenersMap.delete(el); // Clean up the reference
        }
    }
};

