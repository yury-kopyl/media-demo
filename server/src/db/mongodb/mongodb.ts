import {MongoClient, Db} from 'mongodb';
import {Media} from './_media';
import {User} from './_user';
import {IDbAdapter} from '../adapter';
import {console} from '../../tools/console';

export class MongoDb implements IDbAdapter {
    media: Media;
    user: User;

    constructor(private db: Db, private status: boolean) {
        this.media = new Media(db);
        this.user = new User(db);
    }

    static async bootstrap(): Promise<MongoDb> {
        try {
            console.success('db: connecting...');
            const mongoClient: MongoClient = await MongoClient.connect(process.env.DB_URL, { useNewUrlParser: true });
            const db: Db = mongoClient.db();

            console.success('db: connected');

            return new MongoDb(db, mongoClient.isConnected());
        } catch (e) {
            console.error(`db: ${e.errmsg}`);

            return new MongoDb(null, false);
        }
    }
}
