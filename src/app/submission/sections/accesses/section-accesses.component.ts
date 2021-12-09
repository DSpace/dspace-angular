import { Component, OnInit } from '@angular/core';
import { renderSectionFor } from 'src/app/submission/sections/sections-decorator';
import { SectionsType } from 'src/app/submission/sections/sections-type';

@Component({
  selector: 'ds-section-accesses',
  templateUrl: './section-accesses.component.html',
  styleUrls: ['./section-accesses.component.scss']
})
@renderSectionFor(SectionsType.Accesses)
export class SubmissionSectionAccessesComponent implements OnInit {

  // tslint:disable-next-line:no-empty
  constructor() { }

  // tslint:disable-next-line:no-empty
  ngOnInit(): void {
  }

}
