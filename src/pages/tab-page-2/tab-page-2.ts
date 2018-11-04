import { Component } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { TabsService } from '../../services/tabs-service';
import { IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';


@IonicPage()
@Component({
  templateUrl: 'tab-page-2.html',
  providers: [TabsService],
  selector: 'tab-page-2'
})
export class TabPage2 {
    params:any = {};
    information: any[];

    constructor(private tabsService: TabsService, private toastCtrl: ToastService, private http: Http) {
      this.tabsService.load("tab2").subscribe(snapshot => {
        this.params = snapshot;

        let localData = this.http.get('assets/information.json').map(res => res.json().items);
        localData.subscribe(data => {
          this.information = data;
        })
      });
    }

  toggleSection(i) {
    
    this.information[i].open = !this.information[i].open;
  }
 
  toggleItem(i, j) {
    this.information[i].children[j].open = !this.information[i].children[j].open;
  }
    ngOnChanges(changes: { [propKey: string]: any }) {
      this.params = changes['data'].currentValue;
    }

    onItemClick(item:any) {
        this.toastCtrl.presentToast("Folow");
    }
}
