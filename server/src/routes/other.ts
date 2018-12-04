import {Request, Response, Router} from 'express';
import {join} from 'path';
import {console} from '../tools/console';

export function otherRouter(router: Router) {
    router.get('*', (req: Request, res: Response) => {
        if (req.xhr) {
            res.status(400);
            return res.json({body: 'Bad Request'});
        }

        return res.sendFile(join(__dirname, '../../../client/dist/index.html'));
    });

    console.success('router: "otherRouter" created');

    return router;
}
