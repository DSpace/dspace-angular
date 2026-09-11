import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@dspace/core/auth/auth.service';
import { DynamicLayoutBox } from '@dspace/core/layout/models/box.model';
import { RouteService } from '@dspace/core/services/route.service';
import { Item } from '@dspace/core/shared/item.model';
import { MockActivatedRoute } from '@dspace/core/testing/active-router.mock';
import { AuthServiceMock } from '@dspace/core/testing/auth.service.mock';
import { routeServiceStub } from '@dspace/core/testing/route-service.stub';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { MiradorViewerComponent } from '../../../../../item-page/mirador-viewer/mirador-viewer.component';
import { DynamicLayoutIiifViewerBoxComponent } from './dynamic-layout-iiif-viewer-box.component';

describe('DynamicLayoutIiifViewerBoxComponent', () => {
  let component: DynamicLayoutIiifViewerBoxComponent;
  let fixture: ComponentFixture<DynamicLayoutIiifViewerBoxComponent>;

  const testItem = Object.assign(new Item(), {
    type: 'item',
    entityType: 'Publication',
    metadata: {
      'dc.title': [{
        'value': 'test item title',
        'language': null,
        'authority': null,
        'confidence': -1,
        'place': 0,
      }],
      'dspace.iiif.enabled': [{
        'value': 'true',
        'language': null,
        'authority': null,
        'confidence': 0,
        'place': 0,
        'securityLevel': 0,
      }],
    },
    uuid: 'test-item-uuid',
  });

  const testBox = Object.assign(new DynamicLayoutBox(), {
    'id': 1,
    'shortname': 'iiifviewer',
    'header': 'IIIF Viewer',
    'entityType': 'Publication',
    'collapsed': false,
    'minor': false,
    'style': null,
    'security': 0,
    'boxType': 'IIIFVIEWER',
    'maxColumns': null,
    'configuration': null,
    'metadataSecurityFields': [],
    'container': false,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        DynamicLayoutIiifViewerBoxComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: 'boxProvider', useValue: testBox },
        { provide: 'itemProvider', useValue: testItem },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: RouteService, useValue: routeServiceStub },
      ],
    }).overrideComponent(DynamicLayoutIiifViewerBoxComponent, { remove: { imports: [MiradorViewerComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLayoutIiifViewerBoxComponent);
    component = fixture.componentInstance;
    component.box = testBox;
    component.item = testItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
