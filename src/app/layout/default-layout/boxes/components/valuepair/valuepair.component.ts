import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, from, interval, race } from 'rxjs';
import { map, mapTo, mergeMap, reduce, take } from 'rxjs/operators';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeModelComponent } from '../rendering-type.model';
import { VocabularyService } from '../../../../../core/submission/vocabularies/vocabulary.service';
import { getFirstSucceededRemoteDataPayload, getPaginatedListPayload } from '../../../../../core/shared/operators';
import { MetadataValue } from '../../../../../core/shared/metadata.models';

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
  values: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(
    protected translateService: TranslateService,
    protected vocabularyService: VocabularyService,
  ) {
    super(translateService);
  }

  ngOnInit(): void {
    let metadataToBeRendered: MetadataValue[] = [];
    if (this.indexToBeRendered >= 0) {
      metadataToBeRendered.push(this.metadata[this.indexToBeRendered]);
    } else {
      metadataToBeRendered = [...this.metadata];
    }
    console.log('MD = ' + JSON.stringify(metadataToBeRendered));

    const entries$ = from(metadataToBeRendered).pipe(
      mergeMap((metadatum: MetadataValue) => {
        const vocabularyName = this.subtype;
        const authority = metadatum.authority ? metadatum.authority.split(':') : undefined;

        const isControlledVocabulary =  authority?.length > 1 && authority[0] === vocabularyName;

        const value = isControlledVocabulary ? authority[1] : metadatum.value;
        console.log(`iscontrolledVocabulary = ${isControlledVocabulary}\nvocabularyName = ${vocabularyName}\nvalue = ${value}\nauthority = ${authority}`);
        return this.vocabularyService.getPublicVocabularyEntryByValue(vocabularyName, value).pipe(
          getFirstSucceededRemoteDataPayload(),
          getPaginatedListPayload(),
          map((res) => res[0]?.display ?? value),
        );
      }),
      reduce((acc: any, value: any) => [...acc, value], []),
    );

    // fallback values to be shown if the display value cannot be retrieved
    const initValues$ = interval(5000).pipe(mapTo(metadataToBeRendered.map((i) => i.value)));

    race([entries$, initValues$]).pipe(take(1)).subscribe((values: string[]) => {
      this.values.next(values);
    });

  }

}
