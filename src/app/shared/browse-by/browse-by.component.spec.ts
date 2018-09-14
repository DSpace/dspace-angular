import { BrowseByComponent } from './browse-by.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SharedModule } from '../shared.module';

describe('BrowseByComponent', () => {
  let comp: BrowseByComponent;
  let fixture: ComponentFixture<BrowseByComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByComponent);
    comp = fixture.componentInstance;
  });

  it('should display a loading message when objects is empty',() => {
    (comp as any).objects = undefined;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ds-loading'))).toBeDefined();
  });

  it('should display results when objects is not empty', () => {
    (comp as any).objects = Observable.of({
      payload: {
        page: {
          length: 1
        }
      }
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ds-viewable-collection'))).toBeDefined();
  });

});
