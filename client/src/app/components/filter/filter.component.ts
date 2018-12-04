import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaService, EqualService, FilterService} from '../../services';
import {Subscription} from 'rxjs';

@Component({
    selector:    'app-filter',
    templateUrl: './filter.component.html',
    styleUrls:   ['./filter.component.css']
})

export class FilterComponent {
    params: any = {};
    favorite: number[];
    subscribes: Subscription;
    filter: any;
    rlaFavorite: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private mediaService: MediaService,
        private equalService: EqualService,
        private filterService: FilterService
    ) {
        this.favorite = this.mediaService.getCustomList('favorite');

        if (this.activatedRoute.firstChild.snapshot.params.type === 'favorite') {
            this.params.type = this.activatedRoute.snapshot.queryParams.type;
        } else {
            this.params = this.activatedRoute.firstChild.snapshot.params;
        }

        this.subscribes = this.activatedRoute.firstChild.params.subscribe(params => {
            if (params.type !== 'search' && params.list !== 'favorite') {
                this.params = params;
                this.filterService.getFilter(params.type).subscribe(filter => {
                    this.filter = filter;
                });
            }
        });

        this.subscribes.add(this.mediaService.subscribeCustomList.subscribe(type => {
            if (type === 'favorite') {
                this.favorite = this.mediaService.getCustomList('favorite');
            }
        }));
    }

    public toggleFilter(el) {
        const activeClass = 'filter__title_active';
        const hasClass = el.target.classList.contains(activeClass);

        if (hasClass) {
            el.target.classList.remove(activeClass);
        } else {
            if ( el.target.parentNode.querySelector('.filter__title_active') ) {
                el.target.parentNode.querySelector('.filter__title_active').classList.remove(activeClass);
            }

            el.target.classList.add(activeClass);
        }
    }

    public includeToFilter(name: string, value) {
        if (this.filter[name].included.indexOf(value) === -1) {
            this.filter[name].included.push(value);
        }

        if (this.filter[name].excluded.indexOf(value) > -1) {
            this.filter[name].excluded.splice(this.filter[name].excluded.indexOf(value), 1);
        }
    }

    public excludeToFilter(name: string, value) {
        if (this.filter[name].excluded.indexOf(value) === -1) {
            this.filter[name].excluded.push(value);
        }

        if (this.filter[name].included.indexOf(value) > -1) {
            this.filter[name].included.splice(this.filter[name].included.indexOf(value), 1);
        }
    }

    public selectFilter(name: string, value) {
        if (this.filter[name].excluded.indexOf(value) > -1) {
            this.filter[name].excluded.splice(this.filter[name].excluded.indexOf(value), 1);
        } else if (this.filter[name].included.indexOf(value) === -1 && this.filter[name].included.length > 1) {
            this.filter[name].included.push(value);
        } else if (this.filter[name].included.indexOf(value) === 0 && this.filter[name].included.length === 1) {
            this.filter[name].included = [];
        } else {
            this.filter[name].included = [value];
            this.filter[name].excluded = [];
        }
    }

    public rangeFilter(name: string, min_max: string, value) {
        if (min_max === 'min') {
            this.filter[name].included[0] = +value;
        } else if (min_max === 'max') {
            this.filter[name].included[1] = +value;
        }
    }

    public resetFilter(name: string) {
        this.filter[name].included = [];
        this.filter[name].excluded = [];
    }

    public resetRange(name: string) {
        this.filter[name].included = this.filter[name].list.slice();
    }

    public submitFilter(name: string) {
        this.filter[name].history.included = this.filter[name].included.slice();

        if (name === 'genre' || name === 'country') {
            this.filter[name].history.excluded = this.filter[name].excluded.slice();
        }

        const applyFilter = {
            type: this.filter.type
        };

        for (const key in this.filter) {
            if (this.filter.hasOwnProperty(key)) {
                for (const key2 in this.filter[key]) {
                    if (this.filter[key].hasOwnProperty(key2) && (key2 === 'included' || key2 === 'excluded')) {
                        if (!applyFilter[key]) {
                            applyFilter[key] = {};
                        }

                        applyFilter[key][key2] = this.filter[key][key2];
                    }
                }
            }
        }

        this.filterService.update(applyFilter);
    }

    public isSubmitDisabled(name: string) {
        if (name === 'genre' || name === 'country') {
            return this.equalService.deepEqual(this.filter[name].included, this.filter[name].history.included) && this.equalService.deepEqual(this.filter[name].excluded, this.filter[name].history.excluded);
        }
        return this.equalService.deepEqual(this.filter[name].included, this.filter[name].history.included);
    }
}
