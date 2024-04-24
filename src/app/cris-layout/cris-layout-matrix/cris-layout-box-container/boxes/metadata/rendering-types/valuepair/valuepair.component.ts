import { Component, Inject, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { VocabularyService } from '../../../../../../../core/submission/vocabularies/vocabulary.service';
import {
  getFirstCompletedRemoteData,
  getPaginatedListPayload,
  getRemoteDataPayload
} from '../../../../../../../core/shared/operators';
import { AuthService } from '../../../../../../../core/auth/auth.service';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';

/**
 * This component renders the valuepair (value + display) metadata fields.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-valuepair]',
  templateUrl: './valuepair.component.html',
  styleUrls: ['./valuepair.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.VALUEPAIR)
export class ValuepairComponent extends RenderingTypeValueModelComponent implements OnInit {

  /**
   * list of values
   */
  value$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('metadataValueProvider') public metadataValueProvider: MetadataValue,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected translateService: TranslateService,
    protected vocabularyService: VocabularyService,
    protected authService: AuthService
  ) {
    super(fieldProvider, itemProvider, metadataValueProvider, renderingSubTypeProvider, tabNameProvider, translateService);
  }

  ngOnInit(): void {

    const vocabularyName = this.renderingSubType;
    const authority = this.metadataValue.authority ? this.metadataValue.authority.split(':') : undefined;
    const isControlledVocabulary = authority?.length > 1 && authority[0] === vocabularyName;

    let vocabularyEntry$ = isControlledVocabulary ?
      this.vocabularyService.getPublicVocabularyEntryByID(vocabularyName, this.metadataValue.authority) :
      this.vocabularyService.getPublicVocabularyEntryByValue(vocabularyName, this.metadataValue.value);

    vocabularyEntry$.pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      getPaginatedListPayload(),
      map((res) => res?.length > 0 ? res[0] : null),
      map((res) => res?.display ?? this.metadataValue.value),
      take(1)
    ).subscribe(value => this.value$.next(value));

  }

}
