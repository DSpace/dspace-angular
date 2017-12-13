import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { SubmissionRestService } from '../submission-rest.service';
import { NormalizedWorkspaceItem } from '../models/normalized-workspaceitem.model';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';
import {Chips} from "../../shared/chips/chips.model";

@Component({
  selector: 'ds-submission-submit',
  styleUrls: ['./submission-submit.component.scss'],
  templateUrl: './submission-submit.component.html'
})

export class SubmissionSubmitComponent implements OnInit {
  autocompleteItems: any[] = [{display:"Italy", value: 0},
    {display:"Iran", value:1},
    {display:"Ireland", value:2},
    {display:"Israel", value:3},
    {display:"Usa", value:4},
    {display:"Uzbekistan", value:5},
    {display:"France", value:6},
    {display:"Iran", value:1},
    {display:"Ireland", value:2},
    {display:"Israel", value:3},
    {display:"Usa", value:4},
    {display:"Uzbekistan", value:5},
    {display:"France", value:6},
    {display:"Iran", value:1},
    {display:"Ireland", value:2},
    {display:"Israel", value:3},
    {display:"Usa", value:4},
    {display:"Uzbekistan", value:5},
    {display:"France", value:6},
    {display:"Iran", value:1},
    {display:"Ireland", value:2},
    {display:"Israel", value:3},
    {display:"Usa", value:4},
    {display:"Uzbekistan", value:5},
    {display:"France", value:6},
    {display:"Iran", value:1},
    {display:"Ireland", value:2},
    {display:"Israel", value:3},
    {display:"Usa", value:4},
    {display:"Uzbekistan", value:5},
    {display:"France", value:6}
  ];

  public model: any;
  public chips: Chips = new Chips(this.autocompleteItems);

  addToChips(item: any) {
    this.chips.add(item);
  }

  // search = (text$: Observable<string>) =>
  //   text$
  //     .debounceTime(200)
  //     .distinctUntilChanged()
  //     .map(term => term.length < 2 ? []
  //       : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  public collectionId: string;
  public submissionDefinition: SubmissionDefinitionsModel;
  public submissionId: string;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private restService: SubmissionRestService) {
    setTimeout(() => {
      this.chips.add({display: 'CIAOOO', value: 10});
    }, 5000);

  }

  ngOnInit() {
    this.restService.postToEndpoint('workspaceitems', {})
      .map((workspaceitems: NormalizedWorkspaceItem) => workspaceitems[0])
      .subscribe((workspaceitems: NormalizedWorkspaceItem) => {
        this.collectionId = workspaceitems.collection[0].id;
        this.submissionDefinition = workspaceitems.submissionDefinition[0];
        this.submissionId = workspaceitems.id;
        this.changeDetectorRef.detectChanges();
    });
  }

}
