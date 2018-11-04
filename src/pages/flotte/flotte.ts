import { CARWAY_Model_Car_Provider } from './../../providers/CARWAY-model-car-provider';
import { CARWAY_Model_Car } from './../../models/CARWAY-model-car';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CARWAY_Util_Clone } from '../../util/CARWAY-util-clone';

@IonicPage()
@Component({
  selector: 'page-flotte',
  templateUrl: 'flotte.html',
})
export class FlottePage {

	constructor
		(
			public navCtrl: NavController, 
			public navParams: NavParams,
			public m_ModalController:ModalController,
			public m_CARWAY_Model_Car_Provider:CARWAY_Model_Car_Provider
		) 
	{

	}

	ionViewDidLoad() 
	{
    	console.log('ionViewDidLoad FlottePage');
  	}

  	private clickedSave()
	{
		this.navCtrl.pop();
	}

	private onClickFab()
	{
		let aClonedCARWAY_Model_Car:CARWAY_Model_Car = CARWAY_Util_Clone.cloneCar(this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car);

		var modalPage = this.m_ModalController.create('WizardPage',
		{ 
			flotte:true, 
			// state: eCARWAY_EDIT_STATE,
			// dayIndex: this.m_CARWAY_DayTrack_Provider.m_nActDayIndex, 
			// trackIndex:nTrackIndex
		}
		,
		{
			showBackdrop: false
		});

		modalPage.present();

		modalPage.onDidDismiss(bNewCarSaved =>
		{
			if(bNewCarSaved)
			{
				this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car = aClonedCARWAY_Model_Car;
			}
		});
	}
}
