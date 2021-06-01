import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { TopSectionComponent } from './top-section.component';

describe('TopSectionComponent', () => {
  let component: TopSectionComponent;
  let fixture: ComponentFixture<TopSectionComponent>;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule, RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [TopSectionComponent],
      providers: [TopSectionComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopSectionComponent);
    component = fixture.componentInstance;
    component.sectionId = 'publications';
    component.topSection = {
      discoveryConfigurationName: 'publication',
      componentType: 'top',
      style: 'col-md-6',
      order: 'desc',
      sortField: 'dc.date.accessioned'
    };

    fixture.detectChanges();
  });

  it('should create TopSectionComponent', inject([TopSectionComponent], (comp: TopSectionComponent) => {
    expect(comp).toBeDefined();
  }));

});
