import {useApi} from "./useApi";

export function  useUser() {

    const  useCreateUser = ()=> {
        const q = useApi(
            "/createUser",
            {
                method: "POST",
            },{
                immediate:false,
            });
        return q
    }

    const  useGetUsers = ()=> {
        const q = useApi(
            "/getUsers",
            {
                method: "GET",
            },{
                immediate:false,
            });
        return q
    }

    const  useGetUser = ()=> {
        const q = useApi(
            "/getUser",
            {
                method: "GET",
            },{
                immediate:false,
            });
        return q
    }

    const useUpdateUser = ()=> {
        const q = useApi(
            "/updateUser",
            {
                method: "PUT",
            },{
                immediate:false,
            });
        return q
    }

    return {
        useCreateUser,
        useGetUsers,
        useGetUser,
        useUpdateUser,
    }
}
