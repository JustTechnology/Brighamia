import { CARWAY_Model_Service_Struct } from './../../models/CARWAY-model-service-struct';

import { CARWAY_Model_Service_Item } from './../../models/CARWAY-model-service-item';
import { CARWAY_Util_Currency } from '../../util/CARWAY-util-currency';
import { CARWAY_Model_Service_Item_Location } from '../../models/CARWAY-model-service-item-location';
import { CARWAY_Model_Service_Item_Costs } from '../../models/CARWAY-model-service-item-costs';
import { CARWAY_Model_Service_Item_Time } from '../../models/CARWAY-model-service-item-time';
import { CARWAY_Model_Service_Item_Array_Costs } from '../../models/CARWAY-model-service-item-array-costs';
import { CARWAY_Model_Service_Item_Select } from '../../models/CARWAY-model-service-item-select';
import { CARWAY_Model_Service_Item_Text } from '../../models/CARWAY-model-service-item-text';
import { CARWAY_Util_Date } from '../../util/CARWAY-util-date';
import { Component, ViewChild } from '@angular/core';
import { TabsService } from '../../services/tabs-service';
import { IonicPage, ModalController, Events, Slides, FabContainer, ToastController, AlertController, Platform } from 'ionic-angular';
import { CARWAY_DayTrack_Provider } from '../../providers/CARWAY-model-daytrack-provider';
import { CARWAY_WIZARD_OBJECT, CARWAY_EDIT_TYPE, CARWAY_KEY_TYPE, CARWAY_DISTANCES } from '../../providers/constants-provider';
import { Http } from '@angular/http';
import { CARWAY_Model_Service } from '../../models/CARWAY-model-service';
import { CARWAY_Model_Settings_Provider } from '../../providers/CARWAY-model-settings-provider';
import { CARWAY_Util_Text } from '../../util/CARWAY-util-text';
import { EmailComposer } from '@ionic-native/email-composer'
import { LongPressModule } from 'ionic-long-press';
import { CarwayModelServiceStructProvider } from '../../providers/CARWAY-model-service-struct-provider';
import { CARWAY_Util_Clone } from '../../util/CARWAY-util-clone';
import { CARWAY_Util } from '../../util/CARWAY-util';

@IonicPage()
@Component({
	templateUrl: 'tab-page-3.html',
	providers: [TabsService],
	selector: 'tab-page-3'
})

export class TabPage3 
{
	@ViewChild('fab')fab : FabContainer;
	@ViewChild('slides') slides: Slides;

	MyCARWAY_WIZARD_OBJECT = CARWAY_WIZARD_OBJECT;
	MyCARWAY_EDIT_TYPE = CARWAY_EDIT_TYPE;

	public m_bArrayExtendedView:Array<boolean>;
	private m_bIsFabOpen:boolean = false;
	private m_bPreventFirstSlide = true;

	private m_oTotalPriceToday:any;
	private m_oTotalPriceWeek:any;
	private m_oTotalPriceAll:any;
	private m_bShowEmail:boolean = true;
	private m_bCanOpenEditService:boolean = true;

	constructor
	(
		private m_CARWAY_DayTrack_Provider:CARWAY_DayTrack_Provider,
		private modalController:ModalController,
		private toastController:ToastController,
		private m_Events:Events,
		private http:Http,
		private m_CARWAY_Model_Settings_Provider:CARWAY_Model_Settings_Provider,
		private m_AlertController:AlertController,
		private m_EmailComposer:EmailComposer,
		private m_Platform:Platform,
		private m_CarwayModelServiceStructProvider:CarwayModelServiceStructProvider) 
	{
		console.log("m_CarwayModelServiceStructProvider:"+JSON.stringify(this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct));
		this.m_bArrayExtendedView = new Array<boolean>();
	}

	private ionViewDidLoad()
	{
		if(!this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model)
		{
			this.m_Events.subscribe('loading_Tracks', (data) => 
			{ 
				this.calculatePriceTimeIntervall(CARWAY_DISTANCES.ALL);
			});
		}
		else
		{
			this.calculatePriceTimeIntervall(CARWAY_DISTANCES.ALL);
		}

		this.m_bShowEmail  = this.m_Platform.is('cordova'); 
	}

	nextSlide()
	{  
		if(this.m_bPreventFirstSlide) 
		{
			this.m_bPreventFirstSlide = false;
			return;
		}

		this.fab.close();

		this.m_CARWAY_DayTrack_Provider.m_nActDayIndex = this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_nIndexNextCARWAYModelDay;
		
		let nNextNextDayIndex = this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[2].m_nIndexNextCARWAYModelDay;
		
		if(nNextNextDayIndex==-1)
		{
			let nNextNextDayKey:number = CARWAY_Util_Date.getDayKeyAddDay(this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[2].m_nTrackDayKey,CARWAY_KEY_TYPE.DATE,1);
		
			this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks.push(this.m_CARWAY_DayTrack_Provider.createDay(nNextNextDayKey));	
		} 
		else
		{
			this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks.push(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nNextNextDayIndex]);	
		}
		
		this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks.shift();

		this.calculatePriceTimeIntervall(CARWAY_DISTANCES.ALL);

		this.slides.slideTo(1, 0, false);
	}

	prevSlide()
	{
		if(this.m_bPreventFirstSlide) 
		{
			this.m_bPreventFirstSlide = false;
			return;
		}

		this.fab.close();
		
		this.m_CARWAY_DayTrack_Provider.m_nActDayIndex = this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_nIndexPreviousCARWAYModelDay;
		
		let nPreviousPreviousDayIndex = this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[0].m_nIndexPreviousCARWAYModelDay;
		
		if(nPreviousPreviousDayIndex==-1)
		{
			let nPreviousPreviousDayKey:number = CARWAY_Util_Date.getDayKeyAddDay(this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[0].m_nTrackDayKey,CARWAY_KEY_TYPE.DATE,-1);
		
			this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks.unshift(this.m_CARWAY_DayTrack_Provider.createDay(nPreviousPreviousDayKey));	
		}
		else
		{
			this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks.unshift(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nPreviousPreviousDayIndex]);	
		}
		
		this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks.pop();
		
		this.calculatePriceTimeIntervall(CARWAY_DISTANCES.ALL);
			
		this.slides.slideTo(1, 0, false);
	}

	private onClickOpenService(nIndexServiceStruct:number)
	{
		if(this.fab)
		{
			this.fab.close();
		}

		let aCARWAY_Model_Service:CARWAY_Model_Service = CARWAY_Util.convertServiceStructToServiceItemArray(this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct[nIndexServiceStruct]);
		
		this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service ? 1 : this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service = new Array<CARWAY_Model_Service>();

		this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service.push(aCARWAY_Model_Service);
	
		this.openWizard(CARWAY_EDIT_TYPE.NEW,-1,aCARWAY_Model_Service);	
	}

	private onClickAddServiceGasoline()
	{	
		if(this.fab)
		{
			this.fab.close();
		}

		let aCARWAY_Model_Service:CARWAY_Model_Service = new CARWAY_Model_Service("Tanken");

		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item ? 1 : aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item = new Array<CARWAY_Model_Service_Item>(); 

		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Location("Wo hast du getankt?","Hier den Ort der Tankstelle auswählen ",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Time("Wann hast du getankt?","00:00",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Array_Costs("Wieviel hat der Sprit gekostet?","Benzin/Super/Diesel","", new CARWAY_Model_Service_Item_Costs("")));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Text("Möchtest du etwas dazu sagen?","Beliebiger Kommentar",""));
	
		this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service ? 1 : this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service = new Array<CARWAY_Model_Service>();

		this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service.push(aCARWAY_Model_Service);
	
		this.openWizard(CARWAY_EDIT_TYPE.NEW,-1,aCARWAY_Model_Service);
	}
	
	private onClickAddServiceRepair()
	{	
		if(this.fab)
		{
			this.fab.close();
		}

		let aCARWAY_Model_Service:CARWAY_Model_Service = new CARWAY_Model_Service("Reparatur");

		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item ? 1 : aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item = new Array<CARWAY_Model_Service_Item>(); 
		
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Select("Wieso warst du in der Werkstatt?","","",["Ungeplante Inspektion","Schaden"]));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Text("Bei welchen Kilometerstand?","Hier Kilometerstand eingeben",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Location("Wo warst du in der Werkstatt?","Hier den Ort der Werkstatt eingeben",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Time("Von wann warst du in der Werkstatt?","00:00",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Time("Bis wann warst du in der Werkstatt?","00:00",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Array_Costs("Was hat die Werkstatt gekostet?","","", new CARWAY_Model_Service_Item_Costs("")));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Text("Noch irgendetwas?","Beliebiger Kommentar",""));
	
		if(!this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service)
		{
			this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service = new Array<CARWAY_Model_Service>();
		}	

		this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service.push(aCARWAY_Model_Service);
	
		this.openWizard(CARWAY_EDIT_TYPE.NEW,-1,aCARWAY_Model_Service);
	}
	
	private onClickAddServiceInspektion()
	{	
		if(this.fab)
		{
			this.fab.close();
		}

		let aCARWAY_Model_Service:CARWAY_Model_Service = new CARWAY_Model_Service("Inspektion");

		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item ? 1 : aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item = new Array<CARWAY_Model_Service_Item>(); 
		
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Text("Welcher Kilometerstand hat dein Auto?","Hier Kilometerstand eingeben",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Location("Wo warst du in der Werkstatt?","Hier den Ort der Werkstatt eingeben",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Time("Von wann warst du in der Werkstatt?","00:00",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Time("Bis wann warst du in der Werkstatt?","00:00",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Array_Costs("Was hat die Werkstatt gekostet?","","", new CARWAY_Model_Service_Item_Costs("")));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Text("Noch irgendetwas?","Beliebiger Kommentar",""));
	
		if(!this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service)
		{
			this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service = new Array<CARWAY_Model_Service>();
		}	

		this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service.push(aCARWAY_Model_Service);
	
		this.openWizard(CARWAY_EDIT_TYPE.NEW,-1,aCARWAY_Model_Service);
	}
	
	private onClickAddServiceCleanpark()
	{	
		if(this.fab)
		{
			this.fab.close();
		}

		let aCARWAY_Model_Service:CARWAY_Model_Service = new CARWAY_Model_Service("Waschanlage");

		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item ? 1 : aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item = new Array<CARWAY_Model_Service_Item>(); 
		
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Text("Wieso warst du in der Waschanlage?","Geplant/Ausflug",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Location("Wo warst du in der Waschanlage?","Hier den Ort der Waschanlage eingeben",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Time("Von wann warst du in der Waschanlage?","00:00",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Time("Bis wann warst du in der Waschanlage?","00:00",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Array_Costs("Was hat die Waschanlage gekostet?","","", new CARWAY_Model_Service_Item_Costs("")));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Text("Noch irgendetwas?","Beliebiger Kommentar",""));
	
		if(!this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service)
		{
			this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service = new Array<CARWAY_Model_Service>();
		}	

		this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service.push(aCARWAY_Model_Service);
	
		this.openWizard(CARWAY_EDIT_TYPE.NEW,-1,aCARWAY_Model_Service);
	}

	private onClickAddServiceOil()
	{	
		if(this.fab)
		{
			this.fab.close();
		}

		let aCARWAY_Model_Service:CARWAY_Model_Service = new CARWAY_Model_Service("Ölstand kontrollieren");

		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item ? 1 : aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item = new Array<CARWAY_Model_Service_Item>(); 
		
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Location("Wo hast du den Ölstand kontrolliert?","Hier den Ort der Waschanlage eingeben",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Time("Wann hast  du den Ölstand kontrolliert?","00:00",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Select("War genug Öl im Motor?","","",["Ja, genug","Nein, Öl hat gefehlt"]));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Array_Costs("Was hat das Öl gekostet?","","", new CARWAY_Model_Service_Item_Costs("")));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Text("Noch irgendetwas?","Beliebiger Kommentar",""));
	
		if(!this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service)
		{
			this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service = new Array<CARWAY_Model_Service>();
		}	

		this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service.push(aCARWAY_Model_Service);
	
		this.openWizard(CARWAY_EDIT_TYPE.NEW,-1,aCARWAY_Model_Service);
	}

	private onClickAddServiceCrash()
	{	
		if(this.fab)
		{
			this.fab.close();
		}

		let aCARWAY_Model_Service:CARWAY_Model_Service = new CARWAY_Model_Service("Unfall aufnahmen");

		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item ? 1 : aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item = new Array<CARWAY_Model_Service_Item>(); 
		
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Location("Wo ist der Unfall passiert?","Hier den Ort des Unfalls eingeben",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Time("Wann ist der Unfall passiert?","00:00",""));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Select("Ist der Unfall selbstverschuldet?","","",["Ja,","Nein","Unklar"]));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Select("Wurde die Polizei eingeschaltet?","","",["Ja,","Nein"]));
		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Text("Noch irgendetwas?","Beliebiger Kommentar",""));
	
		if(!this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service)
		{
			this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service = new Array<CARWAY_Model_Service>();
		}	

		this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service.push(aCARWAY_Model_Service);
	
		this.openWizard(CARWAY_EDIT_TYPE.NEW,-1,aCARWAY_Model_Service);
	}

	private deleteService(nServiceIndex:number)
	{
		if(this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_bShowDeleteMessage)
		{
			let alert = this.m_AlertController.create();
			
			alert.setTitle("Service löschen");
			
			alert.setMessage("Möchten Sie diesen Service wirklich löschen?");
		
			alert.addButton({
				text: 'Nein',
				handler: data => 
				{
				
				}
			});
			
			alert.addButton({
				text: 'Ja',
				handler: data => 
				{
					this.m_CARWAY_DayTrack_Provider.deleteService(this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,nServiceIndex);
					this.calculatePriceTimeIntervall(CARWAY_DISTANCES.ALL);
				}
			});

			alert.addButton({
				text: 'Ja, nicht mehr nachfragen',
				handler: data => 
				{
					this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_bShowDeleteMessage = false;
					this.m_CARWAY_Model_Settings_Provider.saveLocationSettings();
					this.m_CARWAY_DayTrack_Provider.deleteService(this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,nServiceIndex);
					this.calculatePriceTimeIntervall(CARWAY_DISTANCES.ALL);
				}
			});
			
			alert.present();
		}
		else
		{
			this.m_CARWAY_DayTrack_Provider.deleteService(this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,nServiceIndex);
			this.calculatePriceTimeIntervall(CARWAY_DISTANCES.ALL);
		}
	}

	private editService(nServiceModelIndex:number)
	{
		this.openWizard(CARWAY_EDIT_TYPE.WIZARD,nServiceModelIndex,this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Service[nServiceModelIndex]);
	}

	private openWizard(aCARWAY_EDIT_TYPE:CARWAY_EDIT_TYPE,nServiceModelIndex:number,aCARWAY_Model_Service:CARWAY_Model_Service)
	{
		var modalPage = this.modalController.create('ServiceWizardPage',{CARWAY_Model_Service:aCARWAY_Model_Service,CARWAY_Model_Service_Index:nServiceModelIndex,CARWAY_EDIT_TYPE:aCARWAY_EDIT_TYPE},{showBackdrop: false});
		
		modalPage.onDidDismiss(bSuccess => 
		{
			this.deleteEmptyCosts(aCARWAY_Model_Service);
			
			this.calculateTotal(aCARWAY_Model_Service);

			this.calculatePriceTimeIntervall(CARWAY_DISTANCES.ALL);

			this.m_CARWAY_DayTrack_Provider.saveService(aCARWAY_Model_Service,this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_arrayCARWAY_Model_Service.length-1);
	   });

		modalPage.present();
	}

	private calculateTotal(aCARWAY_Model_Service:CARWAY_Model_Service)
	{
		let aArrayCARWAY_Model_Service_Item_Array_Costs = new Array<CARWAY_Model_Service_Item_Array_Costs>();

		for(let i=0 ; i<aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.length ; i++)
		{
			if(aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[i].m_Type == CARWAY_WIZARD_OBJECT.COSTS)
			{
				aArrayCARWAY_Model_Service_Item_Array_Costs.push(<CARWAY_Model_Service_Item_Array_Costs>aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[i]);
			}
		}
		
		aCARWAY_Model_Service.m_oPrice = CARWAY_Util_Currency.calculateTotalArray(aArrayCARWAY_Model_Service_Item_Array_Costs);
	}

	private deleteEmptyCosts(aCARWAY_Model_Service:CARWAY_Model_Service)
	{
		let aArrayCARWAY_Model_Service_Item_Array_Costs = new Array<CARWAY_Model_Service_Item_Array_Costs>();

		for(let i=0 ; i<aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.length ; i++)
		{
			if(aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[i].m_Type == CARWAY_WIZARD_OBJECT.COSTS)
			{
				let aCARWAY_Model_Service_Item_Array_Costs:CARWAY_Model_Service_Item_Array_Costs = <CARWAY_Model_Service_Item_Array_Costs>aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[i];
				console.log("deleteEmptyCosts Kostenobjekt gefunden. Länge alt"+aCARWAY_Model_Service_Item_Array_Costs.m_Array_CARWAY_Model_Service_Item_Costs.length);
			
				for(let j=0 ; j<aCARWAY_Model_Service_Item_Array_Costs.m_Array_CARWAY_Model_Service_Item_Costs.length-1 ; j++)
				{
					console.log("j:"+j);
					if(CARWAY_Util_Currency.getValue(aCARWAY_Model_Service_Item_Array_Costs.m_Array_CARWAY_Model_Service_Item_Costs[j].m_oPrice)<=0)
					{
						aCARWAY_Model_Service_Item_Array_Costs.m_Array_CARWAY_Model_Service_Item_Costs.splice(j,1);
						j=j-1;
					}
				}	
				console.log("deleteEmptyCosts Länge neu:"+aCARWAY_Model_Service_Item_Array_Costs.m_Array_CARWAY_Model_Service_Item_Costs.length);
			}
		}
	}

	private onClickCreateEigene(nIndexServiceStruct:number)
	{
		var modalPage = this.modalController.create('ServicePage',
		{ 
			nServiceStructIndex:-1
		}
		,
		{
			showBackdrop: false
		});

		modalPage.present();
	}

	public eMailService(nDayIndex:number,nServiceIndex:number)
	{
		CARWAY_Util_Text.sendEMail(this.m_EmailComposer,this.toastController,this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Service[nServiceIndex].toString());
	}

	private onClickFab()
	{
		if(this.m_bIsFabOpen)
		{
			this.fab.close();
		}
		
		this.m_bIsFabOpen = !this.m_bIsFabOpen;
	}

	private calculatePriceTimeIntervall(aCARWAY_DISTANCES:CARWAY_DISTANCES) 
	{
		console.log("calculateDurationTimeIntervall");
		switch(aCARWAY_DISTANCES)
		{
			case CARWAY_DISTANCES.ALL:
				this.m_oTotalPriceAll = CARWAY_Util_Currency.sumPriceAllAsync(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model);
		
			case CARWAY_DISTANCES.WEEK:
				this.m_oTotalPriceWeek = CARWAY_Util_Currency.sumPriceWeekAsync(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model,CARWAY_Util_Date.getDateTimeFromKey(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_nTrackDayKey,CARWAY_KEY_TYPE.DATE));
			
			case CARWAY_DISTANCES.DAY:
				this.m_oTotalPriceToday = CARWAY_Util_Currency.sumPriceDayAsync(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex]);
				break;
		}
	}

	private eventClickedSlidePrevious()
	{
	  this.nextSlide();
	}
	private eventClickedSlideNext()
	{
	  this.prevSlide();
	}

	private onLongClickEditServiceStruct(nServiceStructIndex:number)
	{
		if(!this.m_bCanOpenEditService)
		{
			return;
		}

		let aCARWAY_Model_Service_Struct:CARWAY_Model_Service_Struct = CARWAY_Util_Clone.cloneServiceStruct(this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct[nServiceStructIndex]);

		this.m_bCanOpenEditService = false;
		
		var modalPage = this.modalController.create('ServicePage',
		{ 
			nServiceStructIndex:nServiceStructIndex
		}
		,
		{
			showBackdrop: false
		});

		modalPage.present();
		
		this.fab.close();
		this.m_bIsFabOpen = false;

		modalPage.onDidDismiss(bSave =>
		{
			this.m_bCanOpenEditService = true;
			
			if(!bSave)
			{
				this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct[nServiceStructIndex] = aCARWAY_Model_Service_Struct;
			}
		});
	}
}