import {Component} from '@angular/core';
import {MediaService} from '../../services';
import {MediaModel} from '../../models';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
    selector:    'app-media',
    templateUrl: './media.component.html',
    styleUrls:   ['./media.component.scss']
})
export class MediaComponent {
    media: MediaModel;
    env: any;

    constructor(private mediaService: MediaService, private activatedRoute: ActivatedRoute) {
        this.media = this.mediaService.merge(this.activatedRoute.snapshot.data['media']) as MediaModel;
        this.env = environment;
    }
}
