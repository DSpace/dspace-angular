import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { LinkService } from 'src/app/core/cache/builders/link.service';
import { getMockLinkService } from 'src/app/shared/mocks/link-service.mock';
import { followLink } from 'src/app/shared/utils/follow-link-config.model';
import { APP_DATA_SERVICES_MAP } from 'src/config/app-config.interface';
import { environment } from 'src/environments/environment';

import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../remote-data.utils';
import { TruncatePipe } from '../../../../utils/truncate.pipe';
import { AccessStatusObject } from './access-status.model';
import { AccessStatusBadgeComponent } from './access-status-badge.component';

describe('AccessStatusBadgeComponent', () => {
  let component: AccessStatusBadgeComponent;
  let fixture: ComponentFixture<AccessStatusBadgeComponent>;

  let unknownStatus: AccessStatusObject;
  let metadataOnlyStatus: AccessStatusObject;
  let openAccessStatus: AccessStatusObject;
  let embargoStatus: AccessStatusObject;
  let restrictedStatus: AccessStatusObject;

  let linkService;

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

    linkService = getMockLinkService();

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
        { provide: LinkService, useValue: linkService },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
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
    expect(badge.nativeElement.textContent).toContain(`access-status.${status.toLowerCase()}.listelement.badge`);
  }

  function lookForAccessStatusBadgeForBitstream() {
    const badge = fixture.debugElement.query(By.css('span.badge'));
    expect(badge.nativeElement.textContent).toContain('embargo.listelement.badge');
  }

  function lookForNoAccessStatusBadgeForBitstream() {
    const badge = fixture.debugElement.query(By.css('span.badge'));
    expect(badge).toBeNull();
  }

  describe('init with item', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      item.accessStatus = createSuccessfulRemoteDataObject$(unknownStatus);
      initFixtureAndComponentWithItem();
    });
    it('should init the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('When the item have no accessStatus link', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      item.accessStatus = null;
      linkService.resolveLink.and.callFake((model: any) => {
        item.accessStatus = createSuccessfulRemoteDataObject$(embargoStatus);
        return model;
      });
      initFixtureAndComponentWithItem();
    });
    it('should show the embargo badge', () => {
      expect(linkService.resolveLink).toHaveBeenCalledWith(item, followLink('accessStatus'));
      lookForAccessStatusBadgeForItem('embargo');
    });
  });

  describe('When the item accessStatus link returns unknown', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      item.accessStatus = createSuccessfulRemoteDataObject$(unknownStatus);
      initFixtureAndComponentWithItem();
    });
    it('should show the unknown badge', () => {
      lookForAccessStatusBadgeForItem('unknown');
    });
  });

  describe('When the item accessStatus link returns metadata.only', () => {
    beforeEach(waitForAsync(() => {
      init();
      item.accessStatus = createSuccessfulRemoteDataObject$(metadataOnlyStatus);
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponentWithItem();
    });
    it('should show the metadata only badge', () => {
      lookForAccessStatusBadgeForItem('metadata.only');
    });
  });

  describe('When the item accessStatus link returns open.access', () => {
    beforeEach(waitForAsync(() => {
      init();
      item.accessStatus = createSuccessfulRemoteDataObject$(openAccessStatus);
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponentWithItem();
    });
    it('should show the open access badge', () => {
      lookForAccessStatusBadgeForItem('open.access');
    });
  });

  describe('When the item accessStatus link returns embargo', () => {
    beforeEach(waitForAsync(() => {
      init();
      item.accessStatus = createSuccessfulRemoteDataObject$(embargoStatus);
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponentWithItem();
    });
    it('should show the embargo badge', () => {
      lookForAccessStatusBadgeForItem('embargo');
    });
  });

  describe('When the item accessStatus link returns restricted', () => {
    beforeEach(waitForAsync(() => {
      init();
      item.accessStatus = createSuccessfulRemoteDataObject$(restrictedStatus);
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponentWithItem();
    });
    it('should show the restricted badge', () => {
      lookForAccessStatusBadgeForItem('restricted');
    });
  });

  describe('init with bitstream', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      bitstream.accessStatus = createSuccessfulRemoteDataObject$(unknownStatus);
      initFixtureAndComponentWithBitstream();
    });
    it('should init the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('When the bitstream have no accessStatus link', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      bitstream.accessStatus = null;
      linkService.resolveLink.and.callFake((model: any) => {
        bitstream.accessStatus = createSuccessfulRemoteDataObject$(embargoStatus);
        return model;
      });
      initFixtureAndComponentWithBitstream();
    });
    it('should show the badge', () => {
      expect(linkService.resolveLink).toHaveBeenCalledWith(bitstream, followLink('accessStatus'));
      lookForAccessStatusBadgeForBitstream();
    });
  });

  describe('When the bitstream have an accessStatus link with no embargo date', () => {
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

  describe('When the bitstream have an accessStatus link with an embargo date', () => {
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
