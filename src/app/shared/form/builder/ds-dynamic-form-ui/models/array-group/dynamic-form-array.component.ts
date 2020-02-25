import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  QueryList
} from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  DynamicFormArrayComponent,
  DynamicFormArrayGroupModel,
  DynamicFormControlCustomEvent,
  DynamicFormControlEvent, DynamicFormControlEventType,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormService,
  DynamicFormValidationService,
  DynamicTemplateDirective
} from '@ng-dynamic-forms/core';
import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
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
import { hasNoValue, hasValue, isEmpty, isNotEmpty, isNull } from '../../../../../empty.util';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import {
  Reorderable,
  ReorderableFormFieldMetadataValue,
  ReorderableRelationship
} from '../../existing-metadata-list-element/existing-metadata-list-element.component';
import { DynamicConcatModel } from '../ds-dynamic-concat.model';
import { DynamicRowArrayModel } from '../ds-dynamic-row-array-model';
import { SaveSubmissionSectionFormSuccessAction } from '../../../../../../submission/objects/submission-objects.actions';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../../../../../../submission/submission.reducers';
import { ObjectCacheService } from '../../../../../../core/cache/object-cache.service';
import { RequestService } from '../../../../../../core/data/request.service';
import { SubmissionService } from '../../../../../../submission/submission.service';
import { AppState } from '../../../../../../app.reducer';
import { followLink } from '../../../../../utils/follow-link-config.model';

@Component({
  selector: 'ds-dynamic-form-array',
  templateUrl: './dynamic-form-array.component.html',
  styleUrls: ['./dynamic-form-array.component.scss']
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
  private reorderables: Reorderable[] = [];

  /* tslint:enable:no-output-rename */

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              protected relationshipService: RelationshipService,
              protected changeDetectorRef: ChangeDetectorRef,
              protected submissionObjectService: SubmissionObjectDataService,
              protected zone: NgZone,
              protected formService: DynamicFormService,
              private submissionService: SubmissionService,
              private store: Store<AppState>,
  ) {
    super(layoutService, validationService);
  }

  ngOnInit(): void {
    this.submissionObjectService
      .findById(this.model.submissionId, followLink('item')).pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      switchMap((submissionObject: SubmissionObject) => (submissionObject.item as Observable<RemoteData<Item>>)
        .pipe(
          getSucceededRemoteData(),
          getRemoteDataPayload()
        )
      )
    ).subscribe((item) => {
      this.submissionItem = item;
      this.updateReorderables(false);
    });

  }

  private updateReorderables(shouldPropagateChanges = true): void {
    this.zone.runOutsideAngular(() => {
      let groups = this.model.groups.map((group, index) => [group, (this.control as any).controls[index]]);
      groups = [...groups, groups[0]];
      const reorderable$arr: Array<Observable<Reorderable>> = groups
        .filter(([group, control], index) => index > 0 && hasValue((group.group[0] as any).value)) // disregard the first group, it is always empty to ensure the first field remains empty
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
              return this.relationshipService.findById(metadataValue.virtualValue, followLink('leftItem'))
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
                          this.store,
                          this.model.submissionId,
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
              return observableOf(new ReorderableFormFieldMetadataValue(formFieldMetadataValue, model as any, control as FormControl, group, index, index));
            }
          } else {
            formFieldMetadataValue = Object.assign(new FormFieldMetadataValueObject(), {
              value: '',
              display: '',
              place: index,
            });
            return observableOf(new ReorderableFormFieldMetadataValue(formFieldMetadataValue, model as any, control as FormControl, group, index, index));
          }
        });

      observableCombineLatest(reorderable$arr)
        .subscribe((reorderables: Reorderable[]) => {
          reorderables.forEach((newReorderable: Reorderable) => {
            const match = this.reorderables.find((reo: Reorderable) => reo.getId() === newReorderable.getId());
            if (hasValue(match)) {
              newReorderable.oldIndex = match.newIndex;
            } else {
              newReorderable.oldIndex = -1;
            }
          });

          this.reorderables = reorderables;

          if (shouldPropagateChanges) {
            const updatedReorderables: Array<Observable<any>> = [];
            let hasMetadataField = false;
            this.reorderables.forEach((reorderable: Reorderable, index: number) => {
              if (reorderable.hasMoved) {
                const prevIndex = reorderable.oldIndex;
                const updatedReorderable = reorderable.update().pipe(take(1));
                updatedReorderables.push(updatedReorderable);
                if (reorderable instanceof ReorderableFormFieldMetadataValue) {
                  hasMetadataField = true;
                  updatedReorderable.subscribe((v) => {
                    const reoMD = reorderable as ReorderableFormFieldMetadataValue;
                    const mdl = Object.assign({}, reoMD.model, { value: reoMD.metadataValue });
                    this.onChange({
                      $event: { previousIndex: prevIndex },
                      context: { index },
                      control: reoMD.control,
                      group: this.group,
                      model: mdl,
                      type: DynamicFormControlEventType.Change
                    });
                  });
                }
              }
            });

            observableCombineLatest(updatedReorderables).pipe(
            ).subscribe(() => {
              if (hasMetadataField && hasValue(this.model.relationshipConfig)) {
                // if it's a mix between entities and regular metadata fields,
                // we need to save after every operation, since they use different
                // endpoints and otherwise they'll get out of sync.
                this.submissionService.dispatchSave(this.model.submissionId);
              }
              this.changeDetectorRef.detectChanges();
            });
          }
        });
    })
  }

  moveSelection(event: CdkDragDrop<Relationship>) {
    this.model.moveGroup(event.previousIndex, event.currentIndex - event.previousIndex);
    this.updateReorderables();
  }
}
