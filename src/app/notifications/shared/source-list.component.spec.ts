import {
  AsyncPipe,
  DatePipe,
} from '@angular/common';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { AlertComponent } from '../../shared/alert/alert.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import {
  SourceListComponent,
  SourceObject,
} from './source-list.component';

describe('SourceListComponent', () => {
  let component: SourceListComponent;
  let fixture: ComponentFixture<SourceListComponent>;
  const paginationConfig = {
    currentPage: 1,
    pageSize: 10,
  };
  const sources: SourceObject[] = [
    { id: 'source1', lastEvent: '2025-03-12T12:00:00', total: 5 },
    { id: 'source1', lastEvent: '2025-03-13T12:00:00', total: 10 },
  ];

  const sourcesWithoutEvent: SourceObject[] = [
    { id: 'source1', total: 5 },
    { id: 'source1', total: 10 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SourceListComponent],
      imports: [
        TranslateModule.forRoot(),
        AlertComponent,
        AsyncPipe,
        DatePipe,
        MockComponent(PaginationComponent),
        MockComponent(ThemedLoadingComponent),
      ],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading message when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('ds-loading')).toBeTruthy();
  });

  it('should display sources when loading is false and sources are available', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('showLastEvent', true);
    fixture.componentRef.setInput('sources', sources);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('thead tr').children.length).toBe(3);
    expect(fixture.nativeElement.querySelector('tbody').children.length).toBe(2);
    expect(fixture.nativeElement.querySelector('tbody tr td').textContent).toContain('source1');
  });

  it('should not display last event column', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('showLastEvent', false);
    fixture.componentRef.setInput('sources', sourcesWithoutEvent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('thead tr').children.length).toBe(2);
    expect(fixture.nativeElement.querySelector('tbody').children.length).toBe(2);
    expect(fixture.nativeElement.querySelector('table tbody tr td').textContent).toContain('source1');
  });

  it('should emit sourceSelected event when a source is clicked', () => {
    spyOn(component.sourceSelected, 'emit');
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('paginationConfig', paginationConfig);
    fixture.componentRef.setInput('sources', sources);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.btn-outline-primary');
    button.click();
    expect(component.sourceSelected.emit).toHaveBeenCalledWith('source1');
  });

  it('should emit paginationChange event when pagination changes', () => {
    spyOn(component.paginationChange, 'emit');
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('paginationConfig', paginationConfig);

    fixture.detectChanges();
    const paginationComponent = fixture.nativeElement.querySelector('ds-pagination');
    paginationComponent.dispatchEvent(new Event('paginationChange'));
    expect(component.paginationChange.emit).toHaveBeenCalled();
  });
});
