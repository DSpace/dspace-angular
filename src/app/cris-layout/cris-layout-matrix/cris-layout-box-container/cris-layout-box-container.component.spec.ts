import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { CrisLayoutBoxContainerComponent } from './cris-layout-box-container.component';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { boxMetadata } from '../../../shared/testing/box.mock';
import { Item } from '../../../core/shared/item.model';
import { CrisLayoutMetadataBoxComponent } from './boxes/metadata/cris-layout-metadata-box.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('CrisLayoutBoxContainerComponent', () => {
  let component: CrisLayoutBoxContainerComponent;
  let fixture: ComponentFixture<CrisLayoutBoxContainerComponent>;
  let de: DebugElement;

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


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [CrisLayoutBoxContainerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutBoxContainerComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    component.box = boxMetadata;
    component.item = mockItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('when inserting box', () => {
    beforeEach(() => {
      spyOn((component as any), 'getComponent').and.returnValue(CrisLayoutMetadataBoxComponent);
      component.box = boxMetadata;
      component.item = mockItem;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call get component', () => {
      expect((component as any).getComponent).toHaveBeenCalled();
    });

    it('should have object injector', () => {
      expect((component as any).objectInjector).toBeTruthy();
    });

    it('if box has container == false should not show accordion', () => {
      component.box.container = false;
      fixture.detectChanges();
      expect(de.query(By.css('ngb-accordion'))).toBeNull();
    });

    it('if box has container == true should show accordion', () => {
      component.box.container = true;
      fixture.detectChanges();
      expect(de.query(By.css('ngb-accordion'))).toBeTruthy();
    });

  });
});
