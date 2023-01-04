import { TestBed } from '@angular/core/testing';

import { ContextHelpService } from './context-help.service';

describe('ContextHelpService', () => {
  let service: ContextHelpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextHelpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
