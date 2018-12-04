import {Injectable} from '@angular/core';
import {UserModel} from '../models';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    user: UserModel;
    readonly userSubject: Subject<UserModel> = new Subject<UserModel>();
    protected storageKey = `${environment.project_name}_user`;

    constructor() {
        const user = localStorage.getItem(this.storageKey);

        if (user) {
            this.user = JSON.parse(user);
        }

        this.userSubject.next(this.user);
    }

    set(user: UserModel) {
        this.user = user;
        this.userSubject.next(this.user);
        localStorage.setItem(this.storageKey, JSON.stringify(this.user));
    }

    update(user: UserModel) {
        this.user = user;
        this.userSubject.next(this.user);
        localStorage.setItem(this.storageKey, JSON.stringify(this.user));
    }

    remove() {
        this.user = null;
        this.userSubject.next(null);
        localStorage.clear();
    }
}
