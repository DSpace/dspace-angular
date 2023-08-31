import { TestBed } from '@angular/core/testing';

import { MetadataSchemaExportService } from './metadata-schema-export.service';

describe('MetadataSchemaExportService', () => {
  let service: MetadataSchemaExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetadataSchemaExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
