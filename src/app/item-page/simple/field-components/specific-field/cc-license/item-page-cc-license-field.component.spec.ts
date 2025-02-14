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
import { Item } from 'src/app/core/shared/item.model';
import {
  MetadataMap,
  MetadataValue,
} from 'src/app/core/shared/metadata.models';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';
import { createPaginatedList } from 'src/app/shared/testing/utils.test';

import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { environment } from '../../../../../../environments/environment';
import { TranslateLoaderMock } from '../../../../../shared/testing/translate-loader.mock';
import { ItemPageCcLicenseFieldComponent } from './item-page-cc-license-field.component';


interface TestInstance {
  metadata: {
    'dc.rights.uri'?: string;
    'dc.rights'?: string;
  };
  componentInputs?: {
    variant?: 'small' | 'full';
    showName?: boolean;
    showDisclaimer?: boolean;
  };
}


interface TestCase {
  testInstance: TestInstance;
  expected: {
    render: boolean,
    showImage: boolean,
    showName: boolean,
    showDisclaimer: boolean
  };
}


const licenseNameMock = 'CC LICENSE NAME';


const testCases: TestCase[] = [
  {
    testInstance: {
      metadata: { 'dc.rights.uri': undefined, 'dc.rights': undefined },
    },
    expected: {
      render: false,
      showName: false,
      showImage: false,
      showDisclaimer: false,
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights.uri': null, 'dc.rights': null },
    },
    expected: {
      render: false,
      showName: false,
      showImage: false,
      showDisclaimer: false,
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights.uri': 'https://creativecommons.org/licenses/by/4.0', 'dc.rights': null },
    },
    expected: {
      render: false,
      showName: false,
      showImage: false,
      showDisclaimer: false,
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights.uri': null, 'dc.rights': licenseNameMock },
    },
    expected: {
      render: false,
      showName: false,
      showImage: false,
      showDisclaimer: false,
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights.uri': 'https://creativecommons.org/licenses/by/4.0', 'dc.rights': licenseNameMock },
    },
    expected: {
      render: true,
      showName: true,
      showImage: true,
      showDisclaimer: false,
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights.uri': 'https://creativecommons.org/', 'dc.rights': licenseNameMock },
    },
    expected: {
      render: true,
      showName: true,
      showImage: false,
      showDisclaimer: false,
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights.uri': 'https://creativecommons.org/', 'dc.rights': licenseNameMock },
      componentInputs: { variant: 'full' },
    },
    expected: {
      render: true,
      showName: true,
      showImage: false,
      showDisclaimer: true,
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights.uri': 'https://creativecommons.org/', 'dc.rights': licenseNameMock },
      componentInputs: { showName: false },
    },
    expected: {
      render: true,
      showName: true,
      showImage: false,
      showDisclaimer: false,
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights.uri': 'https://creativecommons.org/licenses/by/4.0', 'dc.rights': licenseNameMock },
      componentInputs: { showName: false },
    },
    expected: {
      render: true,
      showName: false,
      showImage: true,
      showDisclaimer: false,
    },
  },
  {
    testInstance: {
      metadata: { 'dc.rights.uri': 'https://creativecommons.org/licenses/by/4.0', 'dc.rights': licenseNameMock },
      componentInputs: { variant: 'full', showDisclaimer: false },
    },
    expected: {
      render: true,
      showName: true,
      showImage: true,
      showDisclaimer: false,
    },
  },
];


// Updates the component fixture with parameters from the test instance
function configureFixture(
  fixture: ComponentFixture<ItemPageCcLicenseFieldComponent>,
  testInstance: TestInstance,
) {
  const item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: new MetadataMap(),
  });

  for (const [key, value] of Object.entries(testInstance.metadata)) {
    item.metadata[key] = [
      {
        language: 'en_US',
        value: value,
      },
    ] as MetadataValue[];
  }

  let component: ItemPageCcLicenseFieldComponent = fixture.componentInstance;
  for (const [key, value] of Object.entries(testInstance.componentInputs ?? {})) {
    component[key] = value;
  }
  component.item = item;

  fixture.detectChanges();
}


describe('ItemPageCcLicenseFieldComponent', () => {
  let fixture: ComponentFixture<ItemPageCcLicenseFieldComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ItemPageCcLicenseFieldComponent,
      ],
      providers: [{ provide: APP_CONFIG, useValue: environment }],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ItemPageCcLicenseFieldComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemPageCcLicenseFieldComponent);
  }));

  testCases.forEach((testCase) => {
    describe('', () => {
      beforeEach(async () => {
        configureFixture(fixture, testCase.testInstance);

        // Waits the image to be loaded or to cause an error when loading
        let imgEl = fixture.debugElement.query(By.css('img'));
        if (imgEl) {
          await new Promise<void>((resolve, reject) => {
            imgEl.nativeElement.addEventListener('load', () => resolve());
            imgEl.nativeElement.addEventListener('error', () => resolve());
          });
        }

        // Executes again because the 'img' element could have been updated due to a loading error
        fixture.detectChanges();
      });

      it('should render or not the component',
        () => {
          const componentEl = fixture.debugElement.query(By.css('.item-page-field'));
          expect(Boolean(componentEl)).toBe(testCase.expected.render);
        },
      );

      it('should show/hide CC license name',
        () => {
          const nameEl = fixture.debugElement.query(de => de.nativeElement.id === 'cc-name');
          expect(Boolean(nameEl)).toBe(testCase.expected.showName);
          if (nameEl && testCase.expected.showName) {
            expect(nameEl.nativeElement.innerHTML).toContain(licenseNameMock);
          }
        },
      );

      it('should show CC license image',
        () => {
          const imgEl = fixture.debugElement.query(By.css('img'));
          expect(Boolean(imgEl)).toBe(testCase.expected.showImage);
        },
      );

      it('should use name fallback when CC image fails loading',
        () => {
          const nameEl = fixture.debugElement.query(de => de.nativeElement.id === 'cc-name');
          expect(Boolean(nameEl)).toBe(testCase.expected.showName);
          if (nameEl && testCase.expected.showName) {
            expect(nameEl.nativeElement.innerHTML).toContain(licenseNameMock);
          }
        },
      );

      it('should show or not CC license disclaimer',
        () => {
          const disclaimerEl = fixture.debugElement.query(By.css('span'));
          if (testCase.expected.showDisclaimer) {
            expect(disclaimerEl).toBeTruthy();
            expect(disclaimerEl.nativeElement.innerHTML).toContain('item.page.cc.license.disclaimer');
          } else if (testCase.expected.render) {
            expect(disclaimerEl).toBeTruthy();
            expect(disclaimerEl.nativeElement.innerHTML).not.toContain('item.page.cc.license.disclaimer');
          } else {
            expect(disclaimerEl).toBeFalsy();
          }
        },
      );
    });
  });
});
