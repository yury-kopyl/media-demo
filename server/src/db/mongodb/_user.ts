import {
    Db,
    ObjectId,
    InsertOneWriteOpResult,
    UpdateWriteOpResult,
    DeleteWriteOpResultObject,
    FindAndModifyWriteOpResultObject
} from 'mongodb';
import {normalizeQ} from './normalizeQuery';
import {console} from '../../tools/console';
import {UserModelQuery, ResponseModel} from '../_models/_models';
import {IDbAdapterUser} from '../adapter';

export interface IMongodbUserModel extends UserModelQuery {
    _id?: ObjectId | number;
}

export class User implements IDbAdapterUser {
    collectionName: string;

    constructor(private db: Db) {
        this.collectionName = 'user';
    }

    async getUserListByQuery(query: IMongodbUserModel): Promise<ResponseModel> {
        const collection: Array<IMongodbUserModel> = [];

        if (query._id) {
            if (!ObjectId.isValid(query._id)) {
                return {
                    status: 400,
                    body: 'Argument _id passed in must be a single String of 12 bytes or a string of 24 hex characters'
                };
            }

            query._id = new ObjectId(query._id);
        }

        query = normalizeQ(query, this.collectionName);

        if (!query) {
            return {
                status: 400,
                body: 'Bad request'
            };
        }

        await this.db.collection(this.collectionName).find(query).forEach(mediaItem => {
            collection.push(mediaItem);
        });

        return {
            status: 200,
            body: collection
        };
    }

    async getUserByQuery(query: IMongodbUserModel): Promise<ResponseModel> {
        query = normalizeQ(query, this.collectionName);

        if (!query) {
            return {
                status: 400,
                body: 'Bad Request'
            };
        }

        if (query.id) {
            if (!ObjectId.isValid(query.id)) {
                return {
                    status: 400,
                    body: 'Argument id passed in must be a single String of 12 bytes or a string of 24 hex characters'
                };
            }

            query._id = new ObjectId(query.id);
        }

        const media: IMongodbUserModel = await this.db.collection(this.collectionName).findOne(query);

        if (media) {
            media.id = media._id as number;
            delete media._id;
        }

        return {
            status: 200,
            body: media
        };
    }

    async insertUser(query): Promise<ResponseModel> {
        try {
            query = normalizeQ(query, this.collectionName);

            const media: InsertOneWriteOpResult = await this.db.collection(this.collectionName).insertOne(query);

            return {
                status: 201,
                body: media.ops[0]
            };
        } catch (err) {
            console.error(err);
            console.error(query);

            throw err.errmsg;
        }
    }

    async confirmUser(url): Promise<ResponseModel> {
        try {
            if (!url) {
                return {
                    status: 400,
                    body: `For confirm user you need set the url`
                };
            }

            const update: FindAndModifyWriteOpResultObject = await this.db.collection(this.collectionName).findOneAndUpdate({confirmed: url}, {$set: {confirmed: true}});

            if (!update.value) {
                return {
                    status: 404,
                    body: {
                        errors: {message: 'User not found'}
                    }
                };
            }

            return {
                status: 200,
                body: {
                    data: 'User confirmed'
                }
            };

        } catch (err) {
            console.error(err);

            return {
                status: 400,
                body: err.errmsg ? err.errmsg : err.message
            };
        }
    }

    async updateUser(query): Promise<ResponseModel> {
        try {
            if (!query.email) {
                return {
                    status: 400,
                    body: `For update media you need set username`
                };
            }

            const update: UpdateWriteOpResult = await this.db.collection(this.collectionName).updateOne({email: query.email}, { $set: query });

            if (!update.result.nModified) {
                const err = new Error('Something went wrong');
                err.name = 'Mongodb update';

                throw err;
            }

            const media: UserModelQuery = await this.db.collection(this.collectionName).findOne({email: query.email});

            delete media.password;

            return {
                status: 201,
                body: media
            };

        } catch (err) {
            console.error(err);

            return {
                status: 400,
                body: err.errmsg ? err.errmsg : err.message
            };
        }
    }

    async updateFavorite(query): Promise<ResponseModel> {
        try {
            if (!query.email) {
                return {
                    status: 400,
                    body: `For update favorite you need set username`
                };
            }

            if (!query.id) {
                return {
                    status: 400,
                    body: `For update favorite you need set media id`
                };
            }

            const removeFavorite: FindAndModifyWriteOpResultObject = await this.db.collection(this.collectionName).findOneAndUpdate({email: query.email, favorite: query.id}, {$pull: { favorite: query.id }});

            if (!removeFavorite.value) {
                await this.db.collection(this.collectionName).findOneAndUpdate({email: query.email}, {$addToSet: { favorite: query.id }});
            }

            return {
                status: 201,
                body: {
                    action: removeFavorite.value ? 'remove' : 'add'
                }
            };

        } catch (err) {
            console.error(err);

            return {
                status: 400,
                body: err.errmsg ? err.errmsg : err.message
            };
        }
    }

    async deleteUser(query): Promise<ResponseModel> {
        try {
            if (!query.username) {
                return {
                    status: 400,
                    body: `For delete media you need set username`
                };
            }

            const media: DeleteWriteOpResultObject = await this.db.collection(this.collectionName).deleteOne({username: query.username});

            if (!media.deletedCount) {
                return {
                    status: 400,
                    body: 'The specified media does not exist'
                };
            }

            return {
                status: 200,
                body: 1
            };

        } catch (err) {
            console.error(err);

            return {
                status: 400,
                body: err.errmsg
            };
        }
    }
}
