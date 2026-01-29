import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ServerResponseService } from '@dspace/core/services/server-response.service';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ObjectNotFoundComponent } from './objectnotfound.component';

describe('ObjectNotFoundComponent', () => {
  let comp: ObjectNotFoundComponent;
  let fixture: ComponentFixture<ObjectNotFoundComponent>;
  const testUUID = '34cfed7c-f597-49ef-9cbe-ea351f0023c2';
  const uuidType = 'uuid';
  const handlePrefix = '123456789';
  const handleId = '22';
  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: of({ id: testUUID, idType: uuidType }),
  });
  const serverResponseServiceStub = jasmine.createSpyObj('ServerResponseService', {
    setNotFound: jasmine.createSpy('setNotFound'),
  });

  const activatedRouteStubHandle = Object.assign(new ActivatedRouteStub(), {
    params: of({ id: handleId, idType: handlePrefix }),
  });
  describe('uuid request', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot(),
          ObjectNotFoundComponent,
        ], providers: [
          { provide: ServerResponseService, useValue: serverResponseServiceStub } ,
          { provide: ActivatedRoute, useValue: activatedRouteStub },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ObjectNotFoundComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create instance', () => {
      expect(comp).toBeDefined();
    });

    it('should have id and idType', () => {
      expect(comp.id).toEqual(testUUID);
      expect(comp.idType).toEqual(uuidType);
      expect(comp.missingItem).toEqual('uuid: ' + testUUID);
    });

    it('should call serverResponseService.setNotFound', () => {
      expect(serverResponseServiceStub.setNotFound).toHaveBeenCalled();
    });
  });

  describe( 'legacy handle request', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot(),
          ObjectNotFoundComponent,
        ], providers: [
          { provide: ServerResponseService, useValue: serverResponseServiceStub },
          { provide: ActivatedRoute, useValue: activatedRouteStubHandle },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ObjectNotFoundComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should have handle prefix and id', () => {
      expect(comp.id).toEqual(handleId);
      expect(comp.idType).toEqual(handlePrefix);
      expect(comp.missingItem).toEqual('handle: ' + handlePrefix + '/' + handleId);
    });

    it('should call serverResponseService.setNotFound', () => {
      expect(serverResponseServiceStub.setNotFound).toHaveBeenCalled();
    });
  });

});
