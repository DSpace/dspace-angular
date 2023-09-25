import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GrantDenyRequestCopyComponent } from './grant-deny-request-copy/grant-deny-request-copy.component';
import { RequestCopyRoutingModule } from './request-copy-routing.module';
import { DenyRequestCopyComponent } from './deny-request-copy/deny-request-copy.component';
import { ThemedDenyRequestCopyComponent } from './deny-request-copy/themed-deny-request-copy.component';
import { EmailRequestCopyComponent } from './email-request-copy/email-request-copy.component';
import { ThemedEmailRequestCopyComponent } from './email-request-copy/themed-email-request-copy.component';
import { GrantRequestCopyComponent } from './grant-request-copy/grant-request-copy.component';
import { ThemedGrantRequestCopyComponent } from './grant-request-copy/themed-grant-request-copy.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RequestCopyRoutingModule,
        GrantDenyRequestCopyComponent,
        DenyRequestCopyComponent,
        ThemedDenyRequestCopyComponent,
        EmailRequestCopyComponent,
        ThemedEmailRequestCopyComponent,
        GrantRequestCopyComponent,
        ThemedGrantRequestCopyComponent
    ],
    exports: [
        ThemedEmailRequestCopyComponent,
    ],
    providers: []
})

/**
 * Module related to components used to grant or deny an item request
 */
export class RequestCopyModule {

}
