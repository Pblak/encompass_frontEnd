import type {UserModel} from "@/composable/models/userModel";

export interface TeacherModel extends UserModel {
    infos: {
        phone1: string;
        phone2?: string;
        address: {
            zip: string;
            city: string;
            state: string;
            street: string;
        };
        [key: string]: any;
    };
}
