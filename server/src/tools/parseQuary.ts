import {ObjectId} from 'mongodb';

export function parseQuery(query) {
    const parsedQuery = {};
    const normalizedQuery = {};
    const errors = [];

    for (const key in query) {
        if (query.hasOwnProperty(key)) {
            try {
                parsedQuery[key] = JSON.parse(query[key]);
            } catch (e) {
                parsedQuery[key] = query[key];
            }
        }
    }

    for (const key in parsedQuery) {
        if (parsedQuery.hasOwnProperty(key)) {
            switch (key) {
                case 'type':
                    normalizedQuery[key] = parsedQuery[key];

                    break;
                case '$text':
                    normalizedQuery[key] = parsedQuery[key];

                    break;
                case 'quality':
                    if (parsedQuery[key].included.length !== 2) {
                        errors.push(`${key}: должен быть массивом с двумя значениями [1, 3]`);
                    }

                    normalizedQuery[key] = {
                        $in: []
                    };

                    for (let i = +parsedQuery[key].included[0]; i <= +parsedQuery[key].included[1]; i++) {
                        normalizedQuery[key]['$in'].push(i);
                    }

                    break;
                case 'year':
                case 'rating':
                    if (parsedQuery[key].included.length !== 2) {
                        errors.push(`${key}: должен быть массивом с двумя значениями [1896, 2008]`);
                    }

                    normalizedQuery[key] = {
                        $gte: parsedQuery[key].included[0],
                        $lte: parsedQuery[key].included[1]
                    };

                    break;
                case 'genre':
                case 'country':
                    if (parsedQuery[key].included.length) {
                        normalizedQuery[key] = {};
                        normalizedQuery[key]['$in'] = (parsedQuery[key].included as Array<string>).map(genre => genre);
                    }

                    if (parsedQuery[key].excluded.length) {
                        if (!normalizedQuery[key]) {
                            normalizedQuery[key] = {};
                        }
                        normalizedQuery[key]['$nin'] = (parsedQuery[key].excluded as Array<string>).map(genre => genre);
                    }

                    break;
                case 'id':
                    if (Array.isArray(parsedQuery[key])) {
                        normalizedQuery[key] = {
                            $in: (parsedQuery[key] as Array<string>).map(id => id)
                        } as any;
                    } else {
                        normalizedQuery[key] = +parsedQuery[key];
                    }

                    break;
                case '_id':
                    if (!ObjectId.isValid(parsedQuery[key])) {
                        errors.push('Argument _id passed in must be a single String of 12 bytes or a string of 24 hex characters');
                    }

                    normalizedQuery[key] = new ObjectId(parsedQuery[key]);

                    break;
            }
        }
    }

    return {normalizedQuery, errors};
}
