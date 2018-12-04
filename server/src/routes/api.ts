import {Request, Response, Router} from 'express';
import {Db} from '../db';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import {console} from '../tools/console';

const setRes: IResponse = function (res, status: any, body) {
    const response: any = {
        ...status && typeof status === 'number' && {status: status},
        ...status.status && {status: status.status},
        ...status.statusText && {statusText: status.statusText},
        ...body.data && {data: body.data},
        ...body.errors && {errors: body.errors}
    };

    if (typeof status === 'number') {
        switch (status) {
            case 200:
                response.statusText = 'OK';
                break;
            case 201:
                response.statusText = 'Created';
                break;
            case 400:
                response.statusText = 'Bad Request';
                break;
            case 401:
                response.statusText = 'Unauthorized';
                break;
            case 404:
                response.statusText = 'Not Found';
                break;
        }
    }

    return res.status(response.status).json(response);
};

const buildErrors = function (body: {value: string, message: string}[]): object | object[] {
    const errors = [];

    body.forEach(item => {
        if (!item.value) {
            errors.push({message: item.message});
        }
    });

    return errors.length === 1 ? errors[0] : errors;
};

export function apiRouter(router: Router, db: Db) {
    // Media routes
    router.get('/filter', (req: Request, res: Response) => {
        db.media.getFilterListByQuery(req.query.type).then(filterList => {
            res.status(filterList.status);
            return res.json(filterList.body);
        });
    });

    router.get('/medias', (req: Request, res: Response) => {
        const action = Object.keys(req.query).length ? 'getMediaByQuery' : 'getMediaListByQuery';

        db.media[action](req.query).then(mediaList => {
            res.status(mediaList.status);

            // TODO emit long time request
            setTimeout(() => {
                return res.json(mediaList.body);
            }, 0);
        });
    });

    router.get('/medias/:search', (req: Request, res: Response) => {
        if (req.query.type === 'search') {
            const query = {
                $text: {$search: req.query.byText}
            };

            db.media.getMediaListByQuery(query).then(mediaList => {
                res.status(mediaList.status);
                return res.json(mediaList.body);
            });
        } else {
            db.media.getMediaListByQuery(req.query).then(mediaList => {
                res.status(mediaList.status);
                return res.json(mediaList.body);
            });
        }
    });

    router.post('/medias', (req: Request, res: Response) => {
        db.media.insertMedia(req.body).then(media => {
            res.status(media.status);
            return res.json(media.body);
        });
    });

    router.put('/medias', (req: Request, res: Response) => {
        console.log(req);

        db.media.updateMedia(req.body).then(media => {
            res.status(media.status);
            return res.json(media.body);
        });
    });

    router.post('/medias/:favorite', (req: Request, res: Response) => {
        db.user.updateFavorite(req.body).then(media => {
            res.status(media.status);
            return res.json(media.body);
        });
    });

    router.delete('/medias', (req: Request, res: Response) => {
        db.media.deleteMedia(req.body).then(media => {
            res.status(media.status);
            return res.json(media.body);
        });
    });


    // User routes

    router.get('/users', (req: Request, res: Response) => {
        const action = Object.keys(req.query).length ? 'getUserByQuery' : 'getUserListByQuery';

        db.user[action](req.query).then(userList => {
            res.status(userList.status);
            return res.json(userList.body);
        });
    });

    router.post('/users', (req: Request, res: Response) => {
        db.user.insertUser(req.body).then(user => {
            res.status(user.status);
            return res.json(user.body);
        });
    });

    router.post('/users/registration', (req: Request, res: Response) => {
        if (!req.body.email || !req.body.password) {
            const fields = [{
                value: req.body.email,
                message: 'Need enter an email'
            }, {
                value:   req.body.password,
                message: 'Need enter a password'
            }];

            const errors = buildErrors(fields) as any;

            return setRes(res, 400, {errors: errors});
        }

        db.user.getUserByQuery({email: req.body.email}).then(result => {
            if (result.body) {
                return setRes(res, 400, {errors: {message: 'User with this email already exists'}});
            }

            const user = req.body;
            user.password = bcrypt.hashSync(user.password, 10);
            user.permission = 0;
            user.created = new Date();
            user.confirmed = bcrypt.hashSync(user.create + user.email, 10);

            db.user.insertUser(user).then(resultInsert => {
                let emailMessage;
                let emailSmtpConfig;

                const generateEmailMessage = (emailAccount?) => {
                    emailMessage = {
                        from: process.env.PROJECT_NAME + ' <' + (process.env.SMTP_USER !== '' ? process.env.SMTP_USER : emailAccount.user) + '>',
                        to: user.email,
                        subject: process.env.PROJECT_NAME + ' :: confirm registration',
                        text: 'For confirm registration email go to http://localhost/api/users/confirm?url=' + user.confirmed,
                        html: 'For confirm registration email go to http://localhost/api/users/confirm?url=' + user.confirmed
                    };
                };

                const generateEmailSmtpConfig = (emailAccount?) => {
                    if (emailAccount) {
                        emailSmtpConfig = {
                            host: 'smtp.ethereal.email',
                            port: 587,
                            secure: false, // true for 465, false for other ports
                            auth: {
                                user: emailAccount.user,
                                pass: emailAccount.pass
                            }
                        };
                    } else {
                        emailSmtpConfig = {
                            host:   process.env.SMTP_HOST,
                            port:   process.env.SMTP_PORT,
                            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                            auth:   {
                                user: process.env.SMTP_USER,
                                pass: process.env.SMTP_PSWD
                            }
                        };
                    }
                };

                const sendEmail = (emailAccount?) => {
                    generateEmailMessage(emailAccount);
                    generateEmailSmtpConfig(emailAccount);

                    const transporter = nodemailer.createTransport(emailSmtpConfig as nodemailer.TransportOptions);

                    transporter.sendMail(emailMessage, (error, info) => {
                        if (error) {
                            return console.error(error);
                        }

                        const message = `Для завершения регистрации вам на почту было отправлено письмо.
                            ${emailAccount ? `<br>(developer mode: <a target="_blank" href="${nodemailer.getTestMessageUrl(info)}">link</a>)` : ''}`;

                        return setRes(res, resultInsert.status, {data: {message}});
                    });
                };

                if (process.env.SMTP_USER && process.env.SMTP_USER !== '') {
                    sendEmail();
                } else {
                    nodemailer.createTestAccount((err, account) => {
                        sendEmail(account);
                    });
                }
            }).catch(error => {
                return setRes(res, 400, {errors: {message: error}});
            });
        });
    });

    router.get('/users/confirm', (req: Request, res: Response) => {
        if (!req.query.url) {
            return setRes(res, 400, {errors: {message: 'Need provide an url'}});
        }

        db.user.confirmUser(req.query.url).then(result => {
            return setRes(res, result.status, result.body);
        });
    });

    router.post('/users/login', (req: Request, res: Response) => {
        if (!req.body.email || !req.body.password) {
            const fields = [{
                value: req.body.email,
                message: 'Need provide an email'
            }, {
                value:   req.body.password,
                message: 'Need provide a password'
            }];

            const errors = buildErrors(fields) as any;

            return setRes(res, 400, {errors: errors});
        }

        db.user.getUserByQuery({email: req.body.email}).then(result => {
            if (!result.body) {
                return setRes(res, 404, {errors: {message: 'User not found'}});
            }

            if (result.body.confirmed !== true) {
                const message = 'User didn\'t confirm email' + (process.env.SMTP_USER === '' ? `<br>(developer mode: <a target="_blank" href="http://localhost/api/users/confirm?url=${result.body.confirmed}">link</a>)` : 'Check your email');

                return setRes(res, 400, {errors: {message}});
            }

            if (!bcrypt.compareSync(req.body.password, result.body.password)) {
                return setRes(res, 401, {errors: {message: 'Incorrect password'}});
            }

            const {email, permission, favorite} = result.body;
            const payload = {email, permission, favorite};

            return setRes(res, result.status, {data: payload});
        });
    });

    router.post('/users/recovery', (req: Request, res: Response) => {
        if (!req.body.email) {
            return setRes(res, 400, {errors: {message: 'Need provide an email'}});
        }

        db.user.getUserByQuery({email: req.body.email}).then(result => {
            if (!result.body) {
                return setRes(res, 404, {errors: {message: 'User not found'}});
            }

            const newPassword = Math.random().toString(36).slice(-8);

            db.user.updateUser({email: req.body.email, password: bcrypt.hashSync(newPassword, 10)}).then(resultUpdated => {
                const user = result.body;
                let emailMessage;
                let emailSmtpConfig;

                const generateEmailMessage = (emailAccount?) => {
                    emailMessage = {
                        from: process.env.PROJECT_NAME + ' <' + (process.env.SMTP_USER && process.env.SMTP_USER !== '' ? process.env.SMTP_USER : emailAccount.user) + '>',
                        to: user.email,
                        subject: process.env.PROJECT_NAME + ' :: recovery password',
                        text: `Your new password is ${newPassword}`,
                        html: `Your new password is ${newPassword}`
                    };
                };

                const generateEmailSmtpConfig = (emailAccount?) => {
                    if (emailAccount) {
                        emailSmtpConfig = {
                            host: 'smtp.ethereal.email',
                            port: 587,
                            secure: false, // true for 465, false for other ports
                            auth: {
                                user: emailAccount.user,
                                pass: emailAccount.pass
                            }
                        };
                    } else {
                        emailSmtpConfig = {
                            host:   process.env.SMTP_HOST,
                            port:   process.env.SMTP_PORT,
                            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                            auth:   {
                                user: process.env.SMTP_USER,
                                pass: process.env.SMTP_PSWD
                            }
                        };
                    }
                };

                const sendEmail = (emailAccount?) => {
                    generateEmailMessage(emailAccount);
                    generateEmailSmtpConfig(emailAccount);

                    const transporter = nodemailer.createTransport(emailSmtpConfig as nodemailer.TransportOptions);

                    transporter.sendMail(emailMessage, (error, info) => {
                        if (error) {
                            return console.error(error);
                        }

                        const message = `На почту был отправлен новый пароль.
                            ${emailAccount ? `<br>(developer mode: <a target="_blank" href="${nodemailer.getTestMessageUrl(info)}">link</a>)` : ''}`;

                        return setRes(res, result.status, {data: {message}});
                    });
                };

                if (process.env.SMTP_USER && process.env.SMTP_USER !== '') {
                    sendEmail();
                } else {
                    nodemailer.createTestAccount((err, account) => {
                        sendEmail(account);
                    });
                }
            });
        });
    });

    router.post('/users/change_password', (req: Request, res: Response) => {
        if (!req.body.email || !req.body.password || !req.body.newPswd) {
            const fields = [{
                value: req.body.email,
                message: 'Need provide an email'
            }, {
                value:   req.body.password,
                message: 'Need provide a password'
            }, {
                value:   req.body.newPswd,
                message: 'Need provide a new password'
            }];

            const errors = buildErrors(fields) as any;

            return setRes(res, 400, {errors: errors});
        }

        db.user.getUserByQuery({email: req.body.email}).then(user => {
            if (!bcrypt.compareSync(req.body.password, user.body.password)) {
                return setRes(res, 401, {errors: {message: 'Incorrect password'}});
            }

            db.user.updateUser({email: req.body.email, password: bcrypt.hashSync(req.body.newPswd, 10)}).then(result => {
                const email = req.body.email;
                let emailMessage;
                let emailSmtpConfig;

                const generateEmailMessage = (emailAccount?) => {
                    emailMessage = {
                        from: process.env.PROJECT_NAME + ' <' + (process.env.SMTP_USER && process.env.SMTP_USER !== '' ? process.env.SMTP_USER : emailAccount.user) + '>',
                        to: email,
                        subject: process.env.PROJECT_NAME + ' :: change password',
                        text: `Your new password is: ${req.body.newPswd}`,
                        html: `Your new password is: ${req.body.newPswd}`
                    };
                };

                const generateEmailSmtpConfig = (emailAccount?) => {
                    if (emailAccount) {
                        emailSmtpConfig = {
                            host: 'smtp.ethereal.email',
                            port: 587,
                            secure: false, // true for 465, false for other ports
                            auth: {
                                user: emailAccount.user,
                                pass: emailAccount.pass
                            }
                        };
                    } else {
                        emailSmtpConfig = {
                            host:   process.env.SMTP_HOST,
                            port:   process.env.SMTP_PORT,
                            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                            auth:   {
                                user: process.env.SMTP_USER,
                                pass: process.env.SMTP_PSWD
                            }
                        };
                    }
                };

                const sendEmail = (emailAccount?) => {
                    generateEmailMessage(emailAccount);
                    generateEmailSmtpConfig(emailAccount);

                    const transporter = nodemailer.createTransport(emailSmtpConfig as nodemailer.TransportOptions);

                    transporter.sendMail(emailMessage, (error, info) => {
                        if (error) {
                            return console.error(error);
                        }

                        const message = `На почту был отправлен новый пароль.
                            ${emailAccount ? `<br>(developer mode: <a target="_blank" href="${nodemailer.getTestMessageUrl(info)}">link</a>)` : ''}`;

                        return setRes(res, result.status, {data: {message}});
                    });
                };

                if (process.env.SMTP_USER && process.env.SMTP_USER !== '') {
                    sendEmail();
                } else {
                    nodemailer.createTestAccount((err, account) => {
                        sendEmail(account);
                    });
                }
            });
        });
    });

    router.put('/users', (req: Request, res: Response) => {
        db.user.updateUser(req.body).then(media => {
            res.status(media.status);
            return res.json(media.body);
        });
    });

    router.delete('/users', (req: Request, res: Response) => {
        db.user.deleteUser(req.body).then(user => {
            res.status(user.status);
            return res.json(user.body);
        });
    });

    router.get('/users/:search', (req: Request, res: Response) => {
        db.user.getUserListByQuery(req.query).then(userList => {
            res.status(userList.status);
            return res.json(userList.body);
        });
    });

    console.success('router: "apiRouter" created');

    return router;
}


type IResponse = (res: Response, status: number | { status: number, statusText: string }, body: { data?: object | object[], errors?: {message: string} | {message: string}[] }) => Response;
