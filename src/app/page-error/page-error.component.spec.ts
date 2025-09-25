import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { TranslateLoaderMock } from '../shared/testing/translate-loader.mock';
import { PageErrorComponent } from './page-error.component';

describe('PageErrorComponent', () => {
  let component: PageErrorComponent;
  let fixture: ComponentFixture<PageErrorComponent>;
  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    queryParams: of({
      status: 401,
      code: 'orcid.generic-error',
    }),
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
        PageErrorComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error for 401 unauthorized', () => {
    const statusElement = fixture.debugElement.query(By.css('[data-test="status"]')).nativeElement;
    expect(statusElement.innerHTML).toEqual('401');
  });
});
