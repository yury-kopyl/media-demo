import {NgModule} from '@angular/core';

// Modules
import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

// Components
import {AppComponent} from './app.component';
import {
    AccountComponent,
    AuthorizationComponent,
    FilterComponent,
    MediaComponent,
    MediaItemComponent,
    MediaListComponent,
    SearchComponent
} from './components';

// Directives
import {IsAuthorizedDirective, FavoriteDirective} from './directives';
import {JoinPipe} from './pipes';
import { BtnDisableDirective } from './directives/btn-disable.directive';

@NgModule({
    declarations: [
        // components
        AppComponent,
        AccountComponent,
        AuthorizationComponent,
        FilterComponent,
        MediaItemComponent,
        MediaListComponent,
        SearchComponent,
        // directives
        IsAuthorizedDirective,
        FavoriteDirective,
        MediaComponent,
        JoinPipe,
        BtnDisableDirective
    ],
    imports:      [
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
    ],
    entryComponents: [FilterComponent],
    providers:    [],
    bootstrap:    [AppComponent]
})

export class AppModule {
}
