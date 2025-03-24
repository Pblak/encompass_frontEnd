<template>
    <v-card flat>
        <v-card-title class="d-flex align-center pe-2">
            <div class="_flex _gap-2 _items-center">
                <CreateParentDialog/>
                <p>
                    Parent List
                </p>
            </div>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="fa-thin fa-search"
                          variant="solo-filled" flat hide-details single-line>
            </v-text-field>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" size="25" flat icon>
                        <v-icon size="20">fa fa-grip-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item link @click="toggleWithTrash">
                        <template v-slot:prepend>
                            <div class="_pr-2">
                                <v-switch
                                    :model-value="withTrashParent"
                                    color="primary" hide-details></v-switch>
                            </div>
                        </template>
                        <template #title>
                            Show deleted
                        </template>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-title>
        <v-divider class="border-opacity-50"></v-divider>

        <v-data-table :headers="headers" :header-props="{dense: true}" v-model:search="search" :items="ParentList">
            <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                <tr>
                    <template v-for="column in columns" :key="column.key">
                        <td class="_font-black">
                            <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.text }}</span>
                            <template v-if="isSorted(column)">
                                <v-icon :icon="getSortIcon(column)"></v-icon>
                            </template>
                        </td>
                    </template>
                </tr>
            </template>

            <!--   body   -->

            <template v-slot:item.infos.avatar="{value }">
                <v-avatar size="40">
                    <v-img :src="APP_URL+value" alt="avatar"></v-img>
                </v-avatar>
            </template>
            <template v-slot:item.infos="{value }">
                <div class="_flex _flex-col _gap-1 _text-xs" v-if="value">
                    <div class="_whitespace-nowrap">{{ value.phone1 }}</div>
                    <div class="_whitespace-nowrap">{{ value.phone2 }}</div>
                </div>
            </template>
            <template v-slot:item.infos.address="{ item }">
                {{ item.infos.address.street }}, {{ item.infos.address.city }}, {{ item.infos.address.state }},
                {{ item.infos.address.zip }}
            </template>
            <template v-slot:item.created_at="{ value }">
                <p>
                    <v-tooltip activator="parent" location="top">{{
                            moment(value).format('MMMM Do YYYY, h:mm:ss a')
                        }}
                    </v-tooltip>
                    {{ moment(value).format('LLL') }}
                </p>
            </template>
            <template v-slot:item.actions="{ item }">
                <div class="_flex _gap-3 ">
                    <!--                    <v-btn size="small" icon="fa-thin fa-edit _text-sm" elevation="0"></v-btn>-->
<!--                    <UpdateParentDialog  :parent-selected="item"/>-->
                    <v-btn color="primary" size="small" icon="fa-thin fa-arrow-up-right-from-square"
                           :to='{name:"ParentDetails",params:{parent_id:item.id}}' variant="tonal">
                    </v-btn>
<!--                    <v-btn elevation="0" icon="fa-thin fa-trash _text-sm" v-if="item.deleted_at == null"-->
<!--                           @click="openDeleteDialog(item)" color="red" variant="tonal" size="small"></v-btn>-->
                </div>
            </template>
        </v-data-table>

        <v-dialog v-model="toggleDeleteDialog" scrollable width="auto">
            <v-card prepend-icon="fa-duotone fa-guitar">
                <template v-slot:title>
                    Delete Lesson
                </template>
                <template v-slot:text>
                    <v-alert type="error" variant="tonal">
                        Are you sure you want to delete this Parent {{ selectedDeleteParent.name }}} ?
                    </v-alert>
                </template>
                <template v-slot:actions>
                    <v-btn color="success" @click="deleteStudent" variant="tonal">
                        confirm
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>

    </v-card>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {exeGlobalGetParents, useParent} from "@/api/useParent";
import CreateParentDialog from "@/views/dashboard/parent/ParentDialog/CreateParentDialog.vue";
import UpdateParentDialog from "@/views/dashboard/parent/ParentDialog/UpdateParentDialog.vue";
import moment from "moment";
import {parentState, type ParentType} from "@/stats/parentState";
import {exeGlobalGetStudents} from "@/api/useStudent";


const {useDeleteParent} = useParent()
const search = ref("")
const {ParentList, withTrashParent} = parentState();
const toggleDeleteDialog = ref(false)
const selectedDeleteParent = ref<ParentType>()
const APP_URL = import.meta.env.VITE_APP_URL;
const headers = [
    {text: '', key: 'infos.avatar'},
    {text: 'Name', key: 'name'},
    {text: 'Email', key: 'email'},
    {text: 'Phones', key: 'infos'},
    {text: 'Address', key: 'infos.address'},
    {text: 'Created At', key: 'created_at'},
    {text: 'Actions', key: 'actions', sortable: false},
]
const {
    execute: exeDeleteParent,
    onResultSuccess: onResultSuccessDeleteParent
} = useDeleteParent()
const toggleWithTrash = () => {
    withTrashParent.value = !withTrashParent.value;
}
const openDeleteDialog = (parent: ParentType) => {
    toggleDeleteDialog.value = true;
    selectedDeleteParent.value = parent;
}

const deleteStudent = async () => {
    await exeDeleteParent({
        data: {
            id: selectedDeleteParent.value.id
        }
    })
}

onResultSuccessDeleteParent(() => {
    toggleDeleteDialog.value = false;
    selectedDeleteParent.value = {};
    exeGlobalGetParents();
})

onMounted(async () => {
    await exeGlobalGetParents();
})
</script>
