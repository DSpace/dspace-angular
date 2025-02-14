import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import { JsonPatchOperationPathCombiner } from 'src/app/core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from 'src/app/core/json-patch/builder/json-patch-operations-builder';

import { SectionUploadService } from './section-upload.service';

const jsonPatchOpBuilder: any = jasmine.createSpyObj('jsonPatchOpBuilder', {
  add: jasmine.createSpy('add'),
  replace: jasmine.createSpy('replace'),
  remove: jasmine.createSpy('remove'),
});

describe('SectionUploadService test suite', () => {
  let sectionUploadService: SectionUploadService;
  let operationsBuilder: any;
  const pathCombiner = new JsonPatchOperationPathCombiner('sections', 'upload');
  const primaryPath = pathCombiner.getPath('primary');
  const fileId = 'test';
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule],
      providers: [
        { provide: Store, useValue: {} },
        SectionUploadService,
        { provide: JsonPatchOperationsBuilder, useValue: jsonPatchOpBuilder },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  beforeEach(() => {
    sectionUploadService = TestBed.inject(SectionUploadService);
    operationsBuilder = TestBed.inject(JsonPatchOperationsBuilder);
  });

  [
    {
      initialPrimary: null,
      primary: true,
      operationName: 'add',
      expected: [primaryPath, fileId, false, true],
    },
    {
      initialPrimary: true,
      primary: false,
      operationName: 'remove',
      expected: [primaryPath],
    },
    {
      initialPrimary: false,
      primary: true,
      operationName: 'replace',
      expected: [primaryPath,  fileId, true],
    },
  ].forEach(({ initialPrimary, primary, operationName, expected }) => {
    it(`updatePrimaryBitstreamOperation should add ${operationName} operation`, () => {
      const path = pathCombiner.getPath('primary');
      sectionUploadService.updatePrimaryBitstreamOperation(path, initialPrimary, primary, fileId);
      expect(operationsBuilder[operationName]).toHaveBeenCalledWith(...expected);
    });
  });
});
