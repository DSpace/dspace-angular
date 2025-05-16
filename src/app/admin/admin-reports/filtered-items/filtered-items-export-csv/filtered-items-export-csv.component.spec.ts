import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { ScriptDataService } from '../../../../core/data/processes/script-data.service';
import { getProcessDetailRoute } from '../../../../process-page/process-page-routing.paths';
import { Process } from '../../../../process-page/processes/process.model';
import { Script } from '../../../../process-page/scripts/script.model';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service.stub';
import { FiltersComponent } from '../../filters-section/filters-section.component';
import { OptionVO } from '../option-vo.model';
import { QueryPredicate } from '../query-predicate.model';
import { FilteredItemsExportCsvComponent } from './filtered-items-export-csv.component';

describe('FilteredItemsExportCsvComponent', () => {
  let component: FilteredItemsExportCsvComponent;
  let fixture: ComponentFixture<FilteredItemsExportCsvComponent>;

  let scriptDataService: ScriptDataService;
  let authorizationDataService: AuthorizationDataService;
  let notificationsService;
  let router;

  const script = Object.assign(new Script(), { id: 'metadata-export-filtered-items-report', name: 'metadata-export-filtered-items-report' });
  const process = Object.assign(new Process(), { processId: 5, scriptName: 'metadata-export-filtered-items-report' });

  const params = new FormGroup({
    collections: new FormControl([OptionVO.collection('1', 'coll1')]),
    queryPredicates: new FormControl([QueryPredicate.of('name', 'equals', 'coll1')]),
    filters: new FormControl([FiltersComponent.getFilter('is_item')]),
  });

  const emptyParams = new FormGroup({
    collections: new FormControl([]),
    queryPredicates: new FormControl([]),
    filters: new FormControl([]),
  });

  function initBeforeEachAsync() {
    scriptDataService = jasmine.createSpyObj('scriptDataService', {
      findById: createSuccessfulRemoteDataObject$(script),
      invoke: createSuccessfulRemoteDataObject$(process),
    });
    authorizationDataService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });

    notificationsService = new NotificationsServiceStub();

    router = jasmine.createSpyObj('authorizationService', ['navigateByUrl']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NgbModule, FilteredItemsExportCsvComponent],
      providers: [
        { provide: ScriptDataService, useValue: scriptDataService },
        { provide: AuthorizationDataService, useValue: authorizationDataService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  }

  function initBeforeEach() {
    fixture = TestBed.createComponent(FilteredItemsExportCsvComponent);
    component = fixture.componentInstance;
    component.reportParams = params;
    fixture.detectChanges();
  }

  describe('init', () => {
    describe('comp', () => {
      beforeEach(waitForAsync(() => {
        initBeforeEachAsync();
      }));
      beforeEach(() => {
        initBeforeEach();
      });
      it('should init the comp', () => {
        expect(component).toBeTruthy();
      });
    });
    describe('when the user is an admin and the metadata-export-filtered-items-report script is present ', () => {
      beforeEach(waitForAsync(() => {
        initBeforeEachAsync();
      }));
      beforeEach(() => {
        initBeforeEach();
      });
      it('should add the button', () => {
        const debugElement = fixture.debugElement.query(By.css('button.export-button'));
        expect(debugElement).toBeDefined();
      });
    });
    describe('when the user is not an admin', () => {
      beforeEach(waitForAsync(() => {
        initBeforeEachAsync();
        (authorizationDataService.isAuthorized as jasmine.Spy).and.returnValue(of(false));
      }));
      beforeEach(() => {
        initBeforeEach();
      });
      it('should not add the button', () => {
        const debugElement = fixture.debugElement.query(By.css('button.export-button'));
        expect(debugElement).toBeNull();
      });
    });
    describe('when the metadata-export-filtered-items-report script is not present', () => {
      beforeEach(waitForAsync(() => {
        initBeforeEachAsync();
        (scriptDataService.findById as jasmine.Spy).and.returnValue(createFailedRemoteDataObject$('Not found', 404));
      }));
      beforeEach(() => {
        initBeforeEach();
      });
      it('should should not add the button', () => {
        const debugElement = fixture.debugElement.query(By.css('button.export-button'));
        expect(debugElement).toBeNull();
      });
    });
  });
  describe('export', () => {
    beforeEach(waitForAsync(() => {
      initBeforeEachAsync();
    }));
    beforeEach(() => {
      initBeforeEach();
    });
    it('should call the invoke script method with the correct parameters', () => {
      // Parameterized export
      component.export();
      expect(scriptDataService.invoke).toHaveBeenCalledWith('metadata-export-filtered-items-report',
        [
          { name: '-c', value: params.value.collections[0].id },
          { name: '-qp', value: QueryPredicate.toString(params.value.queryPredicates[0]) },
          { name: '-f', value: FiltersComponent.toQueryString(params.value.filters) },
        ], []);

      fixture.detectChanges();

      // Non-parameterized export
      component.reportParams = emptyParams;
      fixture.detectChanges();
      component.export();
      expect(scriptDataService.invoke).toHaveBeenCalledWith('metadata-export-filtered-items-report', [], []);

    });
    it('should show a success message when the script was invoked successfully and redirect to the corresponding process page', () => {
      component.export();

      expect(notificationsService.success).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(getProcessDetailRoute(process.processId));
    });
    it('should show an error message when the script was not invoked successfully and stay on the current page', () => {
      (scriptDataService.invoke as jasmine.Spy).and.returnValue(createFailedRemoteDataObject$('Error', 500));

      component.export();

      expect(notificationsService.error).toHaveBeenCalled();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });
  describe('clicking the button', () => {
    beforeEach(waitForAsync(() => {
      initBeforeEachAsync();
    }));
    beforeEach(() => {
      initBeforeEach();
    });
    it('should trigger the export function', () => {
      spyOn(component, 'export');

      const debugElement = fixture.debugElement.query(By.css('button.export-button'));
      debugElement.triggerEventHandler('click', null);

      expect(component.export).toHaveBeenCalled();
    });
  });
});
