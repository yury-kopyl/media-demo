import {MongoDb} from './mongodb/mongodb';
import {ResponseModel} from './_models/_models';

export interface IDbAdapterMedia {
    getMediaListByQuery(query): Promise<ResponseModel>;
    getMediaByQuery(query): Promise<ResponseModel>;
    insertMedia(query): Promise<ResponseModel>;
    updateMedia(query): Promise<ResponseModel>;
    deleteMedia(query): Promise<ResponseModel>;
}

export interface IDbAdapterUser {
    getUserListByQuery(query): Promise<ResponseModel>;
    getUserByQuery(query): Promise<ResponseModel>;
    insertUser(query): Promise<ResponseModel>;
    updateUser(query): Promise<ResponseModel>;
    deleteUser(query): Promise<ResponseModel>;
}

export interface IDbAdapter {
    media: IDbAdapterMedia;
    user: IDbAdapterUser;
}

export class Adapter extends MongoDb implements IDbAdapter {}
