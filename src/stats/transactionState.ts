import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";

interface Transaction {
    id: number,
    amount: number,
    [key: string]: any
}

export const  transactionState = createGlobalState(() => {
    const TransactionList = useStorage("TransactionList", [], undefined, {serializer: StorageSerializers.object})

    return {
        TransactionList,
    };
});
