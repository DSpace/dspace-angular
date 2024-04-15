import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { ItemVersionsRowElementVersionComponent } from './item-versions-row-element-version.component';

describe('ItemVersionsRowElementVersionComponent', () => {
  let component: ItemVersionsRowElementVersionComponent;
  let fixture: ComponentFixture<ItemVersionsRowElementVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemVersionsRowElementVersionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ItemVersionsRowElementVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
