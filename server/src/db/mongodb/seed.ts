import {Db, MongoClient} from 'mongodb';
import {ISeedCore} from '../_seed/_seed';
import * as schemas from './schemas/_schemas';
import {console} from '../../tools/console';
import {asyncForEach} from '../../tools/asynForEach';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({path: path.join(__dirname, '../../../.env')});

export class Seed implements ISeedCore {
    protected db: Db;
    protected dbClient: MongoClient;
    collections: Array<object>;
    queue: Array<() => Promise<void | {}>>;

    constructor() {
        this.collections = [];
        this.queue = [];
    }

    private connectDb() {
        const promise = async () => {
            try {
                console.success('seed: db connecting...');

                this.dbClient = await MongoClient.connect(process.env.DB_URL, { useNewUrlParser: true });
                this.db = this.dbClient.db();

                console.success('seed: db connected.');
            } catch (error) {
                throw error.stack;
            }
        };

        this.queue.push(promise);

        return this;
    }

    private closeDb() {
        const promise = async () => {
            try {
                await this.dbClient.close();

                console.success('seed: db connection closed.');
            } catch (error) {
                throw error.stack;
            }
        };

        this.queue.push(promise);

        return this;
    }

    private createSchemas() {
        const promise = async () => {
            try {
                await asyncForEach(this.collections, async collection => {
                    try {
                        if (!schemas[collection.name]) {
                            throw `schema "${collection.name}" not found.` as string;
                        }

                        await this.db.createCollection(collection.name, schemas[collection.name]);

                        console.success(`seed: schema "${collection.name}" created.`);
                    } catch (error) {
                        console.warn(`seed: schema "${collection.name}" not created.`);

                        throw error;
                    }
                });
            } catch (error) {
                throw error;
            }
        };

        this.queue.push(promise);

        return this;
    }

    private createSearchIndex() {
        const promise = async () => {
            try {
                await this.db.collection('media').createIndex({name: 'text', originalName: 'text'});
                console.success(`seed: indexes created.`);
            } catch (error) {
                throw error;
            }
        };

        this.queue.push(promise);

        return this;
    }

    public seed() {
        this.connectDb().clearDb().createSchemas().importDb().createSearchIndex().closeDb();

        return this;
    }

    private clearDb() {
        const promise = async () => {
            try {
                await this.db.dropDatabase();

                console.success('seed: db cleared.');
            } catch (error) {
                throw error;
            }
        };

        this.queue.push(promise);

        return this;
    }

    private importDb() {
        const promise = async () => {
            try {
                await asyncForEach(this.collections, async collection => {
                    try {
                        await this.db.collection(collection.name).stats();
                        await this.db.collection(collection.name).insertMany(collection.data);

                        console.success(`seed: collection "${collection.name}" imported.`);
                    } catch (e) {
                        if (e.errmsg === `Collection [${this.db.databaseName}.${collection.name}] not found.`) {
                            console.warn(`seed: collection "${collection.name}" not imported.`);

                            throw e.errmsg;
                        }

                        if (e.code === 121) {
                            console.warn(`seed: collection "${collection.name}" not imported.`);
                            console.error(`seed: ${e.errmsg}`);

                            throw {errorObject: e.err.op};
                        }

                        throw e;
                    }
                });
            } catch (e) {
                throw e;
            }
        };

        this.queue.push(promise);

        return this;
    }
}
