import {Component, OnInit} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';

import {FieldRenderingType, MetadataBoxFieldRendering} from '../metadata-box.decorator';
import {RenderingTypeModelComponent} from '../rendering-type.model';
import {VocabularyService} from '../../../../../core/submission/vocabularies/vocabulary.service';
import {VocabularyOptions} from '../../../../../core/submission/vocabularies/models/vocabulary-options.model';

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

    console.log('=== Retrieve vocabulary name ===');

    let vocabularyName; // TODO sistemare
    let vocabularyOptions;

    this.item.owningCollection.subscribe((collection) => {
      console.log('Collection UUID = ' + collection.payload.uuid);
      // TODO vocabulary name = ?
      vocabularyOptions = new VocabularyOptions('name', this.field.metadata, collection.payload.uuid);
      this.vocabularyService.searchVocabularyByMetadataAndCollection(vocabularyOptions).subscribe((vocabulary) => {
        console.log('VOCABULARY: ' + JSON.stringify(vocabulary));
        vocabularyName = vocabulary.payload?.name;
        console.log('Vocabulary name = ' + vocabularyName);


        console.log('=== Retrieve values ===');

        itemsToBeRendered.forEach((metadataValue) => {
          console.log('Metadata value = ' + JSON.stringify(metadataValue));

          /*this.vocabularyService.findEntryDetailByHref('/server/api/submission/vocabularies/common_iso_languages/entries?metadata=person.knowsLanguage&collection=5a429e5f-d626-4a22-b852-5d833c27ee28&filter=it&exact=true').subscribe((entry) => {
            console.log('byHref = ' + JSON.stringify(entry));
            //values.push();
          });*/

          /*this.vocabularyService.findEntryDetailById(metadataValue, vocabularyName).subscribe((entry) => {
            console.log('byId = ' + JSON.stringify(entry));
            //values.push();
          });*/

          debugger;
          this.vocabularyService.getVocabularyEntryByValue(
            'it',
            vocabularyOptions
          ).subscribe(
            (res) => {
              console.log('by value: ' + JSON.stringify(res));
            }
          );

        });
        this.values = values;

      });
    });
  }

}
