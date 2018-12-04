export interface UserModel {
    email: string;
    password?: string;
    permission: boolean;
    favorite?: number[];
}
