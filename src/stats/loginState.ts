import { createGlobalState, useStorage ,StorageSerializers } from "@vueuse/core";
import { ref } from "vue";
import router from "@/router";



interface LoginData {
    email: string;
    password: string;
    accountType: 'students' | 'web';
}
export const loginState = createGlobalState(() => {
    const isLogin = useStorage("isLogin", false);
    // const userLogin = useStorage("userLogin", null);
    const userLogin = useStorage('userLogin', null, undefined, { serializer: StorageSerializers.object })
    const loginToken = useStorage("loginToken", null);
    const loginError = ref(null);

    const logout = () => {
        isLogin.value = false;
        userLogin.value = null;
        loginToken.value = null;
        loginError.value = null;
    };

    const login = async (credentials:LoginData) => {
        console.log(credentials)
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...credentials }),
            });
            const data = await response.json();
            if (data.error) {
                loginError.value = data.error;
            } else {
                isLogin.value = true;
                userLogin.value = data.user;
                loginToken.value = data.token;
                // go to dashboard
                router.push("/dashboard");
            }
        } catch (e: any) {
            loginError.value = e.message;
        }
    };

    return { isLogin, userLogin, loginToken, loginError, logout, login };
});
