import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {tap} from 'rxjs/operators';

import {MediaModel} from '../models';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class MediaService {
    readonly subscribeSetCustomList: Subject<any> = new Subject<any>();
    readonly subscribeCustomList: Subject<any> = new Subject<any>();
    mediaList: MediaModel[];
    readonly subscribeMediaList: Subject<any> = new Subject<any>();
    favoriteKey = `${environment.project_name}_favorite`;
    subscriptionKey = `${environment.project_name}_subscription`;
    watchedKey = `${environment.project_name}_watched`;

    static handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(`Backend returned code ${error.status}, body was: ${error.error.body}`);
        }

        return throwError('Something bad happened; please try again later.');
    }

    constructor(private http: HttpClient) {}

    getMedias(params): void {
        const data = {};

        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                if (typeof params[key] === 'object') {
                    data[key] = JSON.stringify(params[key]);
                } else {
                    data[key] = params[key];
                }
            }
        }

        this.http.get(environment.api.medias.search, {params: data}).pipe(
            tap((mediaList: MediaModel[]) => {
                this.mediaList = this.merge(mediaList) as MediaModel[];
                this.subscribeMediaList.next(this.mediaList);
            }, (error: HttpErrorResponse) => {
                MediaService.handleError(error);
            })
        ).subscribe();
    }

    getFilter(type: string): Observable<object> {
        return this.http.get(environment.api.medias.filter, {params: {type}}).pipe(
            tap(() => {
            }, (error: HttpErrorResponse) => {
                MediaService.handleError(error);
            })
        );
    }

    getMedia(id): Observable<object> {
        return this.http.get(environment.api.medias.root, {params: {id}}).pipe(
            tap(() => {
            }, (error: HttpErrorResponse) => {
                MediaService.handleError(error);
            })
        );
    }

    removeMediaFromList(id: number) {
        const index = this.mediaList.findIndex(media => media.id === id);

        this.mediaList.splice(index, 1);
        this.subscribeMediaList.next(this.mediaList);
    }


    /* CUSTOM LIST */

    // TODO need multiple action
    public toggleCustomList(id, email): Observable<any> {
        return this.http.post(environment.api.medias.favorite, {id, email}).pipe(
            tap(result => {
                if (result.action === 'add') {
                    this.addToCustomList('favorite', id);
                } else if (result.action === 'remove') {
                    this.removeFromCustomList('favorite', id);
                }
            }, (error: HttpErrorResponse) => {
                MediaService.handleError(error);
            })
        );
    }

    public merge(mediaList: Array<MediaModel> | MediaModel): MediaModel[] | MediaModel {
        if (!mediaList) {
            return null;
        }

        const customListKeys = ['favorite', 'subscription', 'watched'];

        customListKeys.forEach(key => {
            const list = JSON.parse(localStorage.getItem(this[key + 'Key']));

            if (Array.isArray(mediaList)) {
                mediaList.map((media: MediaModel) => {
                    media[key] = list && list.indexOf(media.id) > -1;
                });
            } else {
                mediaList[key] = list && list.indexOf(mediaList.id) > -1;
            }
        });

        return mediaList;
    }

    public setCustomList(list: any[]) {
        const customListKeys = ['favorite', 'subscription', 'watched'];

        customListKeys.forEach(key => {
            if (list[key]) {
                localStorage.setItem(this[key + 'Key'], JSON.stringify(list[key]));
            }
        });

        this.subscribeSetCustomList.next(true);
    }

    public getCustomList(type: 'favorite' | 'subscription' | 'watched') {
        return JSON.parse(localStorage.getItem(this[type + 'Key']));
    }

    private addToCustomList(type: 'favorite' | 'subscription' | 'watched', id: number) {
        const list = JSON.parse(localStorage.getItem(this[type + 'Key'])) || [];

        if (list.indexOf(id) === -1) {
            list.push(id);
            localStorage.setItem(this[type + 'Key'], JSON.stringify(list));
            this.subscribeCustomList.next(type);
        } else {
            console.error('You are trying to add an existing id');
        }
    }

    private removeFromCustomList(type: 'favorite' | 'subscription' | 'watched', id: number) {
        const list = JSON.parse(localStorage.getItem(this[type + 'Key']));
        const index = list.indexOf(id);

        if (index !== -1) {
            list.splice(index, 1);
            localStorage.setItem(this[type + 'Key'], JSON.stringify(list));
            this.subscribeCustomList.next(type);
        } else {
            console.error('You are trying to remove a non-existent id');
        }
    }
}
