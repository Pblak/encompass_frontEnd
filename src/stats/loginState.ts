import {createGlobalState, StorageSerializers, useStorage} from "@vueuse/core";

import router from "@/router";
import axios from "axios";
import {ref, type Ref} from "vue";
import type {StudentType} from "@/stats/studentState";
interface LoginData {
    email: string;
    password: string;
    accountType: string;
}

interface UserModel extends StudentType{
    [key: string]: any
}

export const loginState = createGlobalState(() => {
    const isLogin: Ref<boolean> = useStorage("isLogin", false);
    const userLogin:Ref<UserModel|null> = useStorage('userLogin', null, undefined, {serializer: StorageSerializers.object})
    const loginToken = useStorage("loginToken", '');
    const loginError = ref(null);

    const clearLog = () => {
        isLogin.value = false;
        // userLogin.value = {};
        // remove from local storage userLogin
        localStorage.removeItem('userLogin');
        loginToken.value = null;
        loginError.value = null;
    };

    const login = async (credentials: LoginData) => {
        // @ts-ignore
        axios.post(import.meta.env.VITE_API_URL + "/login", credentials)
            .then((response) => {
                isLogin.value = true;
                userLogin.value = response.data.user;
                loginToken.value = response.data.token;
                router.push("/dashboard");

            })
            .catch((e) => {
                loginError.value = e.response.data.message;
            });
    };
    const logout = () => {
        // @ts-ignore
        axios.post(import.meta.env.VITE_API_URL + "/logout", {}, {
            headers: {
                Authorization: `Bearer ${loginToken.value}`,
            }
        })
            .then(() => {
                clearLog();
                router.push("/login");
            })
            .catch((e) => {
                console.log(e);
    }   );
    }

    return {isLogin, userLogin, loginToken, loginError, logout, login};
});
