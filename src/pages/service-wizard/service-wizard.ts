import { CARWAY_DayTrack_Provider } from './../../providers/CARWAY-model-daytrack-provider';
import { CARWAY_Model_Service_Item_Location } from './../../models/CARWAY-model-service-item-location';
import { CARWAY_Model_Service_Item_Costs } from '../../models/CARWAY-model-service-item-costs';
import { Component, ViewChild,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Keyboard, AlertController, Platform, ModalController } from 'ionic-angular';
import { CARWAY_WIZARD_OBJECT, CARWAY_EDIT_TYPE, LOADING_POSITION_STATE, GlobalConstants } from '../../providers/constants-provider';
import { CARWAY_Model_Service_Item_Time } from '../../models/CARWAY-model-service-item-time';
import { CARWAY_Model_Service_Item_Array_Costs } from '../../models/CARWAY-model-service-item-array-costs';
import { Geolocation } from '@ionic-native/geolocation';
import { CARWAY_Model_Service } from '../../models/CARWAY-model-service';
import { CARWAY_Util_Currency } from '../../util/CARWAY-util-currency';
import { CARWAY_Picture_Provider } from '../../providers/CARWAY-picture-provider';
import { CARWAY_Util_Geolocation } from '../../util/CARWAY-util-geolocation';
import { CarwayLocationTrackerProvider } from '../../providers/carway-location-tracker';
import { CARWAY_Util_Clone } from '../../util/CARWAY-util-clone';
import { CARWAY_Geoposition } from '../../models/CARWAY-model-geoposition';
import { CARWAY_Model_Settings_Provider } from '../../providers/CARWAY-model-settings-provider';
import { CARWAY_Model_Car_Provider } from '../../providers/CARWAY-model-car-provider';
import { CARWAY_Log_Provider } from '../../providers/CARWAY-log-provider';

declare var google:any; 


@IonicPage()
@Component({
selector: 'page-service-wizard',
templateUrl: 'service-wizard.html',
})

export class ServiceWizardPage 
{
	@ViewChild('InputMinute') InputMinute;
	
	private m_bindFormattedAdress:string = "";
	private placesService:google.maps.places.PlacesService = null;
	private places:Array<any> = [];	
	private searchDisabled:boolean = true; 
	private query:string = "";
	private m_Map :google.maps.Map;
	private m_bGPSInstalled:boolean = false;
	MyCARWAY_WIZARD_OBJECT = CARWAY_WIZARD_OBJECT;
	MyCARWAY_EDIT_TYPE = CARWAY_EDIT_TYPE;

	private m_CARWAY_EDIT_TYPE:CARWAY_EDIT_TYPE;
	private m_CARWAY_Model_Service:CARWAY_Model_Service;
	
	private m_nModelServiceIndex:number = 0;
	private m_nModelServiceItemIndex:number = 0;
	private m_bLocating:boolean = false;
	private m_nBindClickedPictureIndex:number = -1;
	private m_sBindPictureUrl:string = "";

	constructor(
		public navCtrl: NavController,
		 public navParams: NavParams,
		 private viewController:ViewController,
		 private geolocation:Geolocation,
		 private m_CARWAY_Picture_Provider:CARWAY_Picture_Provider,
		 private keyboard:Keyboard,
		 private m_CARWAY_LocationTracker_Provider:CarwayLocationTrackerProvider,
		 private zone: NgZone,
		 private m_CARWAY_Model_Settings_Provider:CARWAY_Model_Settings_Provider,
		 private m_AlertController:AlertController,
		 private m_Platform:Platform,
		 private m_CARWAY_DayTrack_Provider:CARWAY_DayTrack_Provider,
		 private m_CARWAY_Model_Car_Provider:CARWAY_Model_Car_Provider,
		 private m_ModalController:ModalController,
		 private m_CARWAY_Log_Provider:CARWAY_Log_Provider,
		 
		 )
		 {
			this.m_CARWAY_Model_Service = this.navParams.get('CARWAY_Model_Service'); 
			this.m_CARWAY_EDIT_TYPE = this.navParams.get('CARWAY_EDIT_TYPE'); 
			this.m_nModelServiceItemIndex = this.navParams.get('CARWAY_Model_Service_Index');

			this.initialize();

			this.m_bGPSInstalled = this.m_Platform.is("cordova") && !this.m_Platform.is("core"); 

			console.log("Placeholder_Costs:"+JSON.stringify(this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item));
		}
	
	private initialize()
	{
		console.log("initialize ");

		for(let i=0 ; i<this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.length ; i++)
		{
			switch(this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[i].m_Type)
			{
				case CARWAY_WIZARD_OBJECT.TEXT:
					console.log("initialize TEXT");
					break;
				
				case CARWAY_WIZARD_OBJECT.SELECT:
					console.log("initialize SELECT");
					break;
	
				case CARWAY_WIZARD_OBJECT.TIME:
					if(this.m_CARWAY_EDIT_TYPE == CARWAY_EDIT_TYPE.NEW)
					{
						this.setActTime(i);
					}
					break;
	
				case CARWAY_WIZARD_OBJECT.LOCATION:
					console.log("initialize LOCATION");
					this.initLocation(i);
				break;
				
				case CARWAY_WIZARD_OBJECT.COSTS:
				console.log("initialize COSTS");
				// this.initCosts(i);
				break;
			}
		}

		this.m_nModelServiceItemIndex = 0;
	}
	
	private setActTime(index:number) 
	{
    	let now = new Date();
		let nHour = now.getHours();
		let nMinute = now.getMinutes();

		(<CARWAY_Model_Service_Item_Time>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[index]).m_sTextHour = String(nHour);

		if(nMinute>=0 && nMinute<10)
			(<CARWAY_Model_Service_Item_Time>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[index]).m_sTextMinute = "0"+String(nMinute);
    	else
			(<CARWAY_Model_Service_Item_Time>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[index]).m_sTextMinute = String(nMinute);
	}
	 
	// START-HANDLER
	private onClickPrev()
	{
		if(this.m_CARWAY_EDIT_TYPE == CARWAY_EDIT_TYPE.SINGLE)
		{
			return;
		}

		this.m_sBindPictureUrl = "";

		this.m_nModelServiceItemIndex--;
	}

	private onClickNext()
	{
		if(this.m_CARWAY_EDIT_TYPE == CARWAY_EDIT_TYPE.SINGLE)
		{
			return;
		}

		this.m_sBindPictureUrl = "";

		this.m_nModelServiceItemIndex++;
	}

	private onClickSave()
	{
		this.viewController.dismiss(true);
	}

	private onKeyUpHour()
	{
		if(Number((<CARWAY_Model_Service_Item_Time>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex]).m_sTextHour)>2 && Number((<CARWAY_Model_Service_Item_Time>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex]).m_sTextHour)<23)
		{
			this.InputMinute.setFocus();
		}
	}
	  
	private onKeyUpMinute()
	{
		if(Number((<CARWAY_Model_Service_Item_Time>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex]).m_sTextMinute)<0 || Number((<CARWAY_Model_Service_Item_Time>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex]).m_sTextMinute)>=60)
		{
			this.InputMinute.value = "";
		}
	}
	
	private onClickAddCosts()
	{
		let a:string = (<CARWAY_Model_Service_Item_Array_Costs>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex]).m_Array_CARWAY_Model_Service_Item_Costs[0].m_sText;

		(<CARWAY_Model_Service_Item_Array_Costs>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex]).m_Array_CARWAY_Model_Service_Item_Costs.push(new CARWAY_Model_Service_Item_Costs(a));
	}

	private onClickCosts()
	{
		(<CARWAY_Model_Service_Item_Array_Costs>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex]).m_oTotal = CARWAY_Util_Currency.calculateTotal((<CARWAY_Model_Service_Item_Array_Costs>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex]));
	}

	private onClickDismiss()
	{
		this.viewController.dismiss();
	}
	private onClickCamera()
	{
		this.m_CARWAY_Picture_Provider.getImageFromCamera()
		.then
        (
            (resolve) =>
            {
				this.m_CARWAY_Log_Provider.add("CARWAY_Picture_Provider","saveImageToService!!!!!!");

				if(resolve)
				{
					this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex].m_ArrayPictures ? 1 : this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex].m_ArrayPictures = new Array<string>(); 
					
					this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex].m_ArrayPictures.push(resolve);
					this.m_CARWAY_DayTrack_Provider.saveService(this.m_CARWAY_Model_Service,this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,this.m_nModelServiceIndex);
			
					this.m_CARWAY_Picture_Provider.saveUserServicePictureCamera(resolve,this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID,this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,this.m_nModelServiceIndex,this.m_nModelServiceItemIndex,this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex].m_ArrayPictures.length-1);
				}
			},
			(reject) =>
			{

			}
		)
	}
	
	private onClickAttach()
	{
		this.m_CARWAY_Picture_Provider.getImageFromGallery()
		.then
        (
            (resolve) =>
            {
				this.m_CARWAY_Log_Provider.add("CARWAY_Picture_Provider","saveImageToService!!!!!!");

				if(resolve)
				{
					this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex].m_ArrayPictures ? 1 : this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex].m_ArrayPictures = new Array<string>(); 
					
					this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex].m_ArrayPictures.push(resolve);
					this.m_CARWAY_DayTrack_Provider.saveService(this.m_CARWAY_Model_Service,this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,this.m_nModelServiceIndex);
			
					this.m_CARWAY_Picture_Provider.saveUserServicePictureFile(resolve,this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID,this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,this.m_nModelServiceIndex,this.m_nModelServiceItemIndex,this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex].m_ArrayPictures.length-1);
				}
			},
            (reject) =>
            {

            }
		)
	}


	clickedHome()
	{
		if(!this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home)
		{
			let aCARWAY_Geoposition:CARWAY_Geoposition = (<CARWAY_Model_Service_Item_Location>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex]).m_CARWAY_Geoposition;

			let alert = this.m_AlertController.create({
				title: 'Homezone erstellen',
				message: "Sie haben ihre Homezone noch nicht erstellt. Ist das ihr Zuhause:<p>"+aCARWAY_Geoposition.m_sFormattedAddress+"?</p><p>Beim nächsten Klick auf das Home-Symbol wird Ihre Homezone automatisch gesetzt. Durch einen langen Klick können Sie Ihre Homezone erneut setzen.",
				buttons : [
					{
						text: "Ja, hier bin ich zu Hause",
						handler: data => 
						{
							this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home = new CARWAY_Geoposition();
							this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home.coords = {latitude:aCARWAY_Geoposition.coords.latitude,longitude:aCARWAY_Geoposition.coords.longitude,accuracy:aCARWAY_Geoposition.coords.accuracy,altitude:aCARWAY_Geoposition.coords.altitude,altitudeAccuracy:aCARWAY_Geoposition.coords.altitudeAccuracy,heading:aCARWAY_Geoposition.coords.heading,speed:aCARWAY_Geoposition.coords.speed};
							this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home.m_sFormattedAddress = JSON.parse(JSON.stringify(aCARWAY_Geoposition.m_sFormattedAddress)); 
							
							this.m_CARWAY_Model_Settings_Provider.saveLocationSettings();
							
							this.setNewPosition(this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home.coords,aCARWAY_Geoposition.m_sFormattedAddress);
							
							return;
						}
					}
					,
					{
						text: "Nein, Homezone später setzen",
						handler: data => 
						{
							return;
						}
					}
				]
			});
			alert.present();		
		}
		else
		{
			
			this.query = "";
							
			this.setNewPosition(
					CARWAY_Util_Clone.cloneCoordinates(this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home.coords),
					CARWAY_Util_Clone.cloneString(this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home.m_sFormattedAddress));
		}
	}
	// END-HANDLER

	public searchPlace()
    {
    	this.places = [];
      
     	if(!this.searchDisabled)
      	{
       		this.places = CARWAY_Util_Geolocation.searchPlace(this.query,'geocode');
      	}
	}

	ionViewDidLoad()
	{
	
	}

	private initLocation(nIndex:number)
	{
		let aCARWAY_Model_Service_Item_Location:CARWAY_Model_Service_Item_Location = (<CARWAY_Model_Service_Item_Location>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[nIndex]);
		
		if(!aCARWAY_Model_Service_Item_Location.m_CARWAY_Geoposition)
		{
			aCARWAY_Model_Service_Item_Location.m_CARWAY_Geoposition = new CARWAY_Geoposition(); 
			
			this.m_CARWAY_LocationTracker_Provider.getPosition(false)
			.then((resolvePosition:CARWAY_Geoposition)=>
			{
				if(resolvePosition)
				{
					aCARWAY_Model_Service_Item_Location.m_CARWAY_Geoposition.coords = CARWAY_Util_Clone.cloneCoordinates(resolvePosition.coords);
					aCARWAY_Model_Service_Item_Location.m_CARWAY_Geoposition.m_sFormattedAddress = resolvePosition.m_sFormattedAddress;
					this.m_bindFormattedAdress = resolvePosition.m_sFormattedAddress;
				}
				this.initMap(aCARWAY_Model_Service_Item_Location.m_sText,aCARWAY_Model_Service_Item_Location.m_CARWAY_Geoposition);
			});
		}
		else
		{
			this.initMap(aCARWAY_Model_Service_Item_Location.m_sText,aCARWAY_Model_Service_Item_Location.m_CARWAY_Geoposition);
			this.m_bindFormattedAdress = aCARWAY_Model_Service_Item_Location.m_CARWAY_Geoposition.m_sFormattedAddress;
		}
	}

	private initCosts(nIndex:number)
	{
		let sText:string = (<CARWAY_Model_Service_Item_Array_Costs>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[nIndex]).m_Array_CARWAY_Model_Service_Item_Costs[0].m_sText;

		(<CARWAY_Model_Service_Item_Array_Costs>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[nIndex]).m_Array_CARWAY_Model_Service_Item_Costs.push(new CARWAY_Model_Service_Item_Costs(sText));
	}

	private initMap(sTitle:string,aCARWAY_Geoposition:CARWAY_Geoposition)
	{
		let aDivElemetMap = document.getElementById("map2");

		if(!aDivElemetMap)
		{
			setTimeout(() => 
			{
				this.initMap(sTitle,aCARWAY_Geoposition);
			}, 
			100);
		}
		else
		{
			if(aCARWAY_Geoposition.coords.latitude != GlobalConstants.NOT_SET)
			{
				console.log("initMap:SET");
				this.m_Map = new google.maps.Map(aDivElemetMap, 
				{
					center: new google.maps.LatLng(aCARWAY_Geoposition.coords.latitude,aCARWAY_Geoposition.coords.longitude),
					zoom: 15
				});
			
				CARWAY_Util_Geolocation.addMarker(this.m_Map,"",aCARWAY_Geoposition.coords.latitude,aCARWAY_Geoposition.coords.longitude,"<h3>Standort</h3>",true);
			}
			else
			{
				console.log("initMap:NOT SET");
				this.m_Map = new google.maps.Map(aDivElemetMap, 
					{
						center: new google.maps.LatLng(aCARWAY_Geoposition.coords.latitude,aCARWAY_Geoposition.coords.longitude),
						zoom: 1
					});
			}
			this.placesService = new google.maps.places.PlacesService(this.m_Map);
		
			this.searchDisabled = false;
	}		
	}

	
	
	private selectPlace(place,event:Event)
	{
		this.m_bLocating = false;

		event.preventDefault();
		event.stopPropagation();

		this.keyboard.close();

		this.places = [];
		
		this.placesService.getDetails({placeId: place.place_id}, (details) => 
		{
			this.zone.run(() => 
			{
				this.setNewPosition({latitude:details.geometry.location.lat(),longitude:details.geometry.location.lng(),accuracy:-1,altitude:-1,altitudeAccuracy:-1,heading:-1,speed:-1},details.formatted_address);
			});
		});
	}

	clickedLoadCurrentLocation()
	{
		this.m_bLocating = true;

		this.m_CARWAY_LocationTracker_Provider.getPosition(true)
		.then((resolve:CARWAY_Geoposition) => 
		{
			this.query = "";

			if(resolve)
			{
				if(resolve.m_LOADING_POSITION_STATE != LOADING_POSITION_STATE.ERROR)
				{
					this.setNewPosition(
						CARWAY_Util_Clone.cloneCoordinates(resolve.coords),
						CARWAY_Util_Clone.cloneString(resolve.m_sFormattedAddress));
					
					this.m_bLocating = false;
				}
			}
		})
	}	

	private setNewPosition(aCoordinates:Coordinates,sFormattedAddress:string)
	{
		let aGeoposition:CARWAY_Geoposition = (<CARWAY_Model_Service_Item_Location>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex]).m_CARWAY_Geoposition;
		
		CARWAY_Util_Geolocation.addMarker(this.m_Map,"",aCoordinates.latitude,aCoordinates.longitude,"<h3>Aktueller Standort</h3>",true);

		aGeoposition.coords = CARWAY_Util_Clone.cloneCoordinates(aCoordinates);
		aGeoposition.m_sFormattedAddress = CARWAY_Util_Clone.cloneString(sFormattedAddress);
		
		this.m_bindFormattedAdress = aGeoposition.m_sFormattedAddress;
		console.log("aGeoposition.m_sFormattedAddress:"+aGeoposition.m_sFormattedAddress);
		(<CARWAY_Model_Service_Item_Location>this.m_CARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item[this.m_nModelServiceItemIndex]).m_sText = this.m_bindFormattedAdress;
		setTimeout(() => 
		{
			let mapOptions = {
				zoom: 18,
				center: {lat: aCoordinates.latitude, lng: aCoordinates.longitude},
				mapTypeId: google.maps.MapTypeId.SATELLITE
			};
			
			this.m_Map.setOptions(mapOptions);
		},
		600);
	}

	onClickOpenPicture(nIndexPicture:number)
	{
		console.log("nIndexPicture:"+nIndexPicture);
		/*
		this.m_CARWAY_Picture_Provider.getDownloadPictureUrl(this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID, this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,this.m_nModelServiceIndex,this.m_nModelServiceItemIndex,nIndexPicture)
		.then 
		(
			(sPictureUrl:string) =>
			{
				this.m_sBindPictureUrl = sPictureUrl; 
			}
		);
		this.m_nBindClickedPictureIndex = nIndexPicture; 
		*/
		var modalPage = this.m_ModalController.create('PictureViewerPage',
		{
			CARWAY_Model_Service:this.m_CARWAY_Model_Service,
			nIndexDay:this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,
			nIndexService:this.m_nModelServiceIndex,
			nIndexServiceItem:this.m_nModelServiceItemIndex,
			nIndexPicture:nIndexPicture
		}
		,
		{
			showBackdrop: true
		});

		modalPage.present();

	}
}