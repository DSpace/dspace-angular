import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges
} from '@angular/core';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'ds-edit-metadata-security',
  templateUrl: './edit-metadata-security.component.html',
  styleUrls: ['./edit-metadata-security.component.scss'],

})
export class EditMetadataSecurityComponent implements OnInit, OnChanges {

  @Input() securityLevel: number;
  @Input() securityConfigLevel: number;
  @Output() changeSecurityLevel = new EventEmitter<number>()
  public securityLevelsMap: Record<number, String>[] = environment.security.levels;

  constructor() {
  }

  ngOnInit(): void {
    this.filterSecurityLevelsMap();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['securityConfigLevel'] && changes['securityConfigLevel'].currentValue) {
      this.filterSecurityLevelsMap();
    }
  }

  changeSelectedSecurity(number: number) {
    this.changeSecurityLevel.emit(number);
  }

  private filterSecurityLevelsMap() {
    this.securityLevelsMap = environment.security.levels;
     if (this.securityConfigLevel) {
      this.securityLevelsMap = this.securityLevelsMap.filter((el: any) => {
        return el.value < this.securityConfigLevel && this.securityConfigLevel > 0 && this.securityConfigLevel > 1
      })
    }
   }
}
