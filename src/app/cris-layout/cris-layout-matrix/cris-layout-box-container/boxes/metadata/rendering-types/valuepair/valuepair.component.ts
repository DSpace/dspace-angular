import { Component, Inject, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, interval, race } from 'rxjs';
import { map, mapTo, take } from 'rxjs/operators';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { VocabularyService } from '../../../../../../../core/submission/vocabularies/vocabulary.service';
import {
  getFirstSucceededRemoteDataPayload,
  getPaginatedListPayload
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
    protected translateService: TranslateService,
    protected vocabularyService: VocabularyService,
    protected authService: AuthService
  ) {
    super(fieldProvider, itemProvider, metadataValueProvider, renderingSubTypeProvider, translateService);
  }

  ngOnInit(): void {

    const vocabularyName = this.renderingSubType;
    const authority = this.metadataValue.authority ? this.metadataValue.authority.split(':') : undefined;
    const isControlledVocabulary =  authority?.length > 1 && authority[0] === vocabularyName;
    const metadataValue = isControlledVocabulary ? authority[1] : this.metadataValue.value;

    const entry$ = this.vocabularyService.getPublicVocabularyEntryByValue(vocabularyName, metadataValue).pipe(
      getFirstSucceededRemoteDataPayload(),
      getPaginatedListPayload(),
      map((res) => res[0]?.display ?? this.metadataValue.value),
    );

    // fallback values to be shown if the display value cannot be retrieved
    const initValue$ = interval(5000).pipe(mapTo(this.metadataValue.value));

    race([entry$, initValue$]).pipe(take(1)).subscribe((value: string) => {
      this.value$.next(value);
    });

  }

}
