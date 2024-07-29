import {createGlobalState, StorageSerializers, useStorage} from "@vueuse/core";
import {type Ref, ref} from "vue";
import router from "@/router";
import axios from "axios";


interface LoginData {
    email: string;
    password: string;
    accountType: string;
}

export const loginState = createGlobalState(() => {
    const isLogin :Ref<boolean> =   useStorage("isLogin", false);
    // const userLogin = useStorage("userLogin", null);
    const userLogin = useStorage('userLogin', null, undefined, {serializer: StorageSerializers.object})
    const loginToken = useStorage("loginToken", '');
    const loginError = ref(null);

    const logout = () => {
        isLogin.value = false;
        userLogin.value = null;
        loginToken.value = null;
        loginError.value = null;
    };

    const login = async (credentials: LoginData) => {
        axios.post(import.meta.env.VITE_API_URL + "/login", credentials)
            .then((response) => {
                console.log(response)

                isLogin.value = true;
                userLogin.value = response.data.user;
                loginToken.value = response.data.token;
                // go to dashboard
                router.push("/dashboard");

            })
            .catch((e) => {
                loginError.value = e.response.data.message;
            });
    };

    return {isLogin, userLogin, loginToken, loginError, logout, login};
});
