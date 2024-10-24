import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
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
import { ConfigurationDataService } from 'src/app/core/data/configuration-data.service';
import { ConfigurationProperty } from 'src/app/core/shared/configuration-property.model';
import { Item } from 'src/app/core/shared/item.model';
import {
  MetadataMap,
  MetadataValue,
} from 'src/app/core/shared/metadata.models';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';
import { ConfigurationDataServiceStub } from 'src/app/shared/testing/configuration-data.service.stub';
import { createPaginatedList } from 'src/app/shared/testing/utils.test';

import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { environment } from '../../../../../../environments/environment';
import { TranslateLoaderMock } from '../../../../../shared/testing/translate-loader.mock';
import { ItemPageLicenseFieldComponent } from './item-page-license-field.component';


interface TestInstance {
  metadata: any;
}


interface TestCase {
  testInstance: TestInstance;
  expected: {
    render: boolean,
    textElements: string[],
    linkElements: string[],
  };
}


const licenseNameMock = 'LICENSE NAME';
const exampleUriMock = 'http://example.com';
const ccUriMock = 'https://creativecommons.org/licenses/by/4.0';


const testCases: TestCase[] = [
  {
    testInstance: {
      metadata: { 'dc.rights': undefined, 'dc.rights.uri': undefined },
    },
    expected: {
      render: false,
      textElements: [],
      linkElements: [],
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights': [ undefined, undefined ], 'dc.rights.uri': undefined },
    },
    expected: {
      render: false,
      textElements: [],
      linkElements: [],
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights.license': undefined, 'dc.rights.uri': undefined },
    },
    expected: {
      render: false,
      textElements: [],
      linkElements: [],
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights': undefined, 'dc.rights.license': undefined, 'dc.rights.uri': [ undefined, undefined ] },
    },
    expected: {
      render: false,
      textElements: [],
      linkElements: [],
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights': null, 'dc.rights.license': null, 'dc.rights.uri': null },
    },
    expected: {
      render: false,
      textElements: [],
      linkElements: [],
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights': null, 'dc.rights.license': null, 'dc.rights.uri': [ null, null ] },
    },
    expected: {
      render: false,
      textElements: [],
      linkElements: [],
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights.uri': exampleUriMock },
    },
    expected: {
      render: true,
      textElements: [exampleUriMock],
      linkElements: [exampleUriMock],
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights': null, 'dc.rights.license': null, 'dc.rights.uri': exampleUriMock },
    },
    expected: {
      render: true,
      textElements: [exampleUriMock],
      linkElements: [exampleUriMock],
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights.uri': ccUriMock },
    },
    expected: {
      render: true,
      textElements: [ccUriMock],
      linkElements: [ccUriMock],
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights': null, 'dc.rights.license': licenseNameMock, 'dc.rights.uri': null },
    },
    expected: {
      render: true,
      textElements: [licenseNameMock],
      linkElements: [],
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights': licenseNameMock, 'dc.rights.uri': ccUriMock },
    },
    expected: {
      render: true,
      // This test case is delegated to ItemPageCcLicenseFieldComponent
      textElements: [],
      linkElements: [],
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights': licenseNameMock, 'dc.rights.license': licenseNameMock, 'dc.rights.uri': ccUriMock  },
    },
    expected: {
      render: true,
      // This test case meets the CC criteria too (since it has 'dc.rights', and 'dc.rights.uri'
      // points to a CC license). Thus, it is delegated to ItemPageCcLicenseFieldComponent.
      textElements: [],
      linkElements: [],
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights': licenseNameMock, 'dc.rights.license': licenseNameMock, 'dc.rights.uri': exampleUriMock  },
    },
    expected: {
      render: true,
      textElements: [licenseNameMock, licenseNameMock, exampleUriMock],
      linkElements: [exampleUriMock],
    },
  },
];


// Updates the component fixture with parameters from the test instance
function configureFixture(
  fixture: ComponentFixture<ItemPageLicenseFieldComponent>,
  testInstance: TestInstance,
) {
  const item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: new MetadataMap(),
  });

  for (const [key, values] of Object.entries(testInstance.metadata)) {
    for (const value of values instanceof Array ? values : [values]) {
      item.metadata[key] = [
        {
          language: 'en_US',
          value: value,
        },
      ] as MetadataValue[];
    }
  }

  let component: ItemPageLicenseFieldComponent = fixture.componentInstance;
  component.item = item;

  fixture.detectChanges();
}


describe('ItemPageLicenseFieldComponent', () => {
  let fixture: ComponentFixture<ItemPageLicenseFieldComponent>;
  let configurationDataService = new ConfigurationDataServiceStub();

  beforeEach(waitForAsync(() => {
    configurationDataService.findByPropertyName = jasmine.createSpy()
      .withArgs('cc.license.name').and.returnValue(createSuccessfulRemoteDataObject$({
        ... new ConfigurationProperty(),
        name: 'cc.license.name',
        values: [ 'dc.rights' ],
      },
      ))
      .withArgs('cc.license.uri').and.returnValue(createSuccessfulRemoteDataObject$({
        ... new ConfigurationProperty(),
        name: 'cc.license.uri',
        values: [ 'dc.rights.uri' ],
      },
      ));
    void TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ItemPageLicenseFieldComponent,
      ],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: ConfigurationDataService, useValue: configurationDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ItemPageLicenseFieldComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemPageLicenseFieldComponent);
  }));

  testCases.forEach((testCase) => {
    describe('', () => {
      beforeEach(async () => {
        configureFixture(fixture, testCase.testInstance);
      });

      it('should render or not the component',
        () => {
          const componentEl = fixture.debugElement.query(By.css('.item-page-field'));
          expect(Boolean(componentEl)).toBe(testCase.expected.render);
        },
      );

      it('should show/hide license as plain text',
        () => {
          const textEl = fixture.debugElement.queryAll(By.css('.license-text'));
          expect(textEl.length).toBe(testCase.expected.textElements.length);
          if (textEl && testCase.expected.textElements.length > 0) {
            textEl.forEach((elt, idx) =>
              expect(elt.nativeElement.innerHTML).toContain(testCase.expected.textElements[idx]),
            );
          }
        },
      );

      it('should show/hide the license as link',
        () => {
          const linkEl = fixture.debugElement.queryAll(By.css('.license-link'));
          expect(linkEl.length).toBe(testCase.expected.linkElements.length);
          if (linkEl && testCase.expected.linkElements.length > 0) {
            linkEl.forEach((elt, idx) =>
              expect(elt.query(By.css('.license-text')).nativeElement.innerHTML).toContain(testCase.expected.linkElements[idx]),
            );
          }
        },
      );
    });
  });
});
