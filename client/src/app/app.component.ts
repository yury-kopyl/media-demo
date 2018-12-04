import {Component, ViewChild, OnInit, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import {FilterComponent} from './components';
import {StoreService} from './services';
import {environment} from '../environments/environment';

@Component({
    selector:    'body',
    templateUrl: './app.component.html',
    styleUrls:   ['./app.component.scss']
})
export class AppComponent implements OnInit {
    readonly title = environment.project_name;
    @ViewChild('filter', {read: ViewContainerRef}) filter: ViewContainerRef;

    constructor(
        private store: StoreService,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    ngOnInit() {
        this.store.subject.subscribe(store => {
            if (store.filter) {
                const component = this.componentFactoryResolver.resolveComponentFactory(FilterComponent);
                this.filter.createComponent(component);
            } else {
                this.filter.remove();
            }
        });
    }
}
