import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {MediaService} from './media.service';
import {UserService} from './user.service';

import {Observable, throwError} from 'rxjs';
import {tap} from 'rxjs/operators';

import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class AuthorizationService {
    static handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            const errorMessages = [];

            if (Array.isArray(error.error.errors)) {
                error.error.errors.forEach(errorObj => {
                    errorMessages.push('\n\t' + errorObj.message);
                });
            } else {
                errorMessages.push(error.error.errors.message);
            }
            console.error(`Backend returned code ${error.error.status}, body was: ${errorMessages.join('')}`);
        }

        return throwError('Something bad happened; please try again later.');
    }

    constructor(private http: HttpClient, private mediaService: MediaService, private userService: UserService) {}

    login(params): Observable<any> {
        return this.http.post(environment.api.users.login, params).pipe(
            tap(data => {
                this.userService.set({email: data.data.email, permission: data.data.permission});
                this.mediaService.setCustomList(data.data);
            }, (error: HttpErrorResponse) => {
                AuthorizationService.handleError(error);
            })
        );
    }

    logout() {
        this.userService.remove();
    }

    registration(params): Observable<any> {
        return this.http.post(environment.api.users.registration, params).pipe(
            tap(() => {
            }, (error: HttpErrorResponse) => {
                AuthorizationService.handleError(error);
            })
        );
    }

    recovery(params): Observable<any> {
        return this.http.post(environment.api.users.recovery, params).pipe(
            tap(() => {
            }, (error: HttpErrorResponse) => {
                AuthorizationService.handleError(error);
            })
        );
    }

    changePassword(params): Observable<any> {
        return this.http.post(environment.api.users.changePswd, params).pipe(
            tap(() => {
            }, (error: HttpErrorResponse) => {
                AuthorizationService.handleError(error);
            })
        );
    }
}
