import { CARWAY_DayTrack_Provider } from './../../providers/CARWAY-model-daytrack-provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { CARWAY_Model_Service } from '../../models/CARWAY-model-service';
import { CARWAY_Picture_Provider } from '../../providers/CARWAY-picture-provider';
import { CARWAY_Model_Car_Provider } from '../../providers/CARWAY-model-car-provider';
import { CARWAY_Util_Text } from '../../util/CARWAY-util-text';

/**
 * Generated class for the PictureViewerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-picture-viewer',
  templateUrl: 'picture-viewer.html',
})
export class PictureViewerPage 
{
	private m_CARWAY_Model_Service:CARWAY_Model_Service = null;
	private m_nIndexDay:number = -1;
	private m_nIndexService:number = -1;
	private m_nIndexServiceItem:number = -1;
	private m_nIndexPicture:number = -1;
	private m_sBindShowPicture:boolean = false;
	private m_sBindPictureUrl:string = "";

	  constructor(
		  	public navCtrl: NavController, 
			public navParams: NavParams,
			private m_CARWAY_Picture_Provider:CARWAY_Picture_Provider,
			private m_CARWAY_Model_Car_Provider:CARWAY_Model_Car_Provider,
			private m_ViewController:ViewController,
			private m_ToastController:ToastController,
			private m_CARWAY_DayTrack_Provider:CARWAY_DayTrack_Provider) 
  	{
		this.m_CARWAY_Model_Service = this.navParams.get('CARWAY_Model_Service'); 
		this.m_nIndexDay = this.navParams.get('nIndexDay'); 
		this.m_nIndexService = this.navParams.get('nIndexService'); 
		this.m_nIndexServiceItem = this.navParams.get('nIndexServiceItem'); 
		this.m_nIndexPicture = this.navParams.get('nIndexPicture'); 
		//CARWAY_Util_Text.showMessage(this.m_ToastController,"m_nIndexPicture:"+this.m_nIndexPicture);
		this.loadPicture();
  }

	ionViewDidLoad() 
	{
		console.log('ionViewDidLoad PictureViewerPage');
	}

	private onClickPrev()
	{
		this.m_sBindShowPicture = false;

		this.m_nIndexPicture--;

		this.loadPicture();
	}
	
	private onClickNext()
	{
		this.m_sBindShowPicture = false;
		
		this.m_nIndexPicture++;

		this.loadPicture();
	}

	private onClickOK()
	{
		this.m_ViewController.dismiss();
	}

	private loadPicture()
	{
    	this.m_CARWAY_Picture_Provider.getDownloadPictureUrl(this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID, this.m_nIndexDay,this.m_nIndexService,this.m_nIndexServiceItem,this.m_nIndexPicture)
		.then 
		(
			(sPictureUrl:string) =>
			{
				this.m_sBindPictureUrl = sPictureUrl; 

				this.m_sBindShowPicture = true; 
			}
		);
	}

	private onClickDelete()
	{
		this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nIndexServiceItem].m_ArrayPictures.splice(this.m_nIndexPicture,1)
		
		this.m_CARWAY_DayTrack_Provider.saveService(this.m_CARWAY_Model_Service,this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,this.m_nIndexService);
    	this.m_CARWAY_Picture_Provider.deletePicture(this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID, this.m_nIndexDay,this.m_nIndexService,this.m_nIndexServiceItem,this.m_nIndexPicture);
		
		if(this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nIndexServiceItem].m_ArrayPictures.length == 0)
		{
			this.m_ViewController.dismiss();
		}
		else
		{
			this.m_nIndexPicture = 0;
			this.loadPicture();
		}
	}

	public clickedOverlay()
	{
		this.m_ViewController.dismiss();
	}
}