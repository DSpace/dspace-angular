import { Item } from '../../../core/shared/item.model';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TruncatePipe } from '../../utils/truncate.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AccessStatusBadgeComponent } from './access-status-badge.component';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { By } from '@angular/platform-browser';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { AccessStatusObject } from './access-status.model';

describe('ItemAccessStatusBadgeComponent', () => {
  let component: AccessStatusBadgeComponent;
  let fixture: ComponentFixture<AccessStatusBadgeComponent>;

  let unknownStatus: AccessStatusObject;
  let metadataOnlyStatus: AccessStatusObject;
  let openAccessStatus: AccessStatusObject;
  let embargoStatus: AccessStatusObject;
  let restrictedStatus: AccessStatusObject;

  let itemDataService: ItemDataService;

  let item: Item;

  function init() {
    unknownStatus = Object.assign(new AccessStatusObject(), {
      status: 'unknown'
    });

    metadataOnlyStatus = Object.assign(new AccessStatusObject(), {
      status: 'metadata.only'
    });

    openAccessStatus = Object.assign(new AccessStatusObject(), {
      status: 'open.access'
    });

    embargoStatus = Object.assign(new AccessStatusObject(), {
      status: 'embargo'
    });

    restrictedStatus = Object.assign(new AccessStatusObject(), {
      status: 'restricted'
    });

    itemDataService = jasmine.createSpyObj('itemDataService', {
      getAccessStatus: createSuccessfulRemoteDataObject$(unknownStatus)
    });

    item = Object.assign(new Item(), {
      uuid: 'item-uuid'
    });
  }

  function initTestBed() {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [AccessStatusBadgeComponent, TruncatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {provide: ItemDataService, useValue: itemDataService}
      ]
    }).compileComponents();
  }

  function initFixtureAndComponent() {
    fixture = TestBed.createComponent(AccessStatusBadgeComponent);
    component = fixture.componentInstance;
    component.uuid = item.uuid;
    fixture.detectChanges();
  }

  function lookForAccessStatusBadge(status: string) {
    const badge = fixture.debugElement.query(By.css('span.badge'));
    expect(badge.nativeElement.textContent).toEqual(`access-status.${status.toLowerCase()}.listelement.badge`);
  }

  describe('init', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponent();
    });
    it('should init the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('When the getAccessStatus method returns unknown', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponent();
    });
    it('should show the unknown badge', () => {
      lookForAccessStatusBadge('unknown');
    });
  });

  describe('When the getAccessStatus method returns metadata.only', () => {
    beforeEach(waitForAsync(() => {
      init();
      (itemDataService.getAccessStatus as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$(metadataOnlyStatus));
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponent();
    });
    it('should show the metadata only badge', () => {
      lookForAccessStatusBadge('metadata.only');
    });
  });

  describe('When the getAccessStatus method returns open.access', () => {
    beforeEach(waitForAsync(() => {
      init();
      (itemDataService.getAccessStatus as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$(openAccessStatus));
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponent();
    });
    it('should show the open access badge', () => {
      lookForAccessStatusBadge('open.access');
    });
  });

  describe('When the getAccessStatus method returns embargo', () => {
    beforeEach(waitForAsync(() => {
      init();
      (itemDataService.getAccessStatus as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$(embargoStatus));
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponent();
    });
    it('should show the embargo badge', () => {
      lookForAccessStatusBadge('embargo');
    });
  });

  describe('When the getAccessStatus method returns restricted', () => {
    beforeEach(waitForAsync(() => {
      init();
      (itemDataService.getAccessStatus as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$(restrictedStatus));
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponent();
    });
    it('should show the restricted badge', () => {
      lookForAccessStatusBadge('restricted');
    });
  });
});
