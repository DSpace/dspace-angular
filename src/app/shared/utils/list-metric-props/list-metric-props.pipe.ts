import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dsListMetricProps',
})
export class ListMetricPropsPipe implements PipeTransform {
  transform(remark: JSON, property: string, isListElement: boolean): any {
    if (isListElement) {
      return remark[`list-${property}`] ? remark[`list-${property}`] : null;
    } else {
      return remark[property] ? remark[property] : null;
    }
  }
}
