import {type App, type DirectiveBinding} from 'vue';
import {canGoTo} from "@/stats/Utils";


const canGoToPlugin = {
    install(app: App) {
        // app.config.globalProperties.$canGoTo = async (route: { name: string }) => await canGoTo(route);

        app.directive('can-go-to', {
            async mounted(el: HTMLElement, binding: DirectiveBinding) {
                const route = binding.value;
                try {
                    const canAccess = await canGoTo({name: route.name});
                    // console.log('canAccess', canAccess)
                    if (!canAccess) {
                        // el.style.display = 'none';
                        el.parentNode?.removeChild(el);
                    }

                } catch (error) {
                    console.error('Access check failed:', error);
                    // el.style.display = 'none'; // Default to hidden if there's an error
                    el.parentNode?.removeChild(el);
                }
            }
        });
    }
};

export default canGoToPlugin;