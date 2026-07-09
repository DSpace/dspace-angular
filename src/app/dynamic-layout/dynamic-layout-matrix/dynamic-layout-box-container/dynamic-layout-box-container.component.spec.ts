import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Item } from '@dspace/core/shared/item.model';
import { boxMetadata } from '@dspace/core/testing/box.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { DynamicLayoutMetadataBoxComponent } from './boxes/metadata/dynamic-layout-metadata-box.component';
import { DynamicLayoutBoxContainerComponent } from './dynamic-layout-box-container.component';

describe('DynamicLayoutBoxContainerComponent', () => {
  let component: DynamicLayoutBoxContainerComponent;
  let fixture: ComponentFixture<DynamicLayoutBoxContainerComponent>;
  let de: DebugElement;

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: 'test',
        },
      ],
      'dspace.entity.type': [
        {
          language: null,
          value: 'Person',
        },
      ],
    },
  });


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        DynamicLayoutBoxContainerComponent,
      ],
    }).overrideComponent(DynamicLayoutBoxContainerComponent, { remove: { imports: [ThemedLoadingComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLayoutBoxContainerComponent);
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
      spyOn((component as any), 'getComponent').and.returnValue(DynamicLayoutMetadataBoxComponent);
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
