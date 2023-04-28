import { Component, Inject } from '@angular/core';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SectionModelComponent } from '../models/section.model';
import { SectionsService } from '../sections.service';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { SectionDataObject } from '../models/section-data.model';
import { hasValue } from '../../../shared/empty.util';
import { RemoteData } from '../../../core/data/remote-data';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { HELP_DESK_PROPERTY } from '../../../item-page/tombstone/tombstone.component';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { Collection } from '../../../core/shared/collection.model';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { getRemoteDataPayload } from '../../../core/shared/operators';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';

@Component({
  selector: 'ds-clarin-notice',
  templateUrl: './clarin-notice.component.html',
  styleUrls: ['./clarin-notice.component.scss']
})
@renderSectionFor(SectionsType.clarinNotice)
export class SubmissionSectionClarinNoticeComponent extends SectionModelComponent {

  constructor(
              protected sectionService: SectionsService,
              private configurationDataService: ConfigurationDataService,
              private collectionDataService: CollectionDataService,
              private dsoNameService: DSONameService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * The mail for the help desk is loaded from the server.
   */
  helpDesk$: Observable<RemoteData<ConfigurationProperty>>;

  /**
   * The name of the current collection.
   */
  collectionName: BehaviorSubject<string> = new BehaviorSubject<string>('');

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected getSectionStatus(): Observable<boolean> {
    return of(true);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  onSectionDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  protected onSectionInit(): void {
    this.helpDesk$ = this.configurationDataService.findByPropertyName(HELP_DESK_PROPERTY);

    this.collectionDataService.findById(this.collectionId)
      .pipe(getRemoteDataPayload())
      .subscribe((collection: Collection) => {
        this.collectionName.next(this.dsoNameService.getName(collection));
      });
  }
}
