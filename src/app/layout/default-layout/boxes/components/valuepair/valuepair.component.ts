import {Component, OnInit} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';

import {FieldRenderingType, MetadataBoxFieldRendering} from '../metadata-box.decorator';
import {RenderingTypeModelComponent} from '../rendering-type.model';
import {VocabularyService} from '../../../../../core/submission/vocabularies/vocabulary.service';
import {VocabularyOptions} from '../../../../../core/submission/vocabularies/models/vocabulary-options.model';
import {getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload} from '../../../../../core/shared/operators';
import {AuthService} from '../../../../../core/auth/auth.service';
import {take} from 'rxjs/operators';

/**
 * This component renders the valuepair (value + display) metadata fields.
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-valuepair]',
  templateUrl: './valuepair.component.html',
  styleUrls: ['./valuepair.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.VALUEPAIR)
export class ValuepairComponent extends RenderingTypeModelComponent implements OnInit {

  /**
   * list of values
   */
  values: string[] = [];

  constructor(
    protected translateService: TranslateService,
    protected vocabularyService: VocabularyService,
    protected authService: AuthService,) {
    super(translateService);
  }

  ngOnInit(): void {
    const values = [];
    let itemsToBeRendered = [];
    if (this.indexToBeRendered >= 0) {
      itemsToBeRendered.push(this.metadataValues[this.indexToBeRendered]);
    } else {
      itemsToBeRendered = [...this.metadataValues];
    }

    this.authService.isAuthenticated().pipe(take(1)).subscribe((isAuth) => {
        if (isAuth) {
          this.item.owningCollection.pipe(
            getFirstSucceededRemoteDataPayload(),
          ).subscribe((collection) => {

            const vocabularyOptions = new VocabularyOptions(null, this.field.metadata, collection.uuid);
            this.vocabularyService.searchVocabularyByMetadataAndCollection(vocabularyOptions).pipe(
              getFirstCompletedRemoteData(),
            ).subscribe((vocabulary) => {

              if (vocabulary.hasFailed) {
                // In case of error, show fallback values
                console.warn('Retrieving vocabulary has failed');
                this.values = itemsToBeRendered;
                return;
              }

              vocabularyOptions.name = vocabulary.payload.name;

              itemsToBeRendered.forEach((metadataValue) => {
                this.vocabularyService.getVocabularyEntryByValue(metadataValue, vocabularyOptions).subscribe(
                  (entry) => {
                    this.values.push(entry.display);
                  }
                );
              });

              this.values = values;

            });
          });
        } else {
          // If user is not authenticated, show fallback values
          console.warn('User not authorized');
          this.values = itemsToBeRendered;
        }
      }
    );

  }

}
