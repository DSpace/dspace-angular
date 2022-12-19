import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemBackButtonComponent } from './item-back-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouteService } from '../../core/services/route.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

describe('ItemBackButtonComponent', () => {
  let component: ItemBackButtonComponent;
  let fixture: ComponentFixture<ItemBackButtonComponent>;
  let router;
  const searchUrl = '/search?query=test&spc.page=2';

  const mockRouteService = {
    getPreviousUrl(): Observable<string> {
      return of(searchUrl);
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ItemBackButtonComponent],
      imports: [TranslateModule.forRoot(),
        RouterTestingModule],
      providers: [
      { provide: RouteService, useValue: {} },
    ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();


  beforeEach(waitForAsync(() => {
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    spyOn(mockRouteService, 'getPreviousUrl');
    fixture = TestBed.createComponent(ItemBackButtonComponent);
    component = fixture.componentInstance;
  }));

  describe('back button click', () => {
    component.back();
    expect(mockRouteService.getPreviousUrl).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(searchUrl);
  });
  }));
});
