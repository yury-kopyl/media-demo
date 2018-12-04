import {Component, Input, HostBinding} from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-media-item',
    templateUrl: './media-item.component.html',
    styleUrls: ['./media-item.component.css']
})
export class MediaItemComponent {
    env: any;
    @HostBinding('class') class = 'grid__item grid__item_lg-4 grid__item_xl-3 grid__item_xxl-2 grid__item_align-center';
    @Input() mediaItem;
    @Input() customList;

    constructor() {
        this.env = environment;
    }
}
