import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LevelSecurityConfig } from '../../../../config/metadata-security-config';

@Component({
  selector: 'ds-edit-metadata-security',
  templateUrl: './edit-metadata-security.component.html',
  styleUrls: ['./edit-metadata-security.component.scss'],

})
export class EditMetadataSecurityComponent implements OnInit, OnChanges {

  @Input() securityLevel: number;
  @Input() securityConfigLevel: number[];
  @Output() changeSecurityLevel = new EventEmitter<number>();
  public securityLevelsMap: LevelSecurityConfig[] = environment.security.levels;

  ngOnInit(): void {
    this.filterSecurityLevelsMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.securityConfigLevel && changes.securityConfigLevel.currentValue) {
      this.filterSecurityLevelsMap();
    }
  }

  changeSelectedSecurity(level: number) {
    this.changeSecurityLevel.emit(level);
  }

  private filterSecurityLevelsMap() {
    this.securityLevelsMap = environment.security.levels;
    if (this.securityConfigLevel === undefined) {
      this.securityLevelsMap = null;
    } else {
      if (this.securityConfigLevel === null) {
        this.securityLevelsMap = null;
        this.changeSecurityLevel.emit(0);
      } else {
        if (this.securityConfigLevel.length === 1 && this.securityConfigLevel.includes(0)) {
          this.securityLevelsMap = null;
          this.changeSecurityLevel.emit(0);
        } else {
          if (this.securityConfigLevel.length === 1) {
            // include even value 0 => public
            this.securityLevelsMap = this.securityLevelsMap.filter((el: any, index) => {
              return index === 0 || this.securityConfigLevel.includes(el.value);
            });
          } else {
            this.securityLevelsMap = this.securityLevelsMap.filter((el: any) => {
              return this.securityConfigLevel.includes(el.value);
            });
          }
        }
      }
    }
  }
}
