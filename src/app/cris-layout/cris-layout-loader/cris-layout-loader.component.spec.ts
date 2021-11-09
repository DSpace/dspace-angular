import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutLoaderComponent } from './cris-layout-loader.component';
import { Item } from '../../core/shared/item.model';
import { By } from '@angular/platform-browser';
import { CrisLayoutLoaderDirective } from '../directives/cris-layout-loader.directive';

describe('CrisLayoutLoaderComponent', () => {
  let component: CrisLayoutLoaderComponent;
  let fixture: ComponentFixture<CrisLayoutLoaderComponent>;

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: 'test'
        }
      ],
      'dspace.entity.type': [
        {
          language: null,
          value: 'Person'
        }
      ]
    }
  });


  const configurationSpy = jasmine.createSpyObj('component', {
      getConfiguration: jasmine.createSpy('getConfiguration')
    });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutLoaderComponent, CrisLayoutLoaderDirective ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutLoaderComponent);
    component = fixture.componentInstance;
    component.item = mockItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('if config is vertical should show vertical component', () => {
    component.layoutConfiguration = { orientation: 'vertical'};
    component.initComponent();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.vertical-layout'))).toBeTruthy();
  });

  it('if config is horizontal should show horizontal component', () => {
    component.layoutConfiguration = { orientation: 'horizontal'};
    component.initComponent();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.horizontal-layout'))).toBeTruthy();
  });

});
