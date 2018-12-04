import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {MediaComponent, MediaResolve, MediaListComponent} from './components';

const routes: Routes = [
    {path: '', redirectTo: 'media/movies', pathMatch: 'full'},
    {path: 'media/detail/:id', component: MediaComponent, resolve: {media: MediaResolve}},
    {path: 'media/:type', component: MediaListComponent},
    {path: 'media/:type/:list', component: MediaListComponent},
    {path: '**', redirectTo: ''}
];

@NgModule({
    exports:   [RouterModule],
    imports:   [RouterModule.forRoot(routes)],
    providers: [MediaResolve]
})

export class AppRoutingModule {
}
