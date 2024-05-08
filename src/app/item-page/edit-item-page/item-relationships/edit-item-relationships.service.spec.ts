import { TestBed } from '@angular/core/testing';

import { EditItemRelationshipsService } from './edit-item-relationships.service';

describe('EditItemRelationshipsService', () => {
  let service: EditItemRelationshipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditItemRelationshipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
