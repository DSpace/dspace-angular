import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemPageAbstractFieldComponent } from './item-page-abstract-field.component';
import { TranslateLoaderMock } from '../../../../../shared/testing/translate-loader.mock';
import { SharedModule } from '../../../../../shared/shared.module';
import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { environment } from '../../../../../../environments/environment';
import { By } from '@angular/platform-browser';

let comp: ItemPageAbstractFieldComponent;
let fixture: ComponentFixture<ItemPageAbstractFieldComponent>;

describe('ItemPageAbstractFieldComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        SharedModule,
      ],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
      ],
      declarations: [ItemPageAbstractFieldComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemPageAbstractFieldComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {

    fixture = TestBed.createComponent(ItemPageAbstractFieldComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should render a ds-metadata-values', () => {
    expect(fixture.debugElement.query(By.css('ds-metadata-values'))).toBeDefined();
  });
});
