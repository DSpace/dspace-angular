import { TestBed } from '@angular/core/testing';

import { DataEntryDialogService } from './data-entry-dialog.service';

describe('DataEntryDialogService', () => {
  let service: DataEntryDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataEntryDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
