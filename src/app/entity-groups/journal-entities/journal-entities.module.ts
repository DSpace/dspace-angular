import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ItemPageModule } from '../../+item-page/item-page.module';
import { JournalComponent } from './item-pages/journal/journal.component';
import { JournalIssueComponent } from './item-pages/journal-issue/journal-issue.component';
import { JournalVolumeComponent } from './item-pages/journal-volume/journal-volume.component';
import { JournalListElementComponent } from './item-list-elements/journal/journal-list-element.component';
import { JournalIssueListElementComponent } from './item-list-elements/journal-issue/journal-issue-list-element.component';
import { JournalVolumeListElementComponent } from './item-list-elements/journal-volume/journal-volume-list-element.component';
import { TooltipModule } from 'ngx-bootstrap';

const ENTRY_COMPONENTS = [
  JournalComponent,
  JournalIssueComponent,
  JournalVolumeComponent,
  JournalListElementComponent,
  JournalIssueListElementComponent,
  JournalVolumeListElementComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TooltipModule.forRoot(),
    ItemPageModule
  ],
  declarations: [
    ...ENTRY_COMPONENTS
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ]
})
export class JournalEntitiesModule {

}
