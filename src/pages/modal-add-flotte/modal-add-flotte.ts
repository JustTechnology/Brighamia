import { CARWAY_Model_Car_Provider } from './../../providers/CARWAY-model-car-provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-add-flotte',
  templateUrl: 'modal-add-flotte.html',
})

export class ModalAddFlottePage 
{
	constructor(public navCtrl: NavController, public navParams: NavParams,private m_CARWAY_Model_Car_Provider:CARWAY_Model_Car_Provider) 
	{
		

	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAddFlottePage');
  }

	clickedOverlay()
	{
		this.navCtrl.pop();
	}

	clickedClose()
	{
		this.navCtrl.pop();
	}

	clickedSave()
	{
		
	}
}
