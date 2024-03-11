import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ItemVersionsDeleteModalComponent } from './item-versions-delete-modal.component';

describe('ItemVersionsDeleteModalComponent', () => {
  let component: ItemVersionsDeleteModalComponent;
  let fixture: ComponentFixture<ItemVersionsDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemVersionsDeleteModalComponent],
      imports: [ TranslateModule.forRoot(), RouterTestingModule.withRoutes([]) ],
      providers: [
        { provide: NgbActiveModal },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionsDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
