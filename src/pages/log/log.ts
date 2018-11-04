import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CARWAY_Log_Provider } from '../../providers/CARWAY-log-provider';
import { CARWAY_Model_Log } from '../../models/CARWAY-model-log';

@IonicPage()
@Component({
  selector: 'page-log',
  templateUrl: 'log.html',
})

export class LogPage 
{
  logs:Array<CARWAY_Model_Log> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,private m_CARWAY_Log_Provider:CARWAY_Log_Provider) 
  {
    this.m_CARWAY_Log_Provider.add("LogPage","construct LogPage");
    
    console.log('construct LogPage');

  }

  ionViewDidLoad() 
  {
    this.logs = this.m_CARWAY_Log_Provider.get();
  }

}
