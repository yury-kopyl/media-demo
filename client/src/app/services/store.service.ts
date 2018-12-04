import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    components: any;
    readonly subject: Subject<any> = new Subject<any>();

    constructor() {
        this.components = {
            filter: true
        };

        this.subject.next(this.components);
    }

    public setFilter(status: true | false) {
        this.components.filter = status;
        this.subject.next(this.components);
    }
}
