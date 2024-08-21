export interface UserModel {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    accountType :  'web'| 'teacher'| 'student' | 'parent';
    [key: string]: any;
}
