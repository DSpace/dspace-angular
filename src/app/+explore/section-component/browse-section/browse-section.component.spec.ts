import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { BrowseSectionComponent } from './browse-section.component';

describe('BrowseSectionComponent', () => {
  let component: BrowseSectionComponent;
  let fixture: ComponentFixture<BrowseSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule, RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [BrowseSectionComponent],
      providers: [BrowseSectionComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseSectionComponent);
    component = fixture.componentInstance;

    component.sectionId = 'publication';
    component.browseSection = {
      browseNames: ['rodept', 'author', 'title', 'type'],
      componentType: 'browse',
      style: 'col-md-4'
    }

    fixture.detectChanges();
  });

  it('should create BrowseSectionComponent', inject([BrowseSectionComponent], (comp: BrowseSectionComponent) => {
    expect(comp).toBeDefined();
  }));

  it('should show one link foreach browse names', async(() => {
    fixture.whenStable().then(() => {
      const browseLinks = fixture.debugElement.queryAll(By.css('a.lead'));
      expect(browseLinks.length).toEqual(4);
      expect(browseLinks[0].nativeElement.href).toContain('/browse/rodept');
      expect(browseLinks[1].nativeElement.href).toContain('/browse/author');
      expect(browseLinks[2].nativeElement.href).toContain('/browse/title');
      expect(browseLinks[3].nativeElement.href).toContain('/browse/type');
    });
  }));

});
