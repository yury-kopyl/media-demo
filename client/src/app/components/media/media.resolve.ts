import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {MediaService} from '../../services';
import {RouterStateSnapshot} from '@angular/router/src/router_state';
import {MediaModel} from '../../models';

@Injectable()
export class MediaResolve implements Resolve<MediaModel> {
    constructor(private mediaService: MediaService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.mediaService.getMedia(route.paramMap.get('id'));
    }
}
