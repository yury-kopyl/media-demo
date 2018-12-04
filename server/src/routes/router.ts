import {Router} from 'express';

import {apiRouter} from './api';
import {otherRouter} from './other';

export class BaseRouter {
    public router: Router;

    public static create(db) {
        return new BaseRouter(db);
    }

    constructor(private db) {
        this.router = Router();

        this.router.all('*', (req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
            res.setHeader('Access-Control-Request-Method', 'POST, OPTIONS, UPDATE, DELETE, PUT');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

            if (req.method === 'OPTIONS') {
                return res.sendStatus(200);
            }

            next();
        });
    }

    getApiRoutes() {
        return this.router.get('/api', apiRouter(this.router, this.db));
    }

    getOtherRoutes() {
        return this.router.get('*', otherRouter(this.router));
    }
}
