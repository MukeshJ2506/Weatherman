import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import 'rxjs/Rx';
import {MomentModule} from 'angular2-moment';

import {AppComponent} from './app.component';
import {routing, appRoutingProviders} from './app.routing';
import {SearchComponent} from './search/search.component';
import {SearchService} from './services/search.service';

@NgModule({
    declarations: [
        AppComponent,
        SearchComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        JsonpModule,
        routing,
        MomentModule
    ],
    providers: [appRoutingProviders, SearchService],
    bootstrap: [AppComponent]
})

export class AppModule {
}
