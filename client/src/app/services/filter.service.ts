import {Injectable} from '@angular/core';
import {MediaService} from '../services/media.service';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    historyFilter = {
        movies: null,
        tvSeries: null,
        games: null
    };
    filterPresets = {
        genre: {
            title: 'Жанр',
            list: []
        },
        country: {
            title: 'Страна',
            list: []
        },
        year: {
            title: 'Год',
            list: [1950, 2018]
        },
        rating: {
            title: 'Рейтинг',
            steps: new Array(10),
            list: [1, 10]
        },
        quality: {
            title: 'Качество',
            list: [1, 3]
        }
    };
    filterSets = {
        movies: ['genre', 'country', 'year', 'rating', 'quality'],
        tvSeries: ['genre', 'country', 'year', 'rating'],
        games: ['genre', 'year', 'rating']
    };

    protected storageKey = `${environment.project_name}_filter`;
    readonly filterSubject: Subject<{}> = new Subject<{}>();

    constructor(private mediaService: MediaService) {
        const filter = localStorage.getItem(this.storageKey);

        if (filter) {
            this.historyFilter = JSON.parse(filter);
        }

        this.filterSubject.next(this.historyFilter);
    }

    update(filter: any) {
        this.historyFilter[filter.type] = filter;
        delete this.historyFilter[filter.type].type;
        this.filterSubject.next(this.historyFilter);
        localStorage.setItem(this.storageKey, JSON.stringify(this.historyFilter));
    }

    getFilter(type: string) {
        return this.mediaService.getFilter(type).pipe(
            map(filter => {
                return this.compileFilter(type, filter);
            })
        );
    }

    compileFilter(type: string, filterList) {
        const filter = {
            type
        };

        if (!this.historyFilter[type]) {
            this.createFilterStore(type, filterList);
        }

        (this.filterSets[type] as string[]).forEach(filterName => {
            filter[filterName] = Object.assign({}, this.filterPresets[filterName]);
            filter[filterName].history = Object.assign({}, this.historyFilter[type][filterName]);

            if (filterName !== 'genre' && filterName !== 'country' && filterList[filterName]) {
                filter[filterName].list = filterList[filterName].slice();
                filter[filterName].included = this.historyFilter[type][filterName] ? this.historyFilter[type][filterName].included.slice() : filterList[filterName].slice();
            } else if (filterName !== 'genre' && filterName !== 'country'  && !filterList[filterName]) {
                filter[filterName].list = this.filterPresets[filterName].list.slice();
                filter[filterName].included = this.historyFilter[type][filterName] ? this.historyFilter[type][filterName].included.slice() : this.filterPresets[filterName].list.slice();
            } else if ((filterName === 'genre' || filterName === 'country') && filterList[filterName]) {
                filter[filterName].list = filterList[filterName].slice();
                filter[filterName].included = this.historyFilter[type][filterName] ? this.historyFilter[type][filterName].included.slice() : [];
                filter[filterName].excluded = this.historyFilter[type][filterName] ? this.historyFilter[type][filterName].excluded.slice() : [];
            } else {
                delete filter[filterName];
            }
        });

        return filter;
    }

    private createFilterStore(filterType: string, dynamicFilters: any) {
        this.historyFilter[filterType] = {};

        (this.filterSets[filterType] as string[]).forEach(filter => {
            if (filter !== 'genre' && filter !== 'country') {
                this.historyFilter[filterType][filter] = {
                    included: dynamicFilters[filter] || this.filterPresets[filter].list
                };
            } else if (filter === 'genre' || filter === 'country') {
                this.historyFilter[filterType][filter] = {
                    included: [],
                    excluded: []
                };
            }
        });

        this.updateHistory();
    }

    private setStorageFilter(filter): this {
        localStorage.setItem(this.storageKey, JSON.stringify(filter));
        return this;
    }

    public getStorageFilter(type: string) {
        return this.historyFilter[type];
    }

    /* public getStorageFilter(type: string) {
		const store = localStorage.getItem(this.storageKey);

        return store ? JSON.parse(store)[type] : null;
    } */

    private updateHistory() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.historyFilter));
    }
}
