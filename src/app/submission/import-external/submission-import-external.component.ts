import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { ExternalSourceService } from '../../core/data/external-source.service';
import { ExternalSourceData } from './import-external-searchbar/submission-import-external-searchbar.component';

/**
 * This component allows to submit a new workspaceitem importing the data from an external source.
 */
@Component({
  selector: 'ds-submission-import-external',
  styleUrls: ['./submission-import-external.component.scss'],
  templateUrl: './submission-import-external.component.html'
})
export class SubmissionImportExternalComponent {
  /**
   * The external source search data.
   */
  public externalSourceData: ExternalSourceData;

  /**
   * Initialize the component variables.
   * @param {ExternalSourceService} externalService
   */
  constructor(
    private externalService: ExternalSourceService,
    private cdr: ChangeDetectorRef,
  ) { }

  /**
   * Get the data to submit a search.
   */
  public getExternalsourceData(event: ExternalSourceData) {
    this.externalSourceData = event;
  }
}
