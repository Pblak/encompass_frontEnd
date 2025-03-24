<template>
    <v-layout ref="app" class="_m-[-1rem]">
        <v-app-bar
            app
            color="grey-lighten-3"
            height="64"
            name="app-bar">
            <template v-slot:prepend></template>
            <v-app-bar-title v-if="chattingWith">
                {{ chattingWith?.name }}
            </v-app-bar-title>
        </v-app-bar>
        <v-navigation-drawer
            color="grey-lighten-4"
            location="end"
            name="drawer"
            permanent>
            <div class="d-flex _flex-col  h-100">
                <div>
                    <v-text-field
                        v-model="searchKey"
                        label="Search"
                        dense
                        clearable
                        hide-details
                        placeholder="Search"
                        prepend-inner-icon="fa-thin fa-search"
                    ></v-text-field>
                </div>
                <div class="_flex-1 overflow-auto">
                    <div>
                        <v-list v-if="searchResult.length > 0">
                            <v-list-item
                                v-for="(user ,i) in searchResult"
                                :key="i"
                                @click="selectUser(user)">
                                <template v-slot:prepend>
                                    <v-avatar color="green">
                                        <v-img v-if="user.avatar"
                                               :src="APP_URL+user.avatar"/>
                                        <span v-else class="_test-xl">
                                            {{ (user.name[0] + user.name[1]).toUpperCase() }}
                                        </span>
                                    </v-avatar>

                                </template>
                                <v-list-item-title>{{ user.name }}</v-list-item-title>
                                <v-list-item-subtitle>{{ user!.email }}</v-list-item-subtitle>
                                <v-list-item-subtitle><b>{{ user.type }}</b></v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                        <v-list v-else>
                            <v-list-item
                                v-for="user in usersChatList"
                                :key="user.id"
                                @click="selectUser(user)">
                                <template v-slot:prepend>
                                    <v-badge :color="user?.is_read ? 'transparent' : 'red'"
                                             overlap
                                             left
                                             dot
                                    >
                                        <v-avatar color="primary">
                                            <v-img v-if="user.avatar"
                                                   :src="APP_URL+user.avatar"/>
                                            <span v-else class="_test-xl">{{
                                                    (user.name[0] + user.name[1]).toUpperCase()
                                                }}</span>
                                        </v-avatar>
                                    </v-badge>
                                </template>
                                <v-list-item-title>{{ user.name }}</v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ whoSentMessage(user!.last_message) }}
                                </v-list-item-subtitle>
                                <v-list-item-subtitle>{{ user.type }}</v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </div>
                </div>
            </div>
        </v-navigation-drawer>

        <v-main class=" " scrollable id="messageContainer">
            <div class="">
                <div class="  ">

                </div>
                <div class="_p-3">
                    <div v-for="(TimeBlockMessages , key) in renderConvMessages" :key="key">
                        <div v-for="(userBlockMessages , i) in TimeBlockMessages" :key="i" class="py-4">
                            <div class="_flex justify-end  _items-center "
                                 v-if="getTable(userLogin!.accountType)+'_'+userLogin!.id === i">
                                <div class="_px-2">
                                    <template v-for="(message , j) in userBlockMessages" :key="j">
                                        <template v-if="lastMessageRead === message.id">
                                            <v-avatar class="_opacity-80" :image="APP_URL+chattingWith?.avatar"
                                                      size="20"  v-if="chattingWith?.avatar">
                                            </v-avatar>
                                            <v-avatar v-else class="_opacity-80 _text-xs" size="20" color="secondary">
                                                <span>
                                                    {{ (chattingWith?.name[0] + chattingWith?.name[1]).toUpperCase() }}
                                                </span>
                                            </v-avatar>
                                        </template>

                                    </template>
                                </div>
                                <div class="_flex _flex-col _gap-0.5 _items-end justify-center">

                                    <template v-for="(message , j) in userBlockMessages" :key="j">
                                        <div class="_bg-blue-500 _text-white
                                                  _rounded-[5px]
                                                  first:!_rounded-t-[20px]
                                                  last:!_rounded-b-[20px]
                                                  _rounded-l-[20px]
                                                  _p-2 _px-4 _w-max">
                                            {{ message.content }}

                                        </div>
                                    </template>
                                </div>

                                <div>
                                    <!--  // get messages block time   -->

                                </div>
                            </div>
                            <div class="_flex" v-else>
                                <div class="_flex _flex-col _gap-0.5">
                                    <div v-for="(message , x) in userBlockMessages" :key="x"
                                         class="_bg-gray-300
                              _rou nded-[5px]
                              first:!_rounded-t-[20px]
                              last:!_rounded-b-[20px]
                              _rounded-r-[20px]
                              _p-2 _px-4 _w-max">
                                        {{ message!.content }}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </v-main>

        <v-footer
            class="!_border-t !_border-gray-300 !_bg-gray-200 "
            name="footer" app>
            <v-form class="_flex _gap-4 _pb-3 _w-full" @submit.prevent="sendMessage" v-if="chattingWith">
                <v-text-field
                    label="One row"
                    row-height="15"
                    rows="1"
                    class="!_bg-transparent"
                    flat
                    variant="plain"
                    auto-grow
                    hide-details
                    v-model="message"
                ></v-text-field>
                <v-btn :color="message ? 'primary' : 'grey'"
                       :type="message ? 'submit' : 'button'"
                       flat
                       :icon="true">
                    <v-icon>fa-thin fa-paper-plane</v-icon>
                </v-btn>
            </v-form>
        </v-footer>
    </v-layout>

</template>
<script setup lang="ts">
import {useMessage} from "@/api/useMessage";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {watchDebounced} from "@/stats/Utils"
import {loginState} from '@/stats/loginState'

const APP_URL = import.meta.env.VITE_APP_URL;
const {userLogin} = loginState();
const {useCreateMessage, searchUserForChat, getConversation, useGetChatUsers} = useMessage();
const {execute: exeCreateMessage} = useCreateMessage();
const {
    execute: exeGetChatUsers, onResultSuccess: onGetChatUsersSuccess
} = useGetChatUsers();
const {execute: exeSearchUserForChat, onResultSuccess: onSearchUserForChatSuccess} = searchUserForChat();
const {
    execute: exeGetConversation,
    onResultSuccess: onGetConversationSuccess
} = getConversation();
const message = ref('');
const searchKey = ref<string>('');
const searchResult = ref([]);
const chattingWith = ref(null);
const currentConversation = ref(null);
const usersChatList = ref([]);
const longPullingLoop = ref<any>(null);

const selectUser = (user) => {
    chattingWith.value = user;
    searchKey.value = '';
    searchResult.value = [];
    exeGetConversation({
        data: {
            selected_user_id: user.id,
            selected_user_type: user.type
        }
    });

}
const whoSentMessage = (message) => {
    if (message.from_id == userLogin.value!.id && message.from_id_table == userLogin.value!.accountType) {
        return 'You: ' + message.content.substring(0, 20)
    }
    return message.content.substring(0, 20)
}

const getTable = (type) => {

    switch (type) {
        case 'users':
            return 'users';
        case 'web':
            return 'users';
        case 'teachers':
            return 'teachers';
        case 'parents':
            return 'parents';
        default:
            return 'students';
    }
}

const search = () => {
    exeSearchUserForChat({
        data: {
            search: searchKey.value, // Use the new value
        },
    });
}

const sendMessage = () => {
    exeCreateMessage({
        data: {
            message: message.value,
            to_id: chattingWith.value.id,
            to_id_table: chattingWith.value.type,
            type: 'text'
        }
    });
    currentConversation.value.push(
        {
            "id": currentConversation.value[currentConversation.value.length - 1].id + 1,
            "from_id": userLogin.value!.id,
            "to_id": chattingWith.value.id,
            "content": message.value,
            "type": "text",
            "from_id_table": userLogin.value!.accountType,
            "to_id_table": chattingWith.value.type,
            "created_at": new Date().toISOString(),
            "updated_at": new Date().toISOString()
        })
    message.value = '';
    scrollToBottom()
}

const scrollToBottom = () => {
    let el = document.querySelector('#messageContainer > div');
    setTimeout(() => {
        el!.scrollTop = el!.scrollHeight
    }, 100)
};

const renderConvMessages = computed(() => {
    if (!currentConversation.value) {
        return [];
    }
    // Get the messages from the response
    let messages = currentConversation.value;

    // Sort messages by created_at timestamp (ascending order)
    messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Group messages by sender (from_id_table + from_id) and a 30-second interval
    let groupedMessages = messages.reduce((acc, message) => {
        let groupKey = `${message.from_id_table}_${message.from_id}`;
        let intervalKey = Math.floor(new Date(message.created_at).getTime() / 30000); // 30s interval

        let fullKey = `${groupKey}_${intervalKey}`;

        if (!acc[fullKey]) {
            acc[fullKey] = [];
        }

        acc[fullKey].push(message);
        return acc;
    }, {});

    // Convert grouped messages to an array format (keeping only table + ID as key)
    return Object.values(groupedMessages).map((group) => {
        let firstMessage = group[0];
        let key = `${firstMessage.from_id_table}_${firstMessage.from_id}`;
        return {[key]: group};
    });
});

const lastMessageRead = computed(() => {
    if (!currentConversation.value) return null
    // console.log(currentConversation.value)
    let arr = currentConversation.value
    arr = arr.filter((msg) => {
        if (msg.from_id_table + '_' + msg.from_id === userLogin.value!.accountType + '_' + userLogin.value!.id) {
            return true;
        }
    }).filter(item => item.read_at !== null)  // Remove null values
        .sort((a, b) => new Date(b.read_at) - new Date(a.read_at))[0]; // Sort in descending order and take the first element
    console.log(arr)
    if (arr){
        return arr.id;
    }else {
        return null
    }
})


watchDebounced(searchKey, search, 500);

onMounted(() => {
    exeGetChatUsers();
})

onSearchUserForChatSuccess((res) => {
    searchResult.value = res.data;
    // scrollToBottom();
})
onGetChatUsersSuccess((res) => {
    usersChatList.value = res.data;
    setTimeout(exeGetChatUsers, 2000);
})
onGetConversationSuccess((res) => {
    // Assign to the conversation state
    let lastMessageID = res.data[res.data.length - 1].id;

    let oldLastMessageId = currentConversation.value
        ? currentConversation.value[currentConversation.value.length - 1].id : 0;

    currentConversation.value = res.data;
    // currentConversation.value = res.data;
    longPullingLoop.value = setTimeout(() => {
        exeGetConversation({
            data: {
                selected_user_id: chattingWith.value.id,
                selected_user_type: chattingWith.value.type
            }
        });
    }, 2000);

    if (lastMessageID !== oldLastMessageId) {
        scrollToBottom();
    }

})

// on exit
onUnmounted(() => {
    clearTimeout(longPullingLoop.value);
})
</script>
