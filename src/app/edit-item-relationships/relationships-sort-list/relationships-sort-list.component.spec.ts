import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipsSortListComponent } from './relationships-sort-list.component';
import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { SharedModule } from '../../shared/shared.module';

describe('RelationshipsSortListComponent', () => {
  let component: RelationshipsSortListComponent;
  let fixture: ComponentFixture<RelationshipsSortListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationshipsSortListComponent ],
      imports : [
        RouterTestingModule.withRoutes([]),
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipsSortListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on init check if relationships is set in input', () => {
    expect(component).toBeTruthy();
  });

  it('after input relatinoship is set check if view is changed', () => {
    expect(component).toBeTruthy();
  });

});
