import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  BitstreamDataService,
  BundleDataService,
  createPaginatedList,
  createSuccessfulRemoteDataObject$,
  Item,
  MetadataMap,
  TranslateLoaderMock,
} from '@dspace/core';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { HostWindowService } from '../../shared/host-window.service';
import { createRelationshipsObservable } from '../simple/item-types/shared/item.component.spec';
import { MiradorViewerComponent } from './mirador-viewer.component';
import { MiradorViewerService } from './mirador-viewer.service';


function getItem(metadata: MetadataMap) {
  return Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: metadata,
    relationships: createRelationshipsObservable(),
  });
}

const noMetadata = new MetadataMap();

const mockHostWindowService = {
  // This isn't really testing mobile status, the return observable just allows the test to run.
  widthCategory: observableOf(true),
};

describe('MiradorViewerComponent with search', () => {
  let comp: MiradorViewerComponent;
  let fixture: ComponentFixture<MiradorViewerComponent>;
  const viewerService = jasmine.createSpyObj('MiradorViewerService', ['showEmbeddedViewer', 'getImageCount']);

  beforeEach(waitForAsync(() => {
    viewerService.showEmbeddedViewer.and.returnValue(true);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), MiradorViewerComponent],
      providers: [
        { provide: BitstreamDataService, useValue: {} },
        { provide: BundleDataService, useValue: {} },
        { provide: HostWindowService, useValue: mockHostWindowService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(MiradorViewerComponent, {
      set: {
        providers: [
          { provide: MiradorViewerService, useValue: viewerService },
        ],
      },
    }).compileComponents();
  }));
  describe('searchable item', () => {
    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(MiradorViewerComponent);
      comp = fixture.componentInstance;
      comp.object = getItem(noMetadata);
      comp.searchable = true;
      fixture.detectChanges();
    }));

    it('should set multi property to true', (() => {
      expect(comp.multi).toBe(true);
    }));

    it('should set url "multi" param to true', (() => {
      const value = fixture.debugElement
        .nativeElement.querySelector('#mirador-viewer').src;
      expect(value).toContain('multi=true');
    }));

    it('should set url "searchable" param to true', (() => {
      const value = fixture.debugElement
        .nativeElement.querySelector('#mirador-viewer').src;
      expect(value).toContain('searchable=true');
    }));

    it('should not call mirador service image count', () => {
      expect(viewerService.getImageCount).not.toHaveBeenCalled();
    });

  });
});

describe('MiradorViewerComponent with multiple images', () => {

  let comp: MiradorViewerComponent;
  let fixture: ComponentFixture<MiradorViewerComponent>;
  const viewerService = jasmine.createSpyObj('MiradorViewerService', ['showEmbeddedViewer', 'getImageCount']);

  beforeEach(waitForAsync(() => {
    viewerService.showEmbeddedViewer.and.returnValue(true);
    viewerService.getImageCount.and.returnValue(observableOf(2));
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), MiradorViewerComponent],
      providers: [
        { provide: BitstreamDataService, useValue: {} },
        { provide: BundleDataService, useValue: {} },
        { provide: HostWindowService, useValue: mockHostWindowService  },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(MiradorViewerComponent, {
      set: {
        providers: [
          { provide: MiradorViewerService, useValue: viewerService },
        ],
      },
    }).compileComponents();
  }));

  describe('non-searchable item with multiple images', () => {
    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(MiradorViewerComponent);
      comp = fixture.componentInstance;
      comp.object = getItem(noMetadata);
      comp.searchable = false;
      fixture.detectChanges();
    }));

    it('should set url "multi" param to true', (() => {
      const value = fixture.debugElement
        .nativeElement.querySelector('#mirador-viewer').src;
      expect(value).toContain('multi=true');
    }));

    it('should call mirador service image count', () => {
      expect(viewerService.getImageCount).toHaveBeenCalled();
    });

    it('should omit "searchable" param from url', (() => {
      const value = fixture.debugElement
        .nativeElement.querySelector('#mirador-viewer').src;
      expect(value).not.toContain('searchable=true');
    }));

  });
});


describe('MiradorViewerComponent with a single image', () => {
  let comp: MiradorViewerComponent;
  let fixture: ComponentFixture<MiradorViewerComponent>;
  const viewerService = jasmine.createSpyObj('MiradorViewerService', ['showEmbeddedViewer', 'getImageCount']);

  beforeEach(waitForAsync(() => {
    viewerService.showEmbeddedViewer.and.returnValue(true);
    viewerService.getImageCount.and.returnValue(observableOf(1));
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), MiradorViewerComponent],
      providers: [
        { provide: BitstreamDataService, useValue: {} },
        { provide: BundleDataService, useValue: {} },
        { provide: HostWindowService, useValue: mockHostWindowService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(MiradorViewerComponent, {
      set: {
        providers: [
          { provide: MiradorViewerService, useValue: viewerService },
        ],
      },
    }).compileComponents();
  }));

  describe('single image viewer', () => {
    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(MiradorViewerComponent);
      comp = fixture.componentInstance;
      comp.object = getItem(noMetadata);
      fixture.detectChanges();
    }));

    it('should  omit "multi" param', (() => {
      const value = fixture.debugElement
        .nativeElement.querySelector('#mirador-viewer').src;
      expect(value).not.toContain('multi=false');
    }));

    it('should call mirador service image count', () => {
      expect(viewerService.getImageCount).toHaveBeenCalled();
    });

  });

});

describe('MiradorViewerComponent in development mode', () => {
  let comp: MiradorViewerComponent;
  let fixture: ComponentFixture<MiradorViewerComponent>;
  const viewerService = jasmine.createSpyObj('MiradorViewerService', ['showEmbeddedViewer', 'getImageCount']);

  beforeEach(waitForAsync(() => {
    viewerService.showEmbeddedViewer.and.returnValue(false);
    viewerService.getImageCount.and.returnValue(observableOf(1));
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), MiradorViewerComponent],
      providers: [
        { provide: BitstreamDataService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(MiradorViewerComponent, {
      set: {
        providers: [
          { provide: MiradorViewerService, useValue: viewerService },
          { provide: BundleDataService, useValue: {} },
          { provide: HostWindowService, useValue: mockHostWindowService  },
        ],
      },
    }).compileComponents();
  }));

  describe('embedded viewer', () => {
    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(MiradorViewerComponent);
      comp = fixture.componentInstance;
      comp.object = getItem(noMetadata);
      fixture.detectChanges();
    }));

    it('should not embed the viewer', (() => {
      const value = fixture.debugElement
        .nativeElement.querySelector('#mirador-viewer');
      expect(value).toBeNull();
    }));

    it('should show message', (() => {
      const value = fixture.debugElement
        .nativeElement.querySelector('#viewer-message');
      expect(value).not.toBeNull();
    }));

  });
});
