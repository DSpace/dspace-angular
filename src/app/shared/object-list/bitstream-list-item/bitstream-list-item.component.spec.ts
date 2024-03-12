import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../mocks/dso-name.service.mock';
import { BitstreamListItemComponent } from './bitstream-list-item.component';

describe('BitstreamListItemComponent', () => {
  let component: BitstreamListItemComponent;
  let fixture: ComponentFixture<BitstreamListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule, RouterTestingModule, BitstreamListItemComponent],
      providers: [{ provide: DSONameService, useValue: new DSONameServiceMock() }],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitstreamListItemComponent);
    component = fixture.componentInstance;
    // @ts-ignore
    component.object = { name: 'test' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
