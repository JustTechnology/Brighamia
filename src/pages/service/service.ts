import { CARWAY_Model_Service_Struct_Item } from './../../models/CARWAY-model-service-struct-item';
import { CARWAY_Model_Service_Struct } from './../../models/CARWAY-model-service-struct';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, reorderArray, FabContainer, ViewController } from 'ionic-angular';
import { CarwayModelServiceStructProvider } from '../../providers/CARWAY-model-service-struct-provider';
import { CARWAY_WIZARD_OBJECT } from '../../providers/constants-provider';
import { CARWAY_Model_Car_Provider } from '../../providers/CARWAY-model-car-provider';

@IonicPage()

@Component({
	selector: 'page-service',
	templateUrl: 'service.html',
})

export class ServicePage 
{
	@ViewChild('fab')fab : FabContainer;
	
	private m_CARWAY_Model_Service_Struct:CARWAY_Model_Service_Struct;
	MyCARWAY_WIZARD_OBJECT = CARWAY_WIZARD_OBJECT;

	private m_nServiceStructIndex:number = -1;
	private m_bIsFabOpen:boolean = false;
	
	private data;

	constructor
	(
		public navCtrl: NavController,
		public navParams: NavParams,
		public m_CarwayModelServiceStructProvider:CarwayModelServiceStructProvider,
		public viewController:ViewController,
		private m_CARWAY_Model_Car_Provider:CARWAY_Model_Car_Provider
	) 
	{
		console.log("construct ServicePage");    

		this.m_nServiceStructIndex = this.navParams.get('nServiceStructIndex'); 
		console.log("construct ServicePage"+this.m_nServiceStructIndex);    


		if(this.m_nServiceStructIndex == -1)
		{
			this.m_CARWAY_Model_Service_Struct = new CARWAY_Model_Service_Struct();
		}
		else
		{
			this.m_CARWAY_Model_Service_Struct = this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct[this.m_nServiceStructIndex];
		}

		/*if(this.m_CarwayModelServiceStructProvider)
		{
			console.log("construct ServicePage m_CarwayModelServiceStructProvider OK");
			if(this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct)
			{
				console.log("construct ServicePage m_Array_CARWAY_Model_Service_Struct OK");
				if(this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct[this.m_nServiceStructIndex])
				{
					console.log("construct ServicePage m_nServiceStruct  Array OK");
					if(this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct[this.m_nServiceStructIndex].m_ServiceStruct)
					{
						console.log("construct ServicePage m_ServiceStruct OK");
						if()
						{
							console.log("construct ServicePage m_ServiceStructItemArray  OK");
							if(this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct[this.m_nServiceStructIndex].m_ServiceStruct[this.m_nServiceIndex].m_arrayCARWAY_Model_Service_Item)
							{
								console.log("construct ServicePage m_ServiceStructItemArray  OK");
							}
							
						}
					}
				}
			}
		}*/

		this.data = {
			"title":"Playlist Name",
			"description":"Author: Username",
			"duration":"35:72",
			"icon":"icon-check",
			"items":[
			   {
				  "id":1,
				  "title":"Ort",
				  "author":"An welchem ort haben Sie getankt?",
				  "image":"assets/images/avatar/0.jpg",
				  "leftIcon":"icon-play-circle",
				  "rightIcon":"icon-unfold-more"
			   },
			   {
				  "id":2,
				  "title":"Kosten",
				  "author":"Wie hoch waren die Kosten?",
				  "image":"assets/images/avatar/1.jpg",
				  "leftIcon":"icon-play-circle",
				  "rightIcon":"icon-unfold-more"
			   },
			   {
				  "id":3,
				  "title":"Beschreibung",
				  "author":"Kommentar",
				  "image":"assets/images/avatar/2.jpg",
				  "leftIcon":"icon-play-circle",
				  "rightIcon":"icon-unfold-more"
			   }
			]};
	}

	ionViewDidLoad() 
	{

	}

	private onClickFab()
	{
		if(this.m_bIsFabOpen)
		{
			this.fab.close();
		}
		 
		this.m_bIsFabOpen = !this.m_bIsFabOpen;
	}

	reorderItems = (indexes): void => 
	{
	    this.data.items = reorderArray(this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct[this.m_nServiceStructIndex].m_ArrayCarwayModelServiceStructItem, indexes);
	}
	
	private onClickDeleteServiceStruct()
	{
		this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct.splice(this.m_nServiceStructIndex,1);
		this.m_CarwayModelServiceStructProvider.save(this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID);

		this.viewController.dismiss(true);
	}

	private onClickClose()
	{
		this.viewController.dismiss(false);
	}

	private onClickAddBeschreibung()
	{
		this.fab.close();
		
		this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem ? 1 : this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem = new Array<CARWAY_Model_Service_Struct_Item>();

		this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem.push(new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.TEXT));
	}

	private onClickAddZeit()
	{
		this.fab.close();
		
		this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem ? 1 : this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem = new Array<CARWAY_Model_Service_Struct_Item>();

		this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem.push(new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.TIME));
	}

	private onClickAddKosten()
	{
		this.fab.close();
		
		this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem ? 1 : this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem = new Array<CARWAY_Model_Service_Struct_Item>();

		this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem.push(new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.COSTS));
	}

	private onClickAddAuswahl()
	{
		this.fab.close();
		
		this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem ? 1 : this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem = new Array<CARWAY_Model_Service_Struct_Item>();

		this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem.push(new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.SELECT));
	}

	private onClickAddOrt()
	{
		this.fab.close();
		
		this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem ? 1 : this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem = new Array<CARWAY_Model_Service_Struct_Item>();
		
		this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem.push(new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.LOCATION));
	}

	private onClickDeleteService(nIndex:number)
	{
		this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem.splice(nIndex,1);

		if(this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem.length==0)
		{
			this.m_CARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem = null;
		}
	}

	private onClickSave()
	{
		if(this.m_nServiceStructIndex == -1)
		{
			this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct.push(this.m_CARWAY_Model_Service_Struct);
			this.m_CarwayModelServiceStructProvider.saveServiceStructItem(this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct.length-1);
		}
		else
		{
			this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct[this.m_nServiceStructIndex] = this.m_CARWAY_Model_Service_Struct;		
			this.m_CarwayModelServiceStructProvider.saveServiceStructItem(this.m_nServiceStructIndex);
		}

		this.viewController.dismiss(true);  
	}
} 