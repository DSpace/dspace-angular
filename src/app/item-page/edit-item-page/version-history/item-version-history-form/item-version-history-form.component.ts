import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getFirstSucceededRemoteData } from '../../../../core/shared/operators';
import { VersionDataService } from '../../../../core/data/version-data.service';
import { take } from 'rxjs/operators';
import { DynamicFormControlModel, DynamicFormLayout, DynamicInputModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ds-item-version-history-edit',
  templateUrl: './item-version-history-form.component.html',
  styleUrls: ['./item-version-history-form.component.scss']
})
export class ItemVersionHistoryFormComponent implements OnInit {

  versionId;

  itemId;

  itemVersion: DynamicInputModel;

  formId = 'item-version-form';
  formModel: DynamicFormControlModel[];
  formGroup: FormGroup;
  formLayout: DynamicFormLayout = {
    itemVersion: {
      grid: {
        host: 'row'
      }
    },
  };


  constructor(private route: ActivatedRoute, private versionDataService: VersionDataService) {
  }

  ngOnInit(): void {

    this.versionId = this.route.snapshot.params.versionId;

    console.log(this.route.snapshot.params);



    this.itemVersion = new DynamicInputModel({
      id: 'groupName',
      label: 'item version label',
      name: 'itemVersion',
      validators: {
        required: null,
      },
      required: true,
    });


    this.formModel = [
      this.itemVersion,
    ];

    /*this.versionDataService.findById(this.versionId).pipe(getFirstSucceededRemoteData()).subscribe(
      (res) => {
        this.versionDataService.update()
        const updatedVersion =
          Object.assign({}, res.payload, {
            summary: 'New summary',
          });
        this.versionDataService.update(updatedVersion).pipe(take(1)).subscribe();
      }
    );*/ // TODO check not null


  }

}
