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

import { AuthService } from '../../../../../core/auth/auth.service';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { MiradorViewerComponent } from '../../../../../item-page/mirador-viewer/mirador-viewer.component';
import { AuthServiceMock } from '../../../../../shared/mocks/auth.service.mock';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { CrisLayoutIIIFViewerBoxComponent } from './cris-layout-iiif-viewer-box.component';

xdescribe('CrisLayoutIIIFViewerBoxComponent', () => {
  let component: CrisLayoutIIIFViewerBoxComponent;
  let fixture: ComponentFixture<CrisLayoutIIIFViewerBoxComponent>;

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

  const testBox = Object.assign(new CrisLayoutBox(), {
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
        CrisLayoutIIIFViewerBoxComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: 'boxProvider', useValue: testBox },
        { provide: 'itemProvider', useValue: testItem },
        { provide: AuthService, useValue: new AuthServiceMock() },
      ],
    }).overrideComponent(CrisLayoutIIIFViewerBoxComponent, { remove: { imports: [MiradorViewerComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutIIIFViewerBoxComponent);
    component = fixture.componentInstance;
    component.box = testBox;
    component.item = testItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should render the Mirador viewer', () => {
    const miradorViewerIframe = fixture.debugElement.query(By.css('iframe')).nativeElement;
    console.log(JSON.stringify(miradorViewerIframe));
  });
});
