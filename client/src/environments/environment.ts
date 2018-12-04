// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as pack from '../../../package.json';

export const environment = {
    production: false,
    project_name: (<any>pack).config.project_name,
    api: {
        medias: {
            root: 'http://localhost/api/medias',
            search: 'http://localhost/api/medias/search',
            favorite: 'http://localhost/api/medias/favorite',
            filter: 'http://localhost/api/filter'
        },
        users: {
            root: 'http://localhost/api/users',
            login: 'http://localhost/api/users/login',
            logout: 'http://localhost/api/users/logout',
            registration: 'http://localhost/api/users/registration',
            recovery: 'http://localhost/api/users/recovery',
            changePswd: 'http://localhost/api/users/change_password'
        }
    },
    domain: 'http://localhost'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
