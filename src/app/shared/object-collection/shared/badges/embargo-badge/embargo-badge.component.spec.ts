import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { AccessStatusDataService } from 'src/app/core/data/access-status-data.service';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';
import { environment } from 'src/environments/environment';

import { TruncatePipe } from '../../../../utils/truncate.pipe';
import { AccessStatusObject } from '../access-status-badge/access-status.model';
import { EmbargoBadgeComponent } from './embargo-badge.component';

describe('ItemEmbargoBadgeComponent', () => {
  let component: EmbargoBadgeComponent;
  let fixture: ComponentFixture<EmbargoBadgeComponent>;

  let unknownStatus: AccessStatusObject;
  let metadataOnlyStatus: AccessStatusObject;
  let openAccessStatus: AccessStatusObject;
  let embargoStatus: AccessStatusObject;
  let restrictedStatus: AccessStatusObject;

  let accessStatusDataService: AccessStatusDataService;

  let bitstream: Bitstream;

  function init() {
    unknownStatus = Object.assign(new AccessStatusObject(), {
      status: 'unknown',
      embargoDate: null,
    });

    metadataOnlyStatus = Object.assign(new AccessStatusObject(), {
      status: 'metadata.only',
      embargoDate: null,
    });

    openAccessStatus = Object.assign(new AccessStatusObject(), {
      status: 'open.access',
      embargoDate: null,
    });

    embargoStatus = Object.assign(new AccessStatusObject(), {
      status: 'embargo',
      embargoDate: '2050-01-01',
    });

    restrictedStatus = Object.assign(new AccessStatusObject(), {
      status: 'restricted',
      embargoDate: null,
    });

    accessStatusDataService = jasmine.createSpyObj('accessStatusDataService', {
      findBitstreamAccessStatusFor: createSuccessfulRemoteDataObject$(unknownStatus),
    });

    bitstream = Object.assign(new Bitstream(), {
      uuid: 'bitstream-uuid',
    });
  }

  function initTestBed() {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), EmbargoBadgeComponent, TruncatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AccessStatusDataService, useValue: accessStatusDataService },
      ],
    }).compileComponents();
  }

  function initFixtureAndComponent() {
    environment.item.bitstream.showAccessStatuses = true;
    fixture = TestBed.createComponent(EmbargoBadgeComponent);
    component = fixture.componentInstance;
    component.bitstream = bitstream;
    fixture.detectChanges();
    environment.item.bitstream.showAccessStatuses = false;
  }

  function lookForNoEmbargoBadge() {
    const badge = fixture.debugElement.query(By.css('span.badge'));
    expect(badge).toBeNull();
  }

  function lookForEmbargoBadge() {
    const badge = fixture.debugElement.query(By.css('span.badge'));
    expect(badge).toBeDefined();
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

  describe('When the findBitstreamAccessStatusFor method returns unknown', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponent();
    });
    it('should not show the embargo badge', () => {
      lookForNoEmbargoBadge();
    });
  });

  describe('When the findBitstreamAccessStatusFor method returns metadata.only', () => {
    beforeEach(waitForAsync(() => {
      init();
      (accessStatusDataService.findBitstreamAccessStatusFor as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$(metadataOnlyStatus));
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponent();
    });
    it('should not show the embargo badge', () => {
      lookForNoEmbargoBadge();
    });
  });

  describe('When the findBitstreamAccessStatusFor method returns open.access', () => {
    beforeEach(waitForAsync(() => {
      init();
      (accessStatusDataService.findBitstreamAccessStatusFor as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$(openAccessStatus));
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponent();
    });
    it('should not show the embargo badge', () => {
      lookForNoEmbargoBadge();
    });
  });

  describe('When the findBitstreamAccessStatusFor method returns embargo', () => {
    beforeEach(waitForAsync(() => {
      init();
      (accessStatusDataService.findBitstreamAccessStatusFor as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$(embargoStatus));
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponent();
    });
    it('should show the embargo badge', () => {
      lookForEmbargoBadge();
    });
  });

  describe('When the findBitstreamAccessStatusFor method returns restricted', () => {
    beforeEach(waitForAsync(() => {
      init();
      (accessStatusDataService.findBitstreamAccessStatusFor as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$(restrictedStatus));
      initTestBed();
    }));
    beforeEach(() => {
      initFixtureAndComponent();
    });
    it('should not show the embargo badge', () => {
      lookForNoEmbargoBadge();
    });
  });
});
