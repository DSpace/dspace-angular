import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, from, interval, race } from 'rxjs';
import { map, mapTo, mergeMap, reduce, take } from 'rxjs/operators';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeModelComponent } from '../rendering-type.model';
import { VocabularyService } from '../../../../../core/submission/vocabularies/vocabulary.service';
import { getFirstSucceededRemoteDataPayload, getPaginatedListPayload } from '../../../../../core/shared/operators';
import { AuthService } from '../../../../../core/auth/auth.service';

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
    protected authService: AuthService,) {
    super(translateService);
  }

  ngOnInit(): void {
    let itemsToBeRendered = [];
    if (this.indexToBeRendered >= 0) {
      itemsToBeRendered.push(this.metadataValues[this.indexToBeRendered]);
    } else {
      itemsToBeRendered = [...this.metadataValues];
    }

    const entries$ = from(itemsToBeRendered).pipe(
      mergeMap((metadataValue) => {
        return this.vocabularyService.getPublicVocabularyEntryByValue('common_iso_languages', metadataValue).pipe(
          getFirstSucceededRemoteDataPayload(),
          getPaginatedListPayload(),
          map((res) => res[0]?.display ?? metadataValue),
        );
      }),
      reduce((acc: any, value: any) => [...acc, value], []),
    );

    this.vocabularyService.getPublicVocabularyEntryByValue('common_iso_languages', 'it').pipe(
      getFirstSucceededRemoteDataPayload(),
      getPaginatedListPayload(),
    );

    const initValues$ = interval(5000).pipe(mapTo(itemsToBeRendered));

    race([entries$, initValues$]).pipe(take(1)).subscribe((values: string[]) => {
      this.values.next(values);
    });

  }

}
