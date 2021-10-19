import { SearchService } from '../../../../core/shared/search/search.service';
import { waitForAsync } from '@angular/core/testing';
/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextSectionComponent } from './text-section.component';
import {Site} from '../../../../core/shared/site.model';
import {By} from '@angular/platform-browser';
import {SimpleChange, SimpleChanges} from '@angular/core';

describe('TextSectionComponent', () => {
  let component: TextSectionComponent;
  let fixture: ComponentFixture<TextSectionComponent>;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TextSectionComponent ],
      providers: [
        { provide: SearchService, useValue: {} }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSectionComponent);
    component = fixture.componentInstance;
    component.site  = Object.assign(new Site(), {
      id: 'test-site',
      _links: {
        self: { href: 'test-site-href' }
      },
      metadata: {
        'cms.homepage.footer': [
          {
            language: 'en',
            value: '1234'
          }
        ],
        'dc.description': [
          {
            language: 'en_US',
            value: 'desc'
          }
        ]
      }
    });
    component.textRowSection = {
      content: 'cms.homepage.footer',
      contentType: 'text-metadata',
      componentType: 'text-row',
      style: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // FIXME: complete scenarios
  it('should render text-metadata with innerHtml', () => {
    const currentValue = component.site ;
    const changesObj: SimpleChanges = {
      site: new SimpleChange(null, currentValue, true),
    };
    component.sectionId = 'site';
    component.ngOnChanges(changesObj);
    fixture.detectChanges();
    const name = fixture.debugElement.queryAll(By.css('div'))[2].nativeElement;
    expect(name.innerHTML).toContain(component.site.metadata['cms.homepage.footer'][0].value);
  });
});
