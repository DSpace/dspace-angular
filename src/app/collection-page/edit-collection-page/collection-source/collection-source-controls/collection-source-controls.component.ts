import { Component, Input, OnDestroy } from '@angular/core';
import { ScriptDataService } from '../../../../core/data/processes/script-data.service';
import { ContentSource } from '../../../../core/shared/content-source.model';
import { ProcessDataService } from '../../../../core/data/processes/process-data.service';
import {
  getAllCompletedRemoteData,
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload
} from '../../../../core/shared/operators';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { hasValue, hasValueOperator } from '../../../../shared/empty.util';
import { ProcessStatus } from '../../../../process-page/processes/process-status.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { RequestService } from '../../../../core/data/request.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { Collection } from '../../../../core/shared/collection.model';
import { CollectionDataService } from '../../../../core/data/collection-data.service';
import { Observable } from 'rxjs/internal/Observable';
import { Process } from '../../../../process-page/processes/process.model';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';

@Component({
  selector: 'ds-collection-source-controls',
  templateUrl: './collection-source-controls.component.html',
})
export class CollectionSourceControlsComponent implements OnDestroy {

  @Input() isEnabled: boolean;
  @Input() collection: Collection;
  @Input() shouldShow: boolean;

  contentSource$: Observable<ContentSource>;
  private subs: Subscription[] = [];

  constructor(private scriptDataService: ScriptDataService,
              private processDataService: ProcessDataService,
              private requestService: RequestService,
              private notificationsService: NotificationsService,
              private collectionService: CollectionDataService,
              private translateService: TranslateService,
              private httpClient: HttpClient,
              private bitstreamService: BitstreamDataService
  ) {
  }

  ngOnInit() {
    this.contentSource$ = this.collectionService.findByHref(this.collection._links.self.href, false).pipe(
      getAllSucceededRemoteDataPayload(),
      switchMap((collection) => this.collectionService.getContentSource(collection.uuid, false)),
      getAllSucceededRemoteDataPayload()
    );
  }

  testConfiguration(contentSource) {
    this.subs.push(this.scriptDataService.invoke('harvest', [
      {name: '-g', value: null},
      {name: '-a', value: contentSource.oaiSource},
      {name: '-i', value: contentSource.oaiSetId},
    ], []).pipe(
      getFirstCompletedRemoteData(),
      tap((rd) => {
        if (rd.hasFailed) {
          this.notificationsService.error(this.translateService.get('collection.source.controls.test.submit.error'));
        }
      }),
      filter((rd) => rd.hasSucceeded && hasValue(rd.payload)),
      switchMap((rd) => this.processDataService.findById(rd.payload.processId, false)),
      getAllCompletedRemoteData(),
      filter((rd) => !rd.isStale && (rd.hasSucceeded || rd.hasFailed)),
      map((rd) => rd.payload),
      hasValueOperator(),
    ).subscribe((process: Process) => {
        if (process.processStatus.toString() !== ProcessStatus[ProcessStatus.COMPLETED].toString() &&
          process.processStatus.toString() !== ProcessStatus[ProcessStatus.FAILED].toString()) {
          setTimeout(() => {
            this.requestService.setStaleByHrefSubstring(process._links.self.href);
          }, 5000);
        }
        if (process.processStatus.toString() === ProcessStatus[ProcessStatus.FAILED].toString()) {
          this.notificationsService.error(this.translateService.get('collection.source.controls.test.failed'));
        }
        if (process.processStatus.toString() === ProcessStatus[ProcessStatus.COMPLETED].toString()) {
          this.bitstreamService.findByHref(process._links.output.href, false).pipe(getFirstSucceededRemoteDataPayload()).subscribe((bitstream) => {
            this.httpClient.get(bitstream._links.content.href, {responseType: 'text'}).subscribe((data: any) => {
              const output = data.replaceAll(new RegExp('.*\\@(.*)', 'g'), '$1')
                .replaceAll('The script has started', '')
                .replaceAll('The script has completed', '');
              this.notificationsService.success(this.translateService.get('collection.source.controls.test.completed'), output);
            });
          });
        }
      }
    ));
  }

  importNow() {
    this.subs.push(this.scriptDataService.invoke('harvest', [
      {name: '-r', value: null},
      {name: '-e', value: 'dspacedemo+admin@gmail.com'},
      {name: '-c', value: this.collection.uuid},
    ], [])
      .pipe(
        getFirstCompletedRemoteData(),
        tap((rd) => {
          if (rd.hasFailed) {
            this.notificationsService.error(this.translateService.get('collection.source.controls.test.submit.error'));
          }
        }),
        filter((rd) => rd.hasSucceeded && hasValue(rd.payload)),
        switchMap((rd) => this.processDataService.findById(rd.payload.processId, false)),
        getAllCompletedRemoteData(),
        filter((rd) => !rd.isStale && (rd.hasSucceeded || rd.hasFailed)),
        map((rd) => rd.payload),
        hasValueOperator(),
      ).subscribe((process) => {
          if (process.processStatus.toString() !== ProcessStatus[ProcessStatus.COMPLETED].toString() &&
            process.processStatus.toString() !== ProcessStatus[ProcessStatus.FAILED].toString()) {
            setTimeout(() => {
              this.requestService.setStaleByHrefSubstring(process._links.self.href);
              this.requestService.setStaleByHrefSubstring(this.collection._links.self.href);
            }, 5000);
          }
          if (process.processStatus.toString() === ProcessStatus[ProcessStatus.FAILED].toString()) {
            this.notificationsService.error(this.translateService.get('collection.source.controls.import.failed'));
          }
          if (process.processStatus.toString() === ProcessStatus[ProcessStatus.COMPLETED].toString()) {
            this.notificationsService.success(this.translateService.get('collection.source.controls.import.completed'));
            setTimeout(() => {
              this.requestService.setStaleByHrefSubstring(this.collection._links.self.href);
            }, 5000);
          }
        }
      ));
  }

  resetAndReimport() {
    // TODO implement when a single option is present
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (hasValue(sub)) {
        sub.unsubscribe();
      }
    });
  }
}
