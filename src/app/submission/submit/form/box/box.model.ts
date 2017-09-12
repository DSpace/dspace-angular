/**
 * An abstract model class for a submission edit form box.
 */
import { Component, OnChanges, OnInit, SimpleChanges, Type } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface BoxModel {
  data: any;
}

export class BoxItem {

  constructor(public component: Type<any>, public data: any) {
  }
}
