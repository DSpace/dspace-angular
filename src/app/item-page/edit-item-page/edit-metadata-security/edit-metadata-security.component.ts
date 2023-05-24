import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LevelSecurityConfig } from '../../../../config/metadata-security-config';
import { hasNoValue } from '../../../shared/empty.util';

@Component({
  selector: 'ds-edit-metadata-security',
  templateUrl: './edit-metadata-security.component.html',
  styleUrls: ['./edit-metadata-security.component.scss'],
})
export class EditMetadataSecurityComponent implements OnInit {
  @Input() securityLevel: number;
  @Input() securityConfigLevel: number[];
  @Output() changeSecurityLevel = new EventEmitter<number>();

  /**
   * Emits when a metadata field has a security level configuration
   */
  @Output() hasSecurityLevel = new EventEmitter<boolean>();

  public securityLevelsMap: LevelSecurityConfig[] = environment.security.levels;

  ngOnInit(): void {
    this.filterSecurityLevelsMap();
    this.hasSecurityLevel.emit(true);
  }

  /**
   * Check if the selected security level is different from the current level,
   * if so,update the security level & emit the new level
   * @param level The security level to change to
   */
  changeSelectedSecurityLevel(level: number) {
    if (this.securityLevel !== level) {
      this.securityLevel = level;
      this.changeSecurityLevel.emit(level);
    }
  }

  private filterSecurityLevelsMap() {
    this.securityLevelsMap = environment.security.levels;
    if (
      hasNoValue(this.securityConfigLevel) ||
      (this.securityConfigLevel.length === 1 &&
        this.securityConfigLevel.includes(0))
    ) {
      this.securityLevelsMap = null;
      this.changeSecurityLevel.emit(0);
    } else {
       // Filter securityLevelsMap based on securityConfigLevel
      this.securityLevelsMap = this.securityLevelsMap.filter(
        (el: any, index) => {
          return index === 0 || this.securityConfigLevel.includes(el.value);
        }
      );
    }
  }
}
