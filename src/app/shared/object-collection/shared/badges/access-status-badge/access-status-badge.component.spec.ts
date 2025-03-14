import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

import { AccessStatusDataService } from '../../../../../core/data/access-status-data.service';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../remote-data.utils';
import { TruncatePipe } from '../../../../utils/truncate.pipe';
import { AccessStatusObject } from './access-status.model';
import { AccessStatusBadgeComponent } from './access-status-badge.component';

describe('ItemAccessStatusBadgeComponent', () => {
  let component: AccessStatusBadgeComponent;
  let fixture: ComponentFixture<AccessStatusBadgeComponent>;

  let unknownStatus: AccessStatusObject;
  let metadataOnlyStatus: AccessStatusObject;
  let openAccessStatus: AccessStatusObject;
  let embargoStatus: AccessStatusObject;
  let restrictedStatus: AccessStatusObject;

  let accessStatusDataService: AccessStatusDataService;

  let item: Item;
  let bitstream: Bitstream;

  function init() {
    unknownStatus = Object.assign(new AccessStatusObject(), {
      status: 'unknown',
    });

    metadataOnlyStatus = Object.assign(new AccessStatusObject(), {
      status: 'metadata.only',
    });

    openAccessStatus = Object.assign(new AccessStatusObject(), {
      status: 'open.access',
    });

    embargoStatus = Object.assign(new AccessStatusObject(), {
      status: 'embargo',
      embargoDate: '2050-01-01',
    });

    restrictedStatus = Object.assign(new AccessStatusObject(), {
      status: 'restricted',
    });

    accessStatusDataService = jasmine.createSpyObj('accessStatusDataService', {
      findItemAccessStatusFor: createSuccessfulRemoteDataObject$(unknownStatus),
    });

    item = Object.assign(new Item(), {
      uuid: 'item-uuid',
      type: 'item',
    });

    bitstream = Object.assign(new Bitstream(), {
      uuid: 'bitstream-uuid',
      type: 'bitstream',
    });
  }

  function initTestBed() {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), AccessStatusBadgeComponent, TruncatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AccessStatusDataService, useValue: accessStatusDataService },
      ],
    }).compileComponents();
  }

  function initFixtureAndComponentWithItem() {
    environment.item.showAccessStatuses = true;
    fixture = TestBed.createComponent(AccessStatusBadgeComponent);
    component = fixture.componentInstance;
    component.object = item;
    fixture.detectChanges();
    environment.item.showAccessStatuses = false;
  }

  function initFixtureAndComponentWithBitstream() {
    environment.item.bitstream.showAccessStatuses = true;
    fixture = TestBed.createComponent(AccessStatusBadgeComponent);
    component = fixture.componentInstance;
    component.object = bitstream;
    fixture.detectChanges();
    environment.item.bitstream.showAccessStatuses = false;
  }

  function lookForAccessStatusBadgeForItem(status: string) {
    const badge = fixture.debugElement.query(By.css('span.badge'));
    expect(badge.nativeElement.textContent).toEqual(`access-status.${status.toLowerCase()}.listelement.badge`);
  }

  function lookForAccessStatusBadgeForBitstream() {
    const badge = fixture.debugElement.query(By.css('span.badge'));
    expect(badge.nativeElement.textContent).toEqual(`embargo.listelement.badge`);
  }

  function lookForNoAccessStatusBadgeForBitstream() {
    const badge = fixture.debugElement.query(By.css('span.badge'));
    expect(badge.nativeElement.textContent).toEqual(``);
  }

  describe('init with Item', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponentWithItem();
    });
    it('should init the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('When the findItemAccessStatusFor method returns unknown with Item', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponentWithItem();
    });
    it('should show the unknown badge', () => {
      lookForAccessStatusBadgeForItem('unknown');
    });
  });

  describe('When the findItemAccessStatusFor method returns metadata.only with Item', () => {
    beforeEach(waitForAsync(() => {
      init();
      (accessStatusDataService.findItemAccessStatusFor as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$(metadataOnlyStatus));
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponentWithItem();
    });
    it('should show the metadata only badge', () => {
      lookForAccessStatusBadgeForItem('metadata.only');
    });
  });

  describe('When the findItemAccessStatusFor method returns open.access with Item', () => {
    beforeEach(waitForAsync(() => {
      init();
      (accessStatusDataService.findItemAccessStatusFor as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$(openAccessStatus));
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponentWithItem();
    });
    it('should show the open access badge', () => {
      lookForAccessStatusBadgeForItem('open.access');
    });
  });

  describe('When the findItemAccessStatusFor method returns embargo with Item', () => {
    beforeEach(waitForAsync(() => {
      init();
      (accessStatusDataService.findItemAccessStatusFor as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$(embargoStatus));
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponentWithItem();
    });
    it('should show the embargo badge', () => {
      lookForAccessStatusBadgeForItem('embargo');
    });
  });

  describe('When the findItemAccessStatusFor method returns restricted with Item', () => {
    beforeEach(waitForAsync(() => {
      init();
      (accessStatusDataService.findItemAccessStatusFor as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$(restrictedStatus));
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponentWithItem();
    });
    it('should show the restricted badge', () => {
      lookForAccessStatusBadgeForItem('restricted');
    });
  });

  describe('init with Bitstream', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponentWithBitstream();
    });
    it('should init the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('When the bitstream have no access status', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponentWithBitstream();
    });
    it('should not show the badge', () => {
      lookForNoAccessStatusBadgeForBitstream();
    });
  });

  describe('When the bitstream have an access status with no embargo date', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      bitstream.accessStatus = createSuccessfulRemoteDataObject$(openAccessStatus);
      initFixtureAndComponentWithBitstream();
    });
    it('should not show the badge', () => {
      lookForNoAccessStatusBadgeForBitstream();
    });
  });

  describe('When the bitstream have an access status with an embargo date', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      bitstream.accessStatus = createSuccessfulRemoteDataObject$(embargoStatus);
      initFixtureAndComponentWithBitstream();
    });
    it('should show the badge', () => {
      lookForAccessStatusBadgeForBitstream();
    });
  });
});
