import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'ds-item-version-history-edit',
  templateUrl: './item-version-history-edit.component.html',
  styleUrls: ['./item-version-history-edit.component.scss']
})
export class ItemVersionHistoryEditComponent implements OnInit {

  versionId;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.versionId = this.route.snapshot.params.versionId;
  }

}
