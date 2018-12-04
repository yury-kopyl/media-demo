import {
    Component,
    OnInit,
    OnDestroy,
    HostBinding
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {MediaModel} from '../../models';
import {MediaService, StoreService, FilterService} from '../../services';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-media-list',
    templateUrl: './media-list.component.html',
    styleUrls: ['./media-list.component.css']
})

export class MediaListComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'grid';
    mediaItems: MediaModel[];
    subscribes: Subscription;
    customList: string;
    typeList: string;

    constructor(
        private mediaService: MediaService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private storeService: StoreService,
        private filterService: FilterService
    ) {}

    ngOnInit() {
        this.storeService.setFilter(true);

        this.subscribes = this.mediaService.subscribeMediaList.subscribe(mediaList => {
            this.mediaItems = mediaList;
        });

        this.subscribes.add(this.filterService.filterSubject.subscribe(filter => {
            this.mediaService.getMedias({type: this.typeList, ...filter[this.typeList]});
        }));

        this.subscribes.add(this.activatedRoute.params.subscribe(params => {
            if (!params.list) {
                let query = Object.assign({}, params);
                if (this.filterService.getStorageFilter(params.type)) {
                    query = Object.assign(query, this.filterService.getStorageFilter(params.type));
                }

                if (params.type === 'search' && this.activatedRoute.snapshot.queryParams.byText) {
                    query.byText = this.activatedRoute.snapshot.queryParams.byText;
                    this.storeService.setFilter(false);
                } else if (!this.storeService.components.filter) {
                    this.storeService.setFilter(true);
                }

                this.mediaService.getMedias(query);
                this.customList = null;
            } else if (params.list) {
                const list = this.mediaService.getCustomList(params.list);
                this.mediaService.getMedias({type: params.type, id: list.length ? list : null});
                this.customList = params.list;
            }

            this.typeList = params.type;
        }));

        this.subscribes.add(this.mediaService.subscribeSetCustomList.subscribe(wasSet => {
            if (wasSet) {
                this.mediaItems = this.mediaService.merge(this.mediaItems) as MediaModel[];
            }
        }));
    }

    ngOnDestroy() {
        this.subscribes.unsubscribe();
        this.storeService.setFilter(false);
    }
}
