import {Db, ObjectId, InsertOneWriteOpResult, UpdateWriteOpResult, DeleteWriteOpResultObject} from 'mongodb';
import {normalizeQ} from './normalizeQuery';
import {console} from '../../tools/console';
import {parseQuery} from '../../tools/parseQuary';
import {MediaModel, ResponseModel} from '../_models/_models';
import {IDbAdapterMedia} from '../adapter';
import {MediaModelQuery} from '../_models/media.model';

export interface IMongodbMediaModel extends MediaModelQuery {
    _id?: ObjectId;
    $text?: any;
}

export class Media implements IDbAdapterMedia {
    collectionName: string;

    constructor(private db: Db) {
        this.collectionName = 'media';
    }

    async getFilterListByQuery(type: string): Promise<ResponseModel> {
        const collection = {};

        switch (type) {
            case 'movies':
            case 'tvSeries':
                collection['genre'] = await this.db.collection(this.collectionName).distinct('genre', {'type': type});
                collection['country'] = await this.db.collection(this.collectionName).distinct('country', {'type': type});
            case 'games':
                const yearArr = await this.db.collection(this.collectionName).distinct('year', {'type': type});
                collection['year'] = [Math.min(...yearArr), Math.max(...yearArr)];
                break;
        }

        return {
            status: 200,
            body:   collection
        };
    }

    async getMediaListByQuery(query: IMongodbMediaModel): Promise<ResponseModel> {
        const collection: Array<IMongodbMediaModel> = [];
        const pQuery = parseQuery(query);

        if (pQuery.errors.length) {
            return {
                status: 400,
                body:   pQuery.errors
            };
        }

        await this.db.collection(this.collectionName).find(pQuery.normalizedQuery).project({id: 1, type: 1, images: 1, name: 1, genre: 1, year: 1, _id: 0}).sort({year: -1, name: 1}).limit(query.limit ? query.limit : 12).forEach(mediaItem => {
            collection.push(mediaItem);
        });

        return {
            status: 200,
            body:   collection
        };
    }

    async getMediaByQuery(query: IMongodbMediaModel): Promise<ResponseModel> {
        query = normalizeQ(query, this.collectionName);

        if (!query) {
            return {
                status: 400,
                body:   'Bad request'
            };
        }

        if (query._id) {
            if (!ObjectId.isValid(query._id)) {
                return {
                    status: 400,
                    body:   'Argument _id passed in must be a single String of 12 bytes or a string of 24 hex characters'
                };
            }

            query._id = new ObjectId(query._id);
        }

        const media: MediaModel = await this.db.collection(this.collectionName).findOne(query);

        return {
            status: 200,
            body:   media
        };
    }

    async insertMedia(query): Promise<ResponseModel> {
        try {
            const media: InsertOneWriteOpResult = await this.db.collection(this.collectionName).insertOne(query);

            return {
                status: 201,
                body:   media.ops[0]
            };
        } catch (err) {
            console.error(err);
            console.error(query);

            return {
                status: 400,
                body:   err.errmsg
            };
        }
    }

    async updateMedia(query): Promise<ResponseModel> {
        try {
            if (!query.id) {
                return {
                    status: 400,
                    body:   `For update media you need set id`
                };
            }

            const update: UpdateWriteOpResult = await this.db.collection(this.collectionName).updateOne({id: query.id}, {$set: query});

            if (!update.result.nModified) {
                const err = new Error('Something went wrong');
                err.name = 'Mongodb update';

                throw err;
            }

            const media: MediaModel = await this.db.collection(this.collectionName).findOne(query);

            return {
                status: 201,
                body:   media
            };

        } catch (err) {
            console.error(err);

            return {
                status: 400,
                body:   err.errmsg ? err.errmsg : err.message
            };
        }
    }

    async deleteMedia(query): Promise<ResponseModel> {
        try {
            if (!query.id) {
                return {
                    status: 400,
                    body:   `For delete media you need set id`
                };
            }

            const media: DeleteWriteOpResultObject = await this.db.collection(this.collectionName).deleteOne({id: query.id});

            if (!media.deletedCount) {
                return {
                    status: 400,
                    body:   'The specified media does not exist'
                };
            }

            return {
                status: 200,
                body:   1
            };

        } catch (err) {
            console.error(err);

            return {
                status: 400,
                body:   err.errmsg
            };
        }
    }
}
