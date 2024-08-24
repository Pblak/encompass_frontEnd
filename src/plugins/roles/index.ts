export default {
    mounted(el: HTMLElement, binding: { value: string|[]; } ) {
        console.log('binding', binding)
        const allowedRoles = typeof binding.value  === "string" ? binding.value.split('|'): binding.value;
        const user = JSON.parse(<string>localStorage.getItem('userLogin'));

        if (!user || !allowedRoles.includes(user.accountType)) {
            if (el.parentNode) {
                el.parentNode.removeChild(el); // Remove the element if accountType doesn't match
            }
        }
    },
};