import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Community } from '../../../core/shared/community.model';
import { RemoteData } from '../../../core/data/remote-data';

@Component({
  selector: 'ds-community-selector-modal-wrapper',
  // styleUrls: ['./community-selector.component.scss'],
  templateUrl: './community-selector-modal-wrapper.component.html',
})
export class CommunitySelectorModalWrapperComponent implements OnInit {
  @Input() communityRD: RemoteData<Community>;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.communityRD = this.route.root.firstChild.firstChild.snapshot.data.community;
  }
}
