import { ItemStatusComponent } from './item-status.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service-stub';
import { HostWindowService } from '../../../shared/host-window.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { RouterStub } from '../../../shared/testing/router-stub';
import { Item } from '../../../core/shared/item.model';
import { By } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('ItemStatusComponent', () => {
  let comp: ItemStatusComponent;
  let fixture: ComponentFixture<ItemStatusComponent>;

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018'
  });

  const itemPageUrl = `fake-url/${mockItem.id}`;
  const routerStub = Object.assign(new RouterStub(), {
    url: `${itemPageUrl}/edit`
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [ItemStatusComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) }
      ], schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemStatusComponent);
    comp = fixture.componentInstance;
    comp.item = mockItem;
    fixture.detectChanges();
  });

  it('should display the item\'s internal id', () => {
    const statusId: HTMLElement = fixture.debugElement.query(By.css('.status-data#status-id')).nativeElement;
    expect(statusId.textContent).toContain(mockItem.id);
  });

  it('should display the item\'s handle', () => {
    const statusHandle: HTMLElement = fixture.debugElement.query(By.css('.status-data#status-handle')).nativeElement;
    expect(statusHandle.textContent).toContain(mockItem.handle);
  });

  it('should display the item\'s last modified date', () => {
    const statusLastModified: HTMLElement = fixture.debugElement.query(By.css('.status-data#status-lastModified')).nativeElement;
    expect(statusLastModified.textContent).toContain(mockItem.lastModified);
  });

  it('should display the item\'s page url', () => {
    const statusItemPage: HTMLElement = fixture.debugElement.query(By.css('.status-data#status-itemPage')).nativeElement;
    expect(statusItemPage.textContent).toContain(itemPageUrl);
  });

});
