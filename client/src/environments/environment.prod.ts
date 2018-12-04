import * as pack from '../../../package.json';

export const environment = {
    production: true,
    project_name: (<any>pack).config.project_name,
    api: {
        medias: {
            root: '/api/medias',
            search: '/api/medias/search',
            favorite: '/api/medias/favorite',
            filter: '/api/filter'
        },
        users: {
            root: '/api/users',
            login: '/api/users/login',
            logout: '/api/users/logout',
            registration: '/api/users/registration',
            recovery: '/api/users/recovery',
            changePswd: '/api/users/change_password'
        }
    },
    domain: '.'
};
