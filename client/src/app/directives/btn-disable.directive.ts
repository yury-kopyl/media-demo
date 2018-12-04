import {Directive, HostListener} from '@angular/core';

@Directive({
    // tslint:disable-next-line
    selector: '.btn_disabled'
})

export class BtnDisableDirective {
    constructor() {}

    @HostListener('click') onClick() {
        return false;
    }
}
