import {Seed as mongoSeed} from '../mongodb/seed';
import {readFile, readdir} from 'fs';
import {console} from '../../tools/console';

export interface ISeedCore {
    collections: Array<object>;
    queue: Array<() => Promise<void | {}>>;

    seed(): void;
}

interface ISeed extends ISeedCore {
    getData(): this;

    then(): void;
}

class Seed extends mongoSeed implements ISeed {
    constructor() {
        super();
    }

    public getData() {
        const promise = async () => {
            return new Promise(resolve => {
                readdir('./server/db_seed', 'utf-8', (err, files) => {
                    if (err) {
                        throw err;
                    }

                    let readFileCount = 0;

                    (files as (string)[]).filter(fileName => {
                        return fileName.slice(-5) === '.json';
                    }).forEach((fileName, index, array) => {
                        readFile(`./server/db_seed/${fileName}`, 'utf-8', (errFile, file) => {
                            if (errFile) {
                                throw errFile;
                            }

                            console.success(`seed: data ${fileName} imported.`);

                            const data = JSON.parse(file);

                            data.forEach(item => {
                                for (const key in item) {
                                    if (item.hasOwnProperty(key) && item[key] === 'new Date()') {
                                        item[key] = new Date();
                                    }
                                }
                            });

                            this.collections.push({
                                name: fileName.slice(0, -5),
                                data: data
                            });

                            readFileCount++;

                            if (array.length === readFileCount) {
                                resolve();
                            }
                        });
                    });
                });
            });
        };

        this.queue.push(promise);

        return this;
    }

    public then() {
        if (this.queue.length > 1) {
            (this.queue as Array<any>).reduce((prev, cur) => {
                return prev
                    .then(() => {
                        return cur();
                    })
                    .catch(error => {
                        if (error.errorObject) {
                            console.error(error.errorObject);
                        } else {
                            console.error(`seed: ${error}`);
                        }
                    });
            }, Promise.resolve(null));
        } else {
            this.queue[0]().then();
        }
    }
}

new Seed().getData().seed().then();
