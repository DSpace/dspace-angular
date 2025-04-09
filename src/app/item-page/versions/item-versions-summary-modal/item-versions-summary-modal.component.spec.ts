import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { ItemVersionsSummaryModalComponent } from './item-versions-summary-modal.component';

describe('ItemVersionsSummaryModalComponent', () => {
  let component: ItemVersionsSummaryModalComponent;
  let fixture: ComponentFixture<ItemVersionsSummaryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), ItemVersionsSummaryModalComponent],
      providers: [
        { provide: NgbActiveModal },
      ],
    }).overrideComponent(ItemVersionsSummaryModalComponent, { remove: { imports: [ThemedLoadingComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionsSummaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
