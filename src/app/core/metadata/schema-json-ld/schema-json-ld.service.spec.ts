import { TestBed } from '@angular/core/testing';

import { SchemaJsonLDService } from './schema-json-ld.service';

describe('SchemaJsonLDService', () => {
  let service: SchemaJsonLDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchemaJsonLDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
