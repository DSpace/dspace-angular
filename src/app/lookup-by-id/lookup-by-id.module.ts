import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectNotFoundComponent } from './objectnotfound/objectnotfound.component';
import { DsoRedirectService } from '../core/data/dso-redirect.service';
import { ThemedObjectNotFoundComponent } from './objectnotfound/themed-objectnotfound.component';

@NgModule({
    imports: [
        CommonModule,
        ObjectNotFoundComponent,
        ThemedObjectNotFoundComponent
    ],
    providers: [
        DsoRedirectService,
    ]
})
export class LookupIdModule {

}
