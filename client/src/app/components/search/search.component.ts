import {Component, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
    selector:    'app-search',
    templateUrl: './search.component.html',
    styleUrls:   ['./search.component.scss']
})
export class SearchComponent {
    @HostBinding('class') hostClass = 'app__search search';

    constructor(private router: Router, private location: Location) {}

    onSubmit(value: string) {
        this.router.navigate(['/media/search'], {queryParams: {byText: value}});
    }

    back() {
        this.location.back();
    }
}
