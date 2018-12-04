import {Directive, OnInit, OnDestroy, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {UserService} from '../services';
import {Subscription} from 'rxjs';

@Directive({
    selector: '[appIsAuthorized]'
})

export class IsAuthorizedDirective implements OnInit, OnDestroy {
    condition: boolean;
    subscribe: Subscription;

    constructor(
        private userService: UserService,
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef) {}

    @Input() set appIsAuthorized(condition: boolean) {
        this.condition = condition;
    }

    ngOnInit() {
        this.viewContainer(this.userService.user);

        this.subscribe = this.userService.userSubject.subscribe(user => {
            this.viewContainer(user);
        });
    }

    ngOnDestroy() {
        this.subscribe.unsubscribe();
    }

    viewContainer(user) {
        if ((user && this.condition) || (!user && !this.condition)) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainerRef.clear();
        }
    }
}
