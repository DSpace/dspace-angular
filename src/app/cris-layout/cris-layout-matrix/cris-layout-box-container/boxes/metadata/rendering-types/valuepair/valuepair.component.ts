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
export class ValuepairComponent extends RenderingTypeValueModelComponent implements OnInit {

  /**
   * list of values
   */
  value$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('metadataValueProvider') public metadataValueProvider: any,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected translateService: TranslateService,
    protected vocabularyService: VocabularyService,
    protected authService: AuthService
  ) {
    super(fieldProvider, itemProvider, metadataValueProvider, renderingSubTypeProvider, translateService);
  }

  ngOnInit(): void {
    const entry$ = this.vocabularyService.getPublicVocabularyEntryByValue('common_iso_languages', this.metadataValue.value).pipe(
      getFirstSucceededRemoteDataPayload(),
      getPaginatedListPayload(),
      map((res) => res[0]?.display ?? this.metadataValue.value),
    );

    const initValue$ = interval(5000).pipe(mapTo(this.metadataValue.value));

    race([entry$, initValue$]).pipe(take(1)).subscribe((value: string) => {
      this.value$.next(value);
    });

  }

}
