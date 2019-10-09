import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

export interface CommunityForList {
    name: string;
    subcoms?: CommunityForList[];
    collections?: string[];
    parent?: string;
}

@Injectable()
export class CommunityListService {

    private comList: CommunityForList[] = [
        {name: 'com1', subcoms: [{name: 'subcom1', subcoms: [{name: 'subsubcom1'}], collections: null, parent: 'com1'}], collections: ['col1', 'col2'], parent: null},
        {name: 'com2', subcoms: [{name: 'subcom2', subcoms: null, collections: null, parent: 'com2'}, {name: 'subcom3', subcoms: null, collections: null, parent: 'com2'}], collections: ['col3', 'col4'], parent: null},
        {name: 'com3', subcoms: [{name: 'subcom4', subcoms: null, collections: null, parent: 'com3'}], collections: ['col5'], parent: null},
    ];

    public getCommunityList(): Observable<CommunityForList[]> {
        return of(this.comList);
    }

}
