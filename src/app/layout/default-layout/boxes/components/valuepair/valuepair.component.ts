import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, from, interval, race } from 'rxjs';
import { filter, map, mapTo, mergeMap, reduce, switchMap, take } from 'rxjs/operators';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeModelComponent } from '../rendering-type.model';
import { VocabularyService } from '../../../../../core/submission/vocabularies/vocabulary.service';
import { VocabularyOptions } from '../../../../../core/submission/vocabularies/models/vocabulary-options.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../../core/shared/operators';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Collection } from '../../../../../core/shared/collection.model';
import { Vocabulary } from '../../../../../core/submission/vocabularies/models/vocabulary.model';

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

    const entries$ = this.authService.isAuthenticated().pipe(
      take(1),
      filter((isAuth) => isAuth),
      switchMap(() => this.item.owningCollection.pipe(
        getFirstSucceededRemoteDataPayload(),
      )),
      switchMap((collection: Collection) => {
        const vocabularyOptions = new VocabularyOptions(null, this.field.metadata, collection.uuid);
        return this.vocabularyService.searchVocabularyByMetadataAndCollection(vocabularyOptions).pipe(
          getFirstSucceededRemoteDataPayload(),
          mergeMap((vocabulary: Vocabulary) => {
            vocabularyOptions.name = vocabulary.name;
            return from(itemsToBeRendered).pipe(
              mergeMap((metadataValue) => {
                return this.vocabularyService.getVocabularyEntryByValue(metadataValue, vocabularyOptions).pipe(
                  map((entry) => entry.display)
                );
              }),
              reduce((acc: any, value: any) => [...acc, value], []),
            );
          })
        );
      })
    );
    const initValues$ = interval(5000).pipe(mapTo(itemsToBeRendered));

    race([entries$, initValues$]).pipe(take(1))
      .subscribe((values: string[]) => {
        this.values.next(values);
      });

  }

}
