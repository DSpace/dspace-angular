import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';
import {
  skip,
  take,
  toArray,
} from 'rxjs/operators';

import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { BundleDataService } from '../../core/data/bundle-data.service';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { Item } from '../../core/shared/item.model';
import { MetadataMap } from '../../core/shared/metadata.models';
import { HostWindowService } from '../../shared/host-window.service';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { createRelationshipsObservable } from '../simple/item-types/shared/item.component.spec';
import { MiradorViewerComponent } from './mirador-viewer.component';
import { MiradorViewerService } from './mirador-viewer.service';


const noMetadata = new MetadataMap();

const mockHostWindowService = {
  // This isn't really testing mobile status, the return observable just allows the test to run.
  widthCategory: of(true),
};

let comp: MiradorViewerComponent;
let fixture: ComponentFixture<MiradorViewerComponent>;
let configurationDataService: jasmine.SpyObj<ConfigurationDataService>;
let viewerService: jasmine.SpyObj<MiradorViewerService>;

function getItem(metadata: MetadataMap) {
  return Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: metadata,
    relationships: createRelationshipsObservable(),
  });
}

function setupTestBed(overrides?: {
  showEmbedded?: boolean;
  imageCount?: number;
  iiifEnabled?: boolean;
}) {
  configurationDataService = jasmine.createSpyObj('ConfigurationDataService', [
    'findByPropertyName',
  ]);

  viewerService = jasmine.createSpyObj('MiradorViewerService', [
    'showEmbeddedViewer',
    'getImageCount',
    'isIiifEnabled',
  ]);

  viewerService.showEmbeddedViewer.and.returnValue(overrides?.showEmbedded ?? true);
  viewerService.getImageCount.and.returnValue(of(overrides?.imageCount ?? 1));
  viewerService.isIiifEnabled.and.returnValue(of(overrides?.iiifEnabled ?? true));

  TestBed.configureTestingModule({
    imports: [
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }),
      MiradorViewerComponent,
    ],
    providers: [
      { provide: BitstreamDataService, useValue: {} },
      { provide: BundleDataService, useValue: {} },
      { provide: ConfigurationDataService, useValue: configurationDataService },
      { provide: HostWindowService, useValue: mockHostWindowService },
      { provide: MiradorViewerService, useValue: viewerService },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  });
}

function createComponent(options?: {
  searchable?: boolean;
  object?: any;
}) {
  fixture = TestBed.createComponent(MiradorViewerComponent);
  comp = fixture.componentInstance;
  comp.object = options?.object ?? getItem(noMetadata);
  comp.searchable = options?.searchable ?? false;
  fixture.detectChanges();
}

function getViewerSrc(): string {
  return fixture.debugElement.query(By.css('#mirador-viewer'))
    .nativeElement.src;
}

describe('MiradorViewerComponent with search', () => {
  beforeEach(waitForAsync(() => {
    setupTestBed();
    TestBed.compileComponents();
  }));
  describe('searchable item', () => {
    beforeEach(() => {
      createComponent({ searchable: true });
    });

    it('should set multi property to true', (() => {
      expect(comp.multi).toBe(true);
    }));

    it('should set url "multi" param to true', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(getViewerSrc()).toContain('multi=true');
    });

    it('should set url "searchable" param to true', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(getViewerSrc()).toContain('searchable=true');
    });

    it('should not call mirador service image count', () => {
      expect(viewerService.getImageCount).not.toHaveBeenCalled();
    });

  });
});

describe('MiradorViewerComponent with multiple images', () => {
  beforeEach(waitForAsync(() => {
    setupTestBed({ imageCount: 2 });
    TestBed.compileComponents();
  }));

  describe('non-searchable item with multiple images', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should set url "multi" param to true',  async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(getViewerSrc()).toContain('multi=true');
    });

    it('should call mirador service image count', () => {
      expect(viewerService.getImageCount).toHaveBeenCalled();
    });

    it('should omit "searchable" param from url',  async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(getViewerSrc()).not.toContain('searchable=true');
    });

  });
});


describe('MiradorViewerComponent with a single image', () => {
  beforeEach(waitForAsync(() => {
    setupTestBed({ imageCount: 1 });
    TestBed.compileComponents();
  }));

  describe('single image viewer', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should  omit "multi" param',  async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(getViewerSrc()).not.toContain('multi=false');
    });

    it('should call mirador service image count', () => {
      expect(viewerService.getImageCount).toHaveBeenCalled();
    });

  });

});

describe('MiradorViewerComponent in development mode', () => {
  beforeEach(waitForAsync(() => {
    setupTestBed({
      showEmbedded: false,
      imageCount: 1,
    });
    TestBed.compileComponents();
  }));

  describe('embedded viewer', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should not embed the viewer',  async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      const value = fixture.debugElement
        .nativeElement.querySelector('#mirador-viewer');
      expect(value).toBeNull();
    });

    it('should show message',  async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      const value = fixture.debugElement
        .nativeElement.querySelector('#viewer-message');
      expect(value).not.toBeNull();
    });

  });
});


describe('MiradorViewerService whether IIIF is enabled in the repository', () => {
  let miradorViewerService: MiradorViewerService;
  function mockIiifEnabled(values: string[]): void {
    configurationDataService.findByPropertyName.and.returnValue(
      createSuccessfulRemoteDataObject$(
        Object.assign(new ConfigurationProperty(), {
          name: 'iiif.enabled',
          values,
        }),
      ),
    );
  }
  beforeEach(() => {
    configurationDataService = jasmine.createSpyObj('ConfigurationDataService', [
      'findByPropertyName',
    ]);
    miradorViewerService = new MiradorViewerService();
  });
  describe('isIiifEnabled', () => {
    it('should return false initially and then true', (done) => {
      mockIiifEnabled(['true']);
      miradorViewerService.isIiifEnabled(configurationDataService)
        .pipe(take(2), toArray())
        .subscribe((results) => {
          expect(results).toEqual([false, true]);
          done();
        });
    });

    it('should return true when iiif.enabled is true', (done) => {
      mockIiifEnabled(['true']);

      miradorViewerService.isIiifEnabled(configurationDataService)
        .pipe(skip(1))
        .subscribe((enabled) => {
          expect(enabled).toBeTrue();
          expect(configurationDataService.findByPropertyName)
            .toHaveBeenCalledWith('iiif.enabled');
          done();
        });
    });

    it('should return false when iiif.enabled is false', (done) => {
      mockIiifEnabled(['false']);
      miradorViewerService.isIiifEnabled(configurationDataService)
        .pipe(skip(1))
        .subscribe((enabled) => {
          expect(enabled).toBeFalse();
          done();
        });
    });

    it('should return false when configuration value is missing', (done) => {
      mockIiifEnabled([]);
      miradorViewerService.isIiifEnabled(configurationDataService)
        .pipe(skip(1))
        .subscribe((enabled) => {
          expect(enabled).toBeFalse();
          done();
        });
    });
  });
});
