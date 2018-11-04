import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CARWAY_Log_Provider } from '../../providers/CARWAY-log-provider';
import { SelectSearchable } from '../../components/select-searchable/select-searchable';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  ports: any[];
  port: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private m_CARWAY_Log_Provider:CARWAY_Log_Provider) 
  {
    this.ports = [
      { id: 0, name: 'Tokai', country: 'Japan' },
      { id: 1, name: 'Vladivostok', country: 'Russia' },
      { id: 2, name: 'Navlakhi', country: 'India' }
  ];
   
    this.m_CARWAY_Log_Provider.add("ListPage","construct ListPage");
    console.log('construct ListPage');
    
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }
  portChange(event: { component: SelectSearchable, value: any }) {
    console.log('value:', event.value);
}
  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }
}
