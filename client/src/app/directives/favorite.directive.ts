import {Directive, HostBinding, HostListener, Input} from '@angular/core';
import {MediaService, UserService} from '../services';

@Directive({
    selector: '[appFavorite]'
})

export class FavoriteDirective {
    id: number;
    customList: string;

    constructor(private mediaService: MediaService, private userService: UserService) {}

    @Input() set appFavorite(value: { id: number, isFavorite: boolean, customList?: string }) {
        this.id = value.id;
        this.isFavorite = value.isFavorite;
        this.customList = value.customList;
    }

    @HostBinding('class.favorite-btn_active') isFavorite = false;

    @HostListener('click') onClick() {
        this.mediaService.toggleCustomList(this.id, this.userService.user.email).subscribe(data => {
            this.isFavorite = data.action === 'add';
            if (this.customList === 'favorite' && !this.isFavorite) {
                this.mediaService.removeMediaFromList(this.id);
            }
        }, error => {
            console.error(error);
        });
    }
}
