import { Component, OnInit, Inject } from 'ng-metadata/core';
import { Phone, PhoneService } from '../core/phone.service';

@Component({
  selector: 'pc-phone-list',
  template: require('./phone-list.html')
})
export class PhoneListComponent implements OnInit{

  phones: Phone[] = [];
  orderProp: string = 'age';

  constructor(
    @Inject('Phone') private phoneSvc: PhoneService
  ){}

  ngOnInit(){

    this.phoneSvc
      .query()
      .then( ( phones ) => this.phones = phones );

  }
}
