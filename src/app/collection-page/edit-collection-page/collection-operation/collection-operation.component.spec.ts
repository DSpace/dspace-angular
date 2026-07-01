import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { CollectionOperationComponent } from './collection-operation.component';
import { CollectionOperation } from './collectionOperation.model';

describe('CollectionOperationComponent', () => {
  let collectionOperation: CollectionOperation;

  let fixture;
  let comp;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), CollectionOperationComponent, BtnDisabledDirective],
    }).compileComponents();
  }));

  beforeEach(() => {
    collectionOperation = new CollectionOperation('key1', 'url1');

    fixture = TestBed.createComponent(CollectionOperationComponent);
    comp = fixture.componentInstance;
    comp.operation = collectionOperation;
    fixture.detectChanges();
  });

  it('should render operation row', () => {
    const span = fixture.debugElement.query(By.css('.action-label span')).nativeElement;
    expect(span.textContent).toContain('collection.edit.tabs.status.buttons.key1.label');
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent).toContain('collection.edit.tabs.status.buttons.key1.button');
  });
  it('should render disabled operation row', () => {
    collectionOperation.setDisabled(true);
    fixture.detectChanges();

    const span = fixture.debugElement.query(By.css('.action-label span')).nativeElement;
    expect(span.textContent).toContain('collection.edit.tabs.status.buttons.key1.label');
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.classList.contains('disabled')).toBeTrue();
    expect(button.textContent).toContain('collection.edit.tabs.status.buttons.key1.button');
  });
});
