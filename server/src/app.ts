import * as express from 'express';
import {json} from 'body-parser';
import {join} from 'path';
import {console} from './tools/console';

// Router
import {BaseRouter} from './routes/router';

export class App {
    public app: express.Application;

    public static async bootstrap(Db: any): Promise<App> {
        const db = await Db;

        if (!db.status) {
            console.error('app: unable to connect to db');
            return;
        }

        console.success('app: created');

        return new App(db);
    }

    constructor(private db: any) {
        this.app = express();
        this.config();
        this.routes();
    }

    public config() {
        this.app.use(express.static(join(__dirname, '../public')));
        this.app.use(express.static(join(__dirname, '../../client/dist')));
        // this.app.use('/profiles', express.static(join(__dirname, 'profiles')));
        this.app.use(json());
        this.app.set('port', process.env.SERVER_PORT);
    }

    private routes() {
        const router = BaseRouter.create(this.db);

        this.app.use('/api', router.getApiRoutes());
        this.app.use('*', router.getOtherRoutes());
    }
}
