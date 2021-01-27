import { BehaviorSubject } from 'rxjs';
import { CountersSection } from './../../../core/layout/models/section.model';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ds-counters-section',
  templateUrl: './counters-section.component.html'
})
export class CountersSectionComponent implements OnInit {

    @Input()
    sectionId: string;

    @Input()
    countersSection: CountersSection;

    counterData: CounterData[] = [];
    counterData$ = new BehaviorSubject(this.counterData);


  constructor(private searchService: SearchService) {

   }

  ngOnInit() {
    for (const counter of this.countersSection.counterSettingsList) {
      this.counterData.push({
        count: '0',
        label: counter.entityName,
        icon: counter.icon,
        link: counter.link
      });
      this.counterData$.next(this.counterData);
    }
  }

}

export interface CounterData {
  label: string;
  count: string;
  icon: string;
  link: string;
}
