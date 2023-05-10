import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ds-bulk-access-settings',
  templateUrl: './bulk-access-settings.component.html',
  styleUrls: ['./bulk-access-settings.component.scss']
})
export class BulkAccessSettingsComponent implements OnInit {

  /**
   * The selection list id
   */
  @Input() listId!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
