<template>
   <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
         <div class="_flex _gap-2 _items-center">
            <v-tooltip text="Create transaction" location="bottom">
               <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" color="primary" icon="fa fa-plus" @click="toggleDialog = true"> </v-btn>
               </template>
            </v-tooltip>
            
            <p>
               Transaction List
            </p>
         </div>
         <v-spacer></v-spacer>
         <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="fa-thin fa-search"
                       variant="solo-filled" flat hide-details single-line>
         </v-text-field>
         <v-dialog v-model="toggleDialog" width="auto">
            <v-card width="600" prepend-icon="fa-duotone fa-user-plus">
               <template v-slot:title>
                  Update in progress
               </template>
               <template v-slot:text>
                  <v-form>
                  
                  </v-form>
               </template>
               <template v-slot:actions>
                  <v-btn class="ms-auto" text="Ok" @click="toggleDialog = false"></v-btn>
               </template>
            </v-card>
         </v-dialog>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table :headers="headers" item-value="name"  v-model:search="search" :items="TransactionList">
         <template v-slot:item.actions="{ item }">
            <div class="_flex _gap-3 ">
               <v-btn size="small" icon="fa-thin fa-edit _text-sm" elevation="0"> </v-btn>
               <v-btn size="small" icon="fa-thin fa-calendar _text-sm" elevation="0"> </v-btn>
            </div>
         </template>
      </v-data-table>
   </v-card>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useTransaction} from "@/api/useTransaction";
import moment from "moment";
import {transactionState} from "@/stats/transactionState";

const {useGetTransactions} = useTransaction();

const{
   execute: exeGetTransactions,
   onResultSuccess: onSuccessGetTransactions,
} = useGetTransactions();

const {TransactionList } = transactionState();
const toggleDialog = ref(false)
const headers = [
   {title: 'id', align: 'start', sortable: false, key: 'id',},
   {title: 'Amount', key: 'amount'},
   {title: 'Created At', key: 'created_at'},
   {title: 'Actions', key: 'actions', sortable: false},
]
exeGetTransactions();
onSuccessGetTransactions((res:any) => {
   TransactionList.value = res.data.map((item: any) => {
      return {
         id: item.id,
         amount: item.email,
         created_at: moment(item.created_at).format("YYYY-MM-DD"),
      }
   });
})
const search = ref("")
</script>
