export interface UserModel {
    id: number;
    email: string;
    password: string;
    permission: 0 | 1 | 2;
    created: Date;
    confirmed: true | string;
}

export interface UserModelQuery {
    id?: number;
    email?: string;
    password?: string;
    permission?: 0 | 1 | 2;
    created?: Date;
    confirmed?: true | string;
}

export const UserModelExample: UserModel = {
    id: 1,
    email: '',
    password: '',
    permission: 1,
    created: new Date(),
    confirmed: 'true'
};
