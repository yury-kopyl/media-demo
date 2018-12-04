import {Server, createServer} from 'http';
import {console} from './tools/console';

export class HttpServer {
    server: Server;

    public static async create(application): Promise<HttpServer> {
        const app = await application;

        if (!app) {
            console.error('server: unable to connect to app');
            return;
        }

        console.success(`server: created on port ${process.env.PORT || process.env.SERVER_PORT}`);

        return new HttpServer(app.app);
    }

    constructor(app) {
        this.server = createServer(app).listen(process.env.PORT || process.env.SERVER_PORT);
    }
}
