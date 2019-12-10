import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormArrayComponent,
  DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormControlCustomEvent,
  DynamicFormControlEvent, DynamicFormControlModel,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormService,
  DynamicFormValidationService,
  DynamicTemplateDirective
} from '@ng-dynamic-forms/core';
import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { RelationshipService } from '../../../../../../core/data/relationship.service';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { Relationship } from '../../../../../../core/shared/item-relationships/relationship.model';
import { Item } from '../../../../../../core/shared/item.model';
import { MetadataValue } from '../../../../../../core/shared/metadata.models';
import {
  getAllSucceededRemoteData,
  getRemoteDataPayload, getSucceededRemoteData
} from '../../../../../../core/shared/operators';
import { SubmissionObject } from '../../../../../../core/submission/models/submission-object.model';
import { SubmissionObjectDataService } from '../../../../../../core/submission/submission-object-data.service';
import { hasValue, isNotEmpty } from '../../../../../empty.util';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import {
  Reorderable, ReorderableMetadataValue,
  ReorderableRelationship
} from '../../existing-metadata-list-element/existing-metadata-list-element.component';
import { DynamicConcatModel } from '../ds-dynamic-concat.model';
import { DynamicRowArrayModel } from '../ds-dynamic-row-array-model';

@Component({
  selector: 'ds-dynamic-form-array',
  templateUrl: './dynamic-form-array.component.html'
})
export class DsDynamicFormArrayComponent extends DynamicFormArrayComponent implements OnInit {

  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicRowArrayModel;
  @Input() templates: QueryList<DynamicTemplateDirective> | undefined;

  /* tslint:disable:no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('ngbEvent') customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();

  private submissionItem: Item;
  private reorderables: Reorderable[];

  /* tslint:enable:no-output-rename */

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              protected relationshipService: RelationshipService,
              protected submissionObjectService: SubmissionObjectDataService,
              protected zone: NgZone,
              protected formService: DynamicFormService
  ) {
    super(layoutService, validationService);
  }

  ngOnInit(): void {
    console.log(this.model);
    this.submissionObjectService
      .findById(this.model.submissionId).pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      switchMap((submissionObject: SubmissionObject) => (submissionObject.item as Observable<RemoteData<Item>>)
        .pipe(
          getSucceededRemoteData(),
          getRemoteDataPayload()
        )
      )
    ).subscribe((item) => this.submissionItem = item);

    this.updateReorderables();
  }

  private updateReorderables(): void  {
    const reorderable$arr: Array<Observable<Reorderable>> = this.model.groups
      .slice(1) // disregard the first group, it is always empty to ensure the first field remains empty
      .map((group: DynamicFormArrayGroupModel, index: number) => {
        const formFieldMetadataValue: FormFieldMetadataValueObject = (group.group[0] as DynamicConcatModel).value as FormFieldMetadataValueObject;
        if (hasValue(formFieldMetadataValue)) {
          const value = Object.assign(new MetadataValue(), {
            value: formFieldMetadataValue.display,
            language: formFieldMetadataValue.language,
            place: formFieldMetadataValue.place,
            authority: formFieldMetadataValue.authority,
            confidence: formFieldMetadataValue.confidence
          });
          if (value.isVirtual) {
            return this.relationshipService.findById(value.virtualValue)
              .pipe(
                getSucceededRemoteData(),
                getRemoteDataPayload(),
                switchMap((relationship: Relationship) =>
                  relationship.leftItem.pipe(
                    getSucceededRemoteData(),
                    getRemoteDataPayload(),
                    map((leftItem: Item) => {
                      return new ReorderableRelationship(
                        relationship,
                        leftItem.uuid !== this.submissionItem.uuid,
                        index,
                        index
                      );
                    }),
                  )
                )
              );
          } else {
            return observableOf(new ReorderableMetadataValue(value, index, index));
          }
        } else {
          const value = Object.assign(new MetadataValue(), {
            value: '',
            place: index,
          });
          return observableOf(new ReorderableMetadataValue(value, index, index));
        }
      });

    observableCombineLatest(reorderable$arr)
      .subscribe((reorderables: Reorderable[]) => {
        if (isNotEmpty(this.reorderables)) {
          reorderables.forEach((newReorderable: Reorderable) => {
            const match = this.reorderables.find((reo: Reorderable) => reo.getId() === newReorderable.getId());
            if (hasValue(match)) {
              newReorderable.oldIndex = match.newIndex;
            }
          })
        }
        this.reorderables = reorderables;
        console.log('this.reorderables', this.reorderables);
      });
  }

  moveSelection(event: CdkDragDrop<Relationship>) {
    this.model.moveGroup(event.previousIndex,event.currentIndex - event.previousIndex);
    this.updateReorderables();

    // this.zone.runOutsideAngular(() => {

      // return observableCombineLatest(reorderables.map((rel: ReorderableRelationship) => {
      //     if (rel.oldIndex !== rel.newIndex) {
      //       return this.relationshipService.updatePlace(rel);
      //     } else {
      //       return observableOf(undefined);
      //     }
      //   })
      // ).pipe(getSucceededRemoteData()).subscribe();
    // })
  }

}
