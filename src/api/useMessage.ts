import {useApi} from "./useApi";


export function useMessage(){

    const  searchUserForChat = ()=> {
        return useApi(
            "/searchUserForChat",
            {
                method: "POST",
            }, {
                immediate: false,
            })
    }
    const  useCreateMessage = ()=> {
        return useApi(
            "/createMessage",
            {
                method: "POST",
            }, {
                immediate: false,
            })
    }
    const useGetChatUsers = ()=> {
        return useApi(
            "/getChatUsers",
            {
                method: "POST",
            }, {
                immediate: false,
            })
    }
    const getConversation = ()=> {
        return useApi(
            "/getConversation",
            {
                method: "POST",
            }, {
                immediate: false,
            })
    }

    const useGetMessages = ()=> {
        return useApi(
            "/getMessages",
            {
                method: "GET",
            }, {
                immediate: true,
            })
    }

    const useGetMessage = ()=> {
        return useApi(
            "/getMessage",
            {
                method: "GET",
            }, {
                immediate: false,
            })
    }

    const useUpdateMessage = ()=> {
        return useApi(
            "/updateMessage",
            {
                method: "PUT",
            }, {
                immediate: false,
            })
    }

    return {
        getConversation,
        searchUserForChat,
        useCreateMessage,
        useGetMessages,
        useGetMessage,
        useUpdateMessage,
        useGetChatUsers
    }
}
