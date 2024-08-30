import {createGlobalState} from "@vueuse/core";
import {type Ref, ref} from "vue";
/**
 * @return {PackageType[]}
 */
export interface PackageType {
    id: number,
    name: string,
    price: number,
    duration: number,
    iconClass?: string,
    description: string,
    [key: string]: any,
    created_at?: string,
    updated_at?: string
}

export const  packageState = createGlobalState(() => {
    // const PackageList:RemovableRef<PackageType[]> = useStorage("packageList", [], undefined, {serializer: StorageSerializers.object})
    const PackageList :Ref<PackageType[]> = ref([])
    const selectedPackage: Ref<PackageType | null> = ref(null)
    const packageDialog: Ref<boolean> = ref(false)

    return {
        PackageList,
        selectedPackage,
        packageDialog,
    };

});
