import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TombstoneComponent } from './tombstone.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../shared/mocks/dso-name.service.mock';

describe('TombstoneComponent', () => {
  let component: TombstoneComponent;
  let fixture: ComponentFixture<TombstoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), RouterTestingModule.withRoutes([]), BrowserAnimationsModule],
      declarations: [ TombstoneComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: DSONameService, useClass: DSONameServiceMock }
      ]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TombstoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
