import { Component, Input, OnInit } from '@angular/core';
import { DynamicGroupModel } from './dynamic-group.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ds-dynamic-group',
  templateUrl: './dynamic-group.component.html',
})
export class DsDynamicGroupComponent implements OnInit {

  @Input() model: DynamicGroupModel;
  @Input() group: FormGroup;

  ngOnInit() {
    console.log('DsDynamicGroupComponent init:\n', this.model, this.group);
  }

}
