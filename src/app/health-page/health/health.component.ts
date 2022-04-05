import { Component, OnInit } from '@angular/core';
import { HealthDataService } from '../health-data.service';


enum HealthStatus {
  UP = 'UP',
  UP_WITH_ISSUES = 'UP_WITH_ISSUES',
  DOWN = 'DOWN'
}
@Component({
  selector: 'ds-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']
})
export class HealthComponent implements OnInit {
  healthArr: string[];
  serverInfoArr: string[];
  healthGlobalStatus: string;
  activeId ='Health';
  constructor(private healthDataService: HealthDataService) { }

  ngOnInit(): void {
    this.healthDataService.getHealth().subscribe((data) => {
       this.healthArr = this.getHealth(data.payload.components);
       this.healthGlobalStatus = data.payload.status;
    });

    this.healthDataService.getInfo().subscribe((data) => {
      this.serverInfoArr =  this.getInfo(data.payload, null, []);
    });
  }

  /**
   * @param obj represents a info
   * @param key represents a nested key of info
   * @param arr represents a  key value pair or only key
   * @returns {{arr}} of key value pair or only key
   */
  getInfo(obj, key, arr) {
      if (typeof obj === 'object' && key !== null) {
          arr.push({style: {'font-weight': 'bold' ,'font-size.px': key === 'app' ? '30' : '20' }, value: key});
      }
      if (typeof obj !== 'object') {
          arr.push({style: {'font-size.px': '15'}, value: `${key} =  ${obj}`});
          return obj;
      }
      // tslint:disable-next-line: forin
      for (const objKey in obj) {
          this.getInfo(obj[objKey], objKey, arr);
      }
      return arr;
  }

  /**
   * @param subCompObj represent nested sub component
   * @param superCompkey represents a key of super component
   * @returns linear components array
   */
  getHealthSubComponents(subCompObj, superCompkey) {
    const subCompArr = [];
    // tslint:disable-next-line: forin
    for (const key in subCompObj) {
        subCompArr.push({ ...subCompObj[key], components: superCompkey + '.' + key });
    }
    return subCompArr;
  }

  /**
   * @param componentsObj represent health data
   * @returns linear components array
   */
  getHealth(componentsObj) {
    let componentsArr = [];
    for (const key in componentsObj) {
        if (componentsObj[key].hasOwnProperty('components')) {
            componentsArr.push({ ...componentsObj[key], components: key });
            // tslint:disable-next-line: no-string-literal
            componentsArr = [...componentsArr, ...this.getHealthSubComponents(componentsObj[key]['components'], key)];
        } else {
            componentsArr.push({ ...componentsObj[key], components: key });
        }
    }
    return componentsArr;
  }

  /**
   * @param  status of perticular block
   * @returns {{ string }} class respective status
   */
  getHealthIconClass(status: string): string {
    if (status === HealthStatus.UP) {
      return 'fa fa-check-circle text-success ml-2 mt-1';
    } else if (status === HealthStatus.UP_WITH_ISSUES) {
      return 'fa fa-exclamation-triangle text-warning ml-2 mt-1';
    } else {
      return 'fa fa-times-circle circle-red ml-2 mt-1';
    }
  }

}
