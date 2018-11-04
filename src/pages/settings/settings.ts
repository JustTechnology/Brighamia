import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { CARWAY_Model_Settings_Provider } from '../../providers/CARWAY-model-settings-provider';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams,public m_CARWAY_Model_Settings_Provider:CARWAY_Model_Settings_Provider,private toastController:ToastController) {
  }
  
  ionViewDidLoad() 
  {
    this.m_CARWAY_Model_Settings_Provider.readLocationSettings();
    
    let toast = this.toastController.create(
      {
        message: "Einstellungen werden geladen...:",
        duration: 3000,
      });
  
      toast.present();    console.log('ionViewDidLoad SettingsPage');
  }

  ionViewWillUnload()
  {
    let toast = this.toastController.create(
      {
        message: "Einstellungen werden gespeichert...:",
        duration: 3000,
      });
  
      toast.present();    console.log('ionViewDidLoad SettingsPage');
    
      this.m_CARWAY_Model_Settings_Provider.saveLocationSettings();
  }

  unload()
  {
    //this.viewCtrl.dismiss();
    //this.navCtrl.popToRoot();
    this.navCtrl.setRoot('HomePage');
    this.navCtrl.popToRoot();
        //this.navCtrl.remove(this.viewCtrl.index);    
  }

}
