import {createGlobalState} from "@vueuse/core";
import {type Ref, ref} from "vue";

export interface PlanType {
    id: number
    name: string
    duration: string,
    price: string,
}

/**
 * @return {InstrumentType[]}
 */
export interface InstrumentType {
    id: number,
    name: string,
    image?: File | null,
    description: string,
    [key: string]: any
    created_at?: string,
    updated_at?: string
    plans: PlanType[]
}

export const  instrumentState = createGlobalState(() => {
    // const InstrumentList:RemovableRef<InstrumentType[]> = useStorage("instrumentList", [], undefined, {serializer: StorageSerializers.object})
    const InstrumentList :Ref<InstrumentType[]> = ref([])
    const selectedInstrument: Ref<InstrumentType | null> = ref(null)
    const instrumentDialog: Ref<boolean> = ref(false)

    return {
        InstrumentList,
        selectedInstrument,
        instrumentDialog,
    };

});
