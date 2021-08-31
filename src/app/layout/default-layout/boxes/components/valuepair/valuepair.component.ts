import {Component, OnInit} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';

import {FieldRenderingType, MetadataBoxFieldRendering} from '../metadata-box.decorator';
import {RenderingTypeModelComponent} from '../rendering-type.model';
import {VocabularyService} from '../../../../../core/submission/vocabularies/vocabulary.service';
import {VocabularyOptions} from '../../../../../core/submission/vocabularies/models/vocabulary-options.model';
import {getFirstSucceededRemoteDataPayload} from '../../../../../core/shared/operators';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {hasNoValue} from '../../../../../shared/empty.util';

/**
 * This component renders the links metadata fields.
 * The metadata value is used for href and text
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

  constructor(protected translateService: TranslateService, protected vocabularyService: VocabularyService) {
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

    let vocabularyOptions;

    this.item.owningCollection.pipe(
      getFirstSucceededRemoteDataPayload(),
    ).subscribe((collection) => {

      vocabularyOptions = new VocabularyOptions(null, this.field.metadata, collection.uuid);
      this.vocabularyService.searchVocabularyByMetadataAndCollection(vocabularyOptions).pipe(
        getFirstSucceededRemoteDataPayload(),
        catchError(() => of(null))
      ).subscribe((vocabulary) => {

        // TODO: fix catch error

        console.log('Vocabulary = ' + JSON.stringify(vocabulary));

        if (hasNoValue(vocabulary)) {
          console.log('Items: ' + JSON.stringify(itemsToBeRendered));
          this.values = itemsToBeRendered;
          return;
        }

        vocabularyOptions.name = vocabulary.name;

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
  }

}
