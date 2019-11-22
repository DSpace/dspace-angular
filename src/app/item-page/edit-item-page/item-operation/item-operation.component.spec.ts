import { ItemOperation } from './itemOperation.model';
import { async, TestBed } from '@angular/core/testing';
import { ItemOperationComponent } from './item-operation.component';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('ItemOperationComponent', () => {
  let itemOperation: ItemOperation;

  let fixture;
  let comp;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      declarations: [ItemOperationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    itemOperation  = new ItemOperation('key1', 'url1');

    fixture = TestBed.createComponent(ItemOperationComponent);
    comp = fixture.componentInstance;
    comp.operation = itemOperation;
    fixture.detectChanges();
  });

  it('should render operation row', () => {
    const span = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(span.textContent).toContain('item.edit.tabs.status.buttons.key1.label');
    const link = fixture.debugElement.query(By.css('a')).nativeElement;
    expect(link.href).toContain('url1');
    expect(link.textContent).toContain('item.edit.tabs.status.buttons.key1.button');
  });
  it('should render disabled operation row', () => {
    itemOperation.setDisabled(true);
    fixture.detectChanges();

    const span = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(span.textContent).toContain('item.edit.tabs.status.buttons.key1.label');
    const span2 = fixture.debugElement.query(By.css('span.btn-danger')).nativeElement;
    expect(span2.textContent).toContain('item.edit.tabs.status.buttons.key1.button');
  });
});
