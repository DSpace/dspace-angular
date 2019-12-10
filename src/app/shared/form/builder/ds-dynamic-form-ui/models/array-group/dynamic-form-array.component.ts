import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, QueryList } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  DynamicFormArrayComponent,
  DynamicFormArrayGroupModel,
  DynamicFormControlCustomEvent,
  DynamicFormControlEvent,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormService,
  DynamicFormValidationService,
  DynamicTemplateDirective
} from '@ng-dynamic-forms/core';
import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { RelationshipService } from '../../../../../../core/data/relationship.service';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { Relationship } from '../../../../../../core/shared/item-relationships/relationship.model';
import { Item } from '../../../../../../core/shared/item.model';
import { MetadataValue } from '../../../../../../core/shared/metadata.models';
import {
  getRemoteDataPayload,
  getSucceededRemoteData
} from '../../../../../../core/shared/operators';
import { SubmissionObject } from '../../../../../../core/submission/models/submission-object.model';
import { SubmissionObjectDataService } from '../../../../../../core/submission/submission-object-data.service';
import { hasValue, isNotEmpty } from '../../../../../empty.util';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import {
  Reorderable,
  ReorderableFormFieldMetadataValue,
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

  private updateReorderables(): void {
    this.zone.runOutsideAngular(() => {
      const reorderable$arr: Array<Observable<Reorderable>> = this.model.groups
        .map((group, index) => [group, (this.control as any).controls[index]])
        .slice(1) // disregard the first group, it is always empty to ensure the first field remains empty
        .map(([group, control]: [DynamicFormArrayGroupModel, AbstractControl], index: number) => {
          const model = group.group[0] as DynamicConcatModel;
          let formFieldMetadataValue: FormFieldMetadataValueObject = model.value as FormFieldMetadataValueObject;
          if (hasValue(formFieldMetadataValue)) {
            const metadataValue = Object.assign(new MetadataValue(), {
              value: formFieldMetadataValue.display,
              language: formFieldMetadataValue.language,
              place: formFieldMetadataValue.place,
              authority: formFieldMetadataValue.authority,
              confidence: formFieldMetadataValue.confidence
            });
            if (metadataValue.isVirtual) {
              return this.relationshipService.findById(metadataValue.virtualValue)
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
                          this.relationshipService,
                          index,
                          index
                        );
                      }),
                    )
                  )
                );
            } else {
              if (typeof formFieldMetadataValue === 'string') {
                formFieldMetadataValue = Object.assign(new FormFieldMetadataValueObject(), {
                  value: formFieldMetadataValue,
                  display: formFieldMetadataValue,
                  place: index,
                });
              }
              return observableOf(new ReorderableFormFieldMetadataValue(formFieldMetadataValue, model as any, control as FormControl, index, index));
            }
          } else {
            formFieldMetadataValue = Object.assign(new FormFieldMetadataValueObject(), {
              value: '',
              display: '',
              place: index,
            });
            return observableOf(new ReorderableFormFieldMetadataValue(formFieldMetadataValue, model as any, control as FormControl, index, index));
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

          this.reorderables.forEach((reorderable: Reorderable) => {
            if (reorderable.hasMoved) {
              console.log('reorderable moved', reorderable, reorderable.getPlace());
              reorderable.update().pipe(take(1)).subscribe((v) => {
                console.log('reorderable updated', reorderable, reorderable.getPlace());
              });
            }
          })
        });
    })

  }

  moveSelection(event: CdkDragDrop<Relationship>) {
    this.model.moveGroup(event.previousIndex, event.currentIndex - event.previousIndex);
    this.updateReorderables();
  }

}
