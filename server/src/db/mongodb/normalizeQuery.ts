import {MediaModelExample} from '../_models/media.model';
import {UserModelExample} from '../_models/user.model';

export function normalizeQ(query: any, modelExample: any) {
    let example;

    switch (modelExample) {
        case 'media':
            example = MediaModelExample;
            break;
        case 'user':
            example = UserModelExample;
            break;
    }

    for (const key in query) {
        if (query.hasOwnProperty(key) && typeof(query[key]) !== typeof example[key]) {
            switch (typeof example[key]) {
                case 'number':
                    if (isNaN(Number(query[key]))) {
                        query = undefined;
                        return;
                    }
                    query[key] = Number(query[key]);
                    break;
                case 'string':
                    if (query[key] === 'true') {
                        query[key] = true;
                    } else {
                        query[key] = (query[key] as number).toString();
                    }
                    break;
                case 'boolean':
                    const value = (query[key] as string).toString();

                    query[key] = value === 'true' ? true : value === 'false' ? false : undefined;
                    if (typeof query[key] !== 'boolean') {
                        query = undefined;
                    }
                    break;
            }
        }
    }

    return query;
}
