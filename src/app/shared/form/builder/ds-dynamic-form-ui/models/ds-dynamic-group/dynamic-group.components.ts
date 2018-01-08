import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DynamicGroupModel} from './dynamic-group.model';
import {FormGroup} from '@angular/forms';
import {FormBuilderService} from '../../../form-builder.service';
import {DynamicFormControlModel, DynamicFormGroupModel, DynamicInputModel} from '@ng-dynamic-forms/core';
import {SubmissionFormsModel} from '../../../../../../core/shared/config/config-submission-forms.model';
import {AuthorityModel} from '../../../../../../core/integration/models/authority.model';
import {IntegrationSearchOptions} from '../../../../../../core/integration/models/integration-options.model';
import {DynamicTypeaheadModel} from '../typeahead/dynamic-typeahead.model';

const AUTHOR_KEY = 'dc_contributor_author';
const ORCID_KEY = 'local_contributor_orcid';
const AFFILIATION_KEY = 'local_contributor_affiliation';

const DOT_AUTHOR_KEY = 'dc.contributor.author';
const DOT_ORCID_KEY = 'local.contributor.orcid';
const DOT_AFFILIATION_KEY = 'local.contributor.affiliation';

@Component({
  selector: 'ds-dynamic-group',
  templateUrl: './dynamic-group.component.html',
})
export class DsDynamicGroupComponent implements OnInit {

  public formModel: DynamicFormControlModel[];
  public formModelRow: DynamicFormGroupModel;
  public editMode = false;

  @Input() formId: string;
  @Input() model: DynamicGroupModel;
  @Input() group: FormGroup;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  author: DynamicTypeaheadModel;
  orcId: DynamicInputModel;
  affiliation: DynamicInputModel;

  constructor(private formBuilderService: FormBuilderService) {
  }

  ngOnInit() {
    console.log('FormConfiguration...');
    console.log(this.model.formConfiguration);
    const config = {rows: this.model.formConfiguration} as SubmissionFormsModel;
    this.formModel = this.formBuilderService.modelFromConfiguration(config, {});
    this.formModelRow = this.formModel[0] as DynamicGroupModel;

    this.author = (this.formModelRow as DynamicFormGroupModel).group[0] as DynamicTypeaheadModel;
    this.orcId = (this.formModelRow as DynamicFormGroupModel).group[1] as DynamicInputModel;
    this.affiliation = (this.formModelRow as DynamicFormGroupModel).group[2] as DynamicInputModel;

    // const withAuthority = this.model.authorityName && this.model.authorityName.length > 0;
    // if (withAuthority) {
    //   this.searchOptions = new IntegrationSearchOptions(
    //     this.model.authorityScope,
    //     this.model.authorityName,
    //     this.model.authorityMetadata);
    // }

    this.model.storedValue = [];

    if (this.model.storedValue && this.model.storedValue.length > 0) {
      // Values found in edit
      this.model.storedValue.forEach((v) => {
        let item;
        // if (withAuthority) {
        item = {
          id: v.authority || v.value,
          value: v.value,
          display: v.value
        } as AuthorityModel;
        // }
        // else {
        //   item = v.value;
        // }
        this.model.chips.add(item);
      });
    }
  }

  addChips(event) {
    const placeHolder = '#PLACEHOLDER_PARENT_METADATA_VALUE#';
    console.log(this.author);

    const authorValue = this.author.value;
    const orcIdValue = this.orcId.value || placeHolder;
    const affiliationValue = this.affiliation.value || placeHolder;

    console.log('add Chips... orcId:' + orcIdValue + ' affiliation:' + affiliationValue + ' author...');
    console.log(authorValue);

    const item = {
      'dc.contributor.author': authorValue,
      'local.contributor.orcid': orcIdValue || placeHolder,
      'local.contributor.affiliation': affiliationValue || placeHolder,
    };

    this.model.chips.add(item);
    this.change.emit(event);

    setTimeout(() => {
      // Reset the input text after x ms, mandatory or the formatter overwrite it
      const keys = Object.keys(this.group.controls);
      console.log(keys); // df-row-group-config-18
      (this.group.controls[keys[0]] as FormGroup).controls[AUTHOR_KEY].patchValue(null);
      this.group.reset();
    }, 50);

    // console.log(this.model.chips.getItems());
  }

  chipsSelected(event) {
    console.log('Selected chips : ' + JSON.stringify(this.model.chips.chipsItems[event]));
    console.log(event);
    ((this.model.group[0] as DynamicFormGroupModel).group[1] as DynamicInputModel).value = this.model.chips.chipsItems[event].item['local.contributor.orcid'];
    this.author.value = this.model.chips.chipsItems[event].item[DOT_AUTHOR_KEY];
    this.orcId.value = this.model.chips.chipsItems[event].item[DOT_ORCID_KEY];
    this.affiliation.value = this.model.chips.chipsItems[event].item[DOT_AFFILIATION_KEY];

    // PatchValue
    const keys = Object.keys(this.group.controls);
    console.log(keys);
    (this.group.controls[keys[0]] as FormGroup).controls[AUTHOR_KEY].patchValue(this.author.value);
    (this.group.controls[keys[0]] as FormGroup).controls[ORCID_KEY].patchValue(this.orcId.value);
    (this.group.controls[keys[0]] as FormGroup).controls[AFFILIATION_KEY].patchValue(this.affiliation.value);

    // Add is now change
    this.editMode = true;

  }

  exitEditMode() {
    this.editMode = false;
  }

  mofifyChips(){

  }

  removeChips(event) {
    // console.log("Removed chips index: "+event);
  }

  onBlur(event) {
    this.blur.emit(event);
  }

  onChange(event) {
    // AuthorityModel
    // display: "Salz, Dirk"
    // id: "no2015021623"
    // value: "Salz, Dirk"
    console.log(event);
    console.log(event.$event);
    this.change.emit(event);
  }

  onFocus(event) {
    this.focus.emit(event);
  }

  // onRemoveItem(event) {
  // }
  //
  // onAddItem(event) {
  // }

}
