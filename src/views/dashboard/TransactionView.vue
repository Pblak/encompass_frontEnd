<template>
    <v-card class="_flex-1 !_flex _flex-col">
        <template #prepend>
            <CreateTransactionDialog/>
        </template>
        <template #title>
            Transaction List
        </template>
        <template #append>
            <div class="_flex _items-center _gap-2">
                <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="fa-thin fa-search"
                              variant="solo-filled" flat hide-details single-line min-width="300">
                </v-text-field>
            </div>
        </template>

        <!--        <v-card-title class="d-flex align-center pe-2">-->
        <!--            <div class="_flex _gap-2 _items-center">-->
        <!--                <CreateTransactionDialog/>-->
        <!--                <p>-->
        <!--                    Transaction List-->
        <!--                </p>-->
        <!--            </div>-->
        <!--            <v-spacer></v-spacer>-->
        <!--            <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="fa-thin fa-search"-->
        <!--                          variant="solo-filled" flat hide-details single-line>-->
        <!--            </v-text-field>-->
        <!--        </v-card-title>-->

        <v-divider class="border-opacity-75"></v-divider>
        <v-card-text class="_flex-1">
            <v-data-table :headers="headers" item-value="name" v-model:search="search"
                          height="calc(100vh - 12rem)" fixed-header :items="TransactionList">
                <template v-slot:item.amount="{ value }">
                    <v-chip color="success">{{ toCurrency(value) }}</v-chip>
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
                    <div class="_flex _gap-3 " v-if="item">
                    </div>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {exeGlobalGetTransactions} from "@/api/useTransaction";
import CreateTransactionDialog from "@/views/dashboard/transaction/createTransaction/CreateTransactionDialog.vue";
import moment from "moment";
import {transactionState} from "@/stats/transactionState";
import {toCurrency} from "@/stats/Utils";

const {TransactionList} = transactionState();
const headers = [
    {title: 'id', align: 'start', sortable: false, key: 'id',},
    {title: 'Amount', key: 'amount'},
    {title: 'Lesson', key: 'lesson_id'},
    {title: 'Status', key: 'status'},
    {title: 'Created At', key: 'created_at'},
    {title: 'Actions', key: 'actions', sortable: false},
]
onMounted(() => {
    exeGlobalGetTransactions();
})
const search = ref("")
</script>
