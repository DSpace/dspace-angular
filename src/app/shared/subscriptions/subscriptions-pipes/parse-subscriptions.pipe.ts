import { Pipe, PipeTransform } from '@angular/core';
import { Subscription } from '../models/subscription.model';

@Pipe({ name: 'dsParseSubscriptions' })

export class ParseSubscriptionsPipe implements PipeTransform {

  transform(subscriptions: Subscription[]) {
    let result = [];

    subscriptions.forEach((subscription : any)=>{
      const arrayFound = result.find( (arrElement: any[]) => {
        return !!arrElement[0] && arrElement[0]._embedded.dSpaceObject.id == subscription._embedded.dSpaceObject.id;
      });

      if(!!arrayFound){
        arrayFound.push(subscription);
      }else{
        result.push([subscription]);
      }
    });

    return result;
  }

}
