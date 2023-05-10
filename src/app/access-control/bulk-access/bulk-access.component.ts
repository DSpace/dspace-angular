import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ds-bulk-access',
  templateUrl: './bulk-access.component.html',
  styleUrls: ['./bulk-access.component.scss']
})
export class BulkAccessComponent implements OnInit {


  /**
   * The selection list id
   */
  listId: string = 'bulk-access-list';

  constructor() { }

  ngOnInit(): void {
  }

}
