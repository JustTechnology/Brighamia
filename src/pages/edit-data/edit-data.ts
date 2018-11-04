
import { CARWAY_Log_Provider } from './../../providers/CARWAY-log-provider';
import { LongPressModule } from 'ionic-long-press';
import { CARWAY_Geoposition } from './../../models/CARWAY-model-geoposition';
import { GlobalConstants, LOADING_POSITION_STATE } from './../../providers/constants-provider';
import { CARWAY_Util_Date } from '../../util/CARWAY-util-date';
import { CARWAY_EDIT_TYPE, CARWAY_EDIT_STATE, CARWAY_KEY_TYPE } from '../../providers/constants-provider';
import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, Keyboard, TextInput, AlertController, Events, Platform } from 'ionic-angular';
import { CARWAY_DayTrack_Provider } from '../../providers/CARWAY-model-daytrack-provider';
import { Http } from '@angular/http';
import { CARWAY_Model_Settings_Provider } from '../../providers/CARWAY-model-settings-provider';
import { CarwayLocationTrackerProvider } from '../../providers/carway-location-tracker';
import { CARWAY_Util_Clone } from '../../util/CARWAY-util-clone';
import { CARWAY_Util_Route } from '../../util/CARWAY-util-route';
import { CARWAY_Util_Geolocation } from '../../util/CARWAY-util-geolocation';
import { CARWAY_Util_Text } from '../../util/CARWAY-util-text';
import { google } from 'google-maps';
import { initializeApp } from 'firebase/app';

declare var google: any;

@IonicPage()
@Component({
	selector: 'page-edit-data',
	templateUrl: 'edit-data.html',
})
	
export class EditDataPage 
{ 
	@ViewChild('InputOrt') InputOrt;
	@ViewChild('InputKommentar') InputKommentar;
		
	@ViewChild('InputMinuteStart') InputMinuteStart: TextInput;
	@ViewChild('InputHourStart') InputHourStart: TextInput;
	
	@ViewChild('InputMinuteZiel') InputMinuteZiel: TextInput;
	@ViewChild('InputHourZiel') InputHourZiel: TextInput;

	private m_bEventFromFullSize:boolean = false;
	public  m_saBindOrderStati:string[] = ["Alles OK","Nachfassen","Auftrag schließen"];
private m_bGPSInstalled:boolean = false;
	latitude: number;
	longitude: number;
	placesServiceStart: any;
	placesServiceZiel: any;
	query: string = '';
	placesStart: any = [];
	placesZiel: any = [];
	searchDisabled: boolean = true;
	location: any; 
	private m_bLocating:boolean = false;
	MyCARWAY_EDIT_STATE = CARWAY_EDIT_STATE;
	MyCARWAY_EDIT_TYPE = CARWAY_EDIT_TYPE;
	private m_bNextDay:boolean = false;
	private m_bLocationChanged = false;

	private m_Type = CARWAY_EDIT_TYPE.WIZARD;
	private m_State = CARWAY_EDIT_STATE.NOT_SET;

	private m_sTitleHeader:string = "";
	private m_sTitleItem:string = "";
	
	private m_MapStart :google.maps.Map;
	private m_MapZiel :google.maps.Map;

	m_nDayIndex:number = -1;
	m_nTrackIndex:number = -1;

	private m_sTitle:string = "";
	
	private m_sTimeHourZiel:string = "";
	private m_sTimeMinuteZiel:string = "";
	
	private m_nLat:number = 0;
	private m_nLng:number = 0;
	
	private m_sKommentar = "";
	private m_sAktionen = "";
	private m_CountPos:number = 0;

	constructor(  public zone: NgZone, public navCtrl: NavController, public navParams: NavParams,private toastController:ToastController,
		private viewController:ViewController,
		private m_CARWAY_DayTrack_Provider:CARWAY_DayTrack_Provider,
		private keyboard:Keyboard,
		private http:Http,
		private m_CARWAY_LocationTracker_Provider:CarwayLocationTrackerProvider,
		private m_CARWAY_Model_Settings_Provider:CARWAY_Model_Settings_Provider,private m_AlertController:AlertController,
		private m_Events:Events,
		private m_CARWAY_Log_Provider:CARWAY_Log_Provider,
		private m_Platform:Platform) 
	{	
		this.m_Type = this.navParams.get('type'); 
		this.m_State = this.navParams.get('state');

		this.m_nDayIndex = this.navParams.get('dayIndex');
		this.m_nTrackIndex = this.navParams.get('trackIndex');
		this.initState();
		if(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionStart && this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel)
		{
			let nKeyTimeStart:number = Number(String(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionStart.m_nDateTimeKey).substr(8,6));
			let nKeyTimeZiel:number =  Number(String(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey).substr(8,6));
			
			if(nKeyTimeStart > nKeyTimeZiel)
			{
				this.m_bNextDay = true;
			}
			else
			{
				this.m_bNextDay = false;
			}
		}

		this.m_bGPSInstalled = this.m_Platform.is("cordova") && !this.m_Platform.is("core"); 
	}

	public onKeyUpMinuteStart()
	{
		this.onKeyUpMinute(this.InputMinuteStart);
	}

	public onKeyUpMinuteZiel()
	{
		this.onKeyUpMinute(this.InputMinuteZiel);
	}	

	private onKeyUpMinute(aTextInputMinute:TextInput)
	{
		let nMinute = Number(aTextInputMinute.value);

		if(nMinute<0)
		{
			aTextInputMinute.setValue("00");
		}
		else if(nMinute>59)
		{
			aTextInputMinute.setValue("59");
		}
		else
		{
			while(aTextInputMinute.value.length>2)
			{
				aTextInputMinute.value = aTextInputMinute.value.substr(aTextInputMinute.value.length-2,aTextInputMinute.value.length);
			}
			
		/*	while(aTextInputMinute.value.length<2)
			{
				aTextInputMinute.value = "0"+aTextInputMinute.value;
			}
		*/}
	}	
	
	public onKeyUpHourStart()
	{
		this.onKeyUpHour(this.InputHourStart,this.InputMinuteStart);
	}

	public onKeyUpHourZiel()
	{
		this.onKeyUpHour(this.InputHourZiel,this.InputMinuteZiel);
	}

	private onKeyUpHour(aTextInputHour:TextInput,aTextInputMinute:TextInput)
	{
		let nHour = Number(aTextInputHour.value);

		if(nHour>23)
		{
			aTextInputHour.value = "23";
			aTextInputMinute.setFocus();
		}
		else if(nHour<0)
		{
			aTextInputHour.setValue("0");
		}
		else if(nHour>2 && nHour<=23)
		{
			while(aTextInputHour.value.length<2)
			{
				aTextInputHour.value = "0"+aTextInputHour.value;
			}
			
			aTextInputMinute.setFocus();
		}
	}


	focusoutStartHour(nStartHour:number)
	{
		this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionStart.m_nDateTimeKey = CARWAY_Util_Date.replaceHourInKey(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionStart.m_nDateTimeKey,nStartHour);
		
		this.checkNextDay();
	}
	focusoutStartMinute(nStartMinute:number)
	{
		this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionStart.m_nDateTimeKey = CARWAY_Util_Date.replaceMinuteInKey(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionStart.m_nDateTimeKey,nStartMinute);
		
		this.checkNextDay();
	}
	focusoutZielHour(nZielHour:number)
	{
		this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey = CARWAY_Util_Date.replaceHourInKey(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey,nZielHour);

		this.checkNextDay();
	}
	focusoutZielMinute(nZielMinute:number)
	{ 
		this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey = CARWAY_Util_Date.replaceMinuteInKey(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey,nZielMinute);
		
		this.checkNextDay();
	}

	private getMapPosition(aCARWAY_Geoposition:CARWAY_Geoposition) : Promise<any>
	{
		let aPromiseGetPosition:Promise<any> = new Promise(ready  =>
		{
			if(aCARWAY_Geoposition.coords.latitude != GlobalConstants.NOT_SET)
			{
				ready({IcoURL:"",LatLng:new google.maps.LatLng(aCARWAY_Geoposition.coords.latitude,aCARWAY_Geoposition.coords.longitude)})
			}
			else
			{
				this.m_CARWAY_LocationTracker_Provider.getPosition(false)
				.then((resolvePosition)=>
				{
					if(resolvePosition)
					{
						ready({IcoURL:GlobalConstants.CARWAY_MARKER_66,LatLng:new google.maps.LatLng(resolvePosition.coords.latitude,resolvePosition.coords.longitude)});
					}
					else
					{
						ready({IcoURL:"",LatLng:new google.maps.LatLng(aCARWAY_Geoposition.coords.latitude,aCARWAY_Geoposition.coords.longitude)})
					}
				});
			}
		});

		return aPromiseGetPosition;
	}
	
	private initMap(sMap:string,aCARWAY_Geoposition:CARWAY_Geoposition) : Promise<google.maps.Map>
	{
		let aPromiseInitMap:Promise<google.maps.Map> = new Promise(resolve  =>
		{
			let aMap:google.maps.Map = null;
	
			this.getMapPosition(aCARWAY_Geoposition)
			.then(ready =>
			{
				if(ready)
				{
					if(ready.LatLng.lat() != GlobalConstants.NOT_SET)
					{
						aMap = new google.maps.Map(document.getElementById(sMap), 
						{
							center: ready.LatLng,
							zoom: 15
						});
						
						CARWAY_Util_Geolocation.addMarker(
							aMap,
							ready.IcoURL,
							ready.LatLng.lat(),
							ready.LatLng.lng(),
							"<h3>"+sMap.substring(3)+"</h3>",
							true);
							
						resolve(aMap);
					}
					else
					{
						aMap = new google.maps.Map(document.getElementById(sMap), 
						{
							center: ready.LatLng,
							zoom: 1
						});

						resolve(aMap);
					}
				}
			});
		});

		return aPromiseInitMap;
	}

	ionViewDidLoad()
	{ 
		this.initialize();
	}

	private initialize()
	{
		this.m_Events.subscribe("newPosition_EditorOnly",data =>
		{
			// Falls GPS noch nicht die Positon bestimmt hat.
			this.initialize();
			this.m_Events.unsubscribe("newPosition_EditorOnly");
		});
	
		let aPromiseStart = this.initMap("mapStart",this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionStart);
		let aPromiseZiel = this.initMap("mapZiel",this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel);
		
		Promise.all([aPromiseStart, aPromiseZiel])
		.then(values => 
		{
			this.m_MapStart = values[0];
			this.m_MapZiel = values[1];

			this.placesServiceStart = new google.maps.places.PlacesService(this.m_MapStart);
			this.placesServiceZiel = new google.maps.places.PlacesService(this.m_MapZiel);
			
			this.searchDisabled = false;
	
			this.m_MapStart.addListener('click',fkt=>
			{	
				this.m_bEventFromFullSize = true;
				this.setPlaceFromMap(this.m_MapStart,fkt.latLng.lat(),fkt.latLng.lng(),CARWAY_EDIT_STATE.START);
			});
	
			this.m_MapZiel.addListener('click',fkt=>
			{
				this.m_bEventFromFullSize = true;
				this.setPlaceFromMap(this.m_MapZiel,fkt.latLng.lat(),fkt.latLng.lng(),CARWAY_EDIT_STATE.ZIEL);
			});
		});
	}

	private setPlaceFromMap(aMap:any,lat:number,lng:number,aCARWAY_EDIT_STATE:CARWAY_EDIT_STATE)
	{
		CARWAY_Util_Geolocation.getLatLngDetails(this.http,lat,lng)
		.subscribe(data => 
		  {
			var myObj = data.json();
			console.log("data.json()",JSON.stringify(myObj));
			
			let formatted_address:string = myObj.results[0].formatted_address;
			console.log("formatted_address:",formatted_address);
			
			if(formatted_address)
			{
				formatted_address = CARWAY_Util_Text.addLineBreak(formatted_address);
			}
			else
			{
				formatted_address = "-";
			}
		
			this.setNewPosition
			(
				this.m_nDayIndex,
				this.m_nTrackIndex,
				aCARWAY_EDIT_STATE,
				{latitude:lat,longitude:lng,accuracy:-1,altitude:-1,altitudeAccuracy:-1,heading:-1,speed:-1},
				formatted_address
			)
		});
	}
	
	public clickedCancel()
	{
		this.viewController.dismiss(
		{
			"Save" : false,
			"LocationChanged" : this.m_bLocationChanged
		});
	}
	public clickedSave()
	{
		this.viewController.dismiss(
		{
			"Save" : true,
			"LocationChanged" : this.m_bLocationChanged
		});
	}
	
	public clickedOverlay()
	{
		this.clickedSave();
	}
	
  	public getActTimeStart()
	{
		let now = new Date();

		this.focusoutStartHour(now.getHours());
		this.focusoutStartMinute(now.getMinutes());
	}
	
	public getActTimeZiel()
	{
		let now = new Date();

		this.focusoutZielHour(now.getHours());
		this.focusoutZielMinute(now.getMinutes());
    }


  	private checkNextDay()
	{
		let nKeyTimeStart:number = Number(String(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionStart.m_nDateTimeKey).substr(8,6));
		let nKeyTimeZiel:number =  Number(String(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey).substr(8,6));
		console.log("checkNextDay - nKeyStart"+nKeyTimeStart+" > nKeyZiel"+nKeyTimeZiel);
		
		if(nKeyTimeStart > nKeyTimeZiel)
		{
			if(!this.m_bNextDay)
			{
				this.m_bNextDay = true;
				console.log("checkNextDay NEXT DAY");
				console.log("checkNextDay -this.m_bNextDay ALT"+this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey);
				this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey = CARWAY_Util_Date.getDayKeyAddDay(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey,CARWAY_KEY_TYPE.TIME,1);
				console.log("checkNextDay -this.m_bNextDay NEU"+this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey);
			}
		}
		else
		{
			if(this.m_bNextDay)
			{
				this.m_bNextDay = false;
				console.log("checkNextDay PREV DAY");
				console.log("checkNextDay -this.m_bNextDay ALT"+this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey);
				this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey = CARWAY_Util_Date.getDayKeyAddDay(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey,CARWAY_KEY_TYPE.TIME,-1);
				console.log("checkNextDay -this.m_bNextDay NEU"+this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey);
			}
		}
	}



  	public onNextClick()
	{
		if(this.m_Type == CARWAY_EDIT_TYPE.SINGLE)
		{
			return;
		}

		switch(this.m_State)
		{
			case CARWAY_EDIT_STATE.TITLE:
				this.m_State = CARWAY_EDIT_STATE.START;
				break; 
			
				case CARWAY_EDIT_STATE.START:
				this.m_State = CARWAY_EDIT_STATE.ZIEL;
				break; 
			
			case CARWAY_EDIT_STATE.ZIEL:
				this.m_State = CARWAY_EDIT_STATE.KOMMENTAR;
				break; 

			case CARWAY_EDIT_STATE.KOMMENTAR:
				this.m_State = CARWAY_EDIT_STATE.AKTION;
				break; 

			case CARWAY_EDIT_STATE.AKTION:
				this.m_State = CARWAY_EDIT_STATE.START;
				break; 
		}
		
		this.initState();	}


	public onPrevClick()
	{
		if(this.m_Type == CARWAY_EDIT_TYPE.SINGLE)
		{
			return;
		}

		switch(this.m_State)
		{
			case CARWAY_EDIT_STATE.AKTION:
				this.m_State = CARWAY_EDIT_STATE.KOMMENTAR;
				break; 
			
			case CARWAY_EDIT_STATE.KOMMENTAR:
				this.m_State = CARWAY_EDIT_STATE.ZIEL;
				break; 

			case CARWAY_EDIT_STATE.ZIEL:
				this.m_State = CARWAY_EDIT_STATE.START;
				break; 

			case CARWAY_EDIT_STATE.START:
				this.m_State = CARWAY_EDIT_STATE.TITLE;
				break; 
		}

		this.initState();
	}


	private initState()
	{
		// Standardtext ist für Reiter "Fahrten" notwendig, hier löschen, ansonsten muüsste der Anwender den Text löschen!  
		switch(this.m_State)
		{
			case CARWAY_EDIT_STATE.TITLE:
				this.m_sTitleItem = "Titel";
				break;
			
			case CARWAY_EDIT_STATE.START:
				this.m_sTitleItem = "Start";
				this.query = "";
				this.m_bLocationChanged = true;
				break;

			case CARWAY_EDIT_STATE.ZIEL:
				this.m_sTitleItem = "Ziel";
				this.query = "";
				this.m_bLocationChanged = true;
				break;

			case CARWAY_EDIT_STATE.KOMMENTAR:
				this.m_sTitleItem = "Kommentar";
				break;
			
			case CARWAY_EDIT_STATE.AKTION:
				this.m_sTitleItem = "Aktion";
				break;
		}
	}

	private setNewPosition(nDayIndex:number,nTrackIndex:number,aCARWAY_EDIT_STATE:CARWAY_EDIT_STATE,aCoordinates:Coordinates,sFormattedAddress:string)
	{
		let aGeoposition:CARWAY_Geoposition = null;
		let sTitle:string = "";
		let aMap:google.maps.Map = null;

		switch(aCARWAY_EDIT_STATE)
		{
			case CARWAY_EDIT_STATE.START:
				aGeoposition = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex].m_GeopositionStart;
				sTitle = "Ihr Start";
				aMap = this.m_MapStart;
				break; 
		
			case CARWAY_EDIT_STATE.ZIEL:
				aGeoposition = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex].m_GeopositionZiel;
				sTitle = "Ihr Ziel";
				aMap = this.m_MapZiel;
				break; 
		}
		
		CARWAY_Util_Geolocation.addMarker(aMap,"",aCoordinates.latitude,aCoordinates.longitude,"<h3>"+sTitle+"</h3>",true);
		
		aGeoposition.coords = CARWAY_Util_Clone.cloneCoordinates(aCoordinates);
		aGeoposition.m_sFormattedAddress = CARWAY_Util_Clone.cloneString(sFormattedAddress);
			
		setTimeout(() => 
		{
			aMap.setCenter({lat: aCoordinates.latitude, lng: aCoordinates.longitude});
			aMap.setZoom(15)
		},
		600);

		this.calculateTime();
	}

	private calculateTime()
	{
		let aTrack = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex];
		
		if(aTrack.m_GeopositionStart.coords.latitude != GlobalConstants.NOT_SET && aTrack.m_GeopositionZiel.coords.latitude != GlobalConstants.NOT_SET)
		{
			CARWAY_Util_Route.calculateDistanceAndDurationRoute(aTrack.m_GeopositionStart.coords,aTrack.m_GeopositionZiel.coords)
			.then(result => 
			{
				this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_nDurationMapSeconds = result.result.duration.value;

				if(this.m_bEventFromFullSize)
				{
					this.m_bEventFromFullSize = false;
					
					let nDateTimeKey:number = CARWAY_Util_Date.getTimeKeyAddTime(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionStart.m_nDateTimeKey,result.result.duration.value);
					this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey = nDateTimeKey;
				}
				else
				{
					let nDateTimeKey:number = CARWAY_Util_Date.getTimeKeyAddTime(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionStart.m_nDateTimeKey,result.result.duration.value);
					
					if( !(this.m_Type == CARWAY_EDIT_TYPE.WIZARD && this.m_State == CARWAY_EDIT_STATE.START))
					{
						if(result && result.result.duration)
						{
							let alert = this.m_AlertController.create({
								title: 'Dauer der Route',
								message: "Sie benötigen etwa "+result.result.duration.test+" für die Route von "
								+"<p>"+this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionStart.m_sFormattedAddress+"</p>"
								+"nach"
								+"<p>"+this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_sFormattedAddress+"</p>"
								+"Soll die Uhrzeit (Zielzeitpunkt: "+CARWAY_Util_Date.getDateTextFromDateKey(nDateTimeKey)+" - "+CARWAY_Util_Date.getTimeTextFromTimeKey(nDateTimeKey)+") automatisch angepasst werden?",
								buttons : [
									{
										text: "Ja",
										handler: data => 
										{
											this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel.m_nDateTimeKey = nDateTimeKey;
											return;
										}
									}
									,
									{
										text: "Nein",
										handler: data => 
										{
											return;
										}
									}
								]
							});
							alert.present();
						}
	
					}
				}
			});
		}
	}
	public itemclicked(event: Event) :boolean
	{
		event.preventDefault();
		event.stopPropagation();
		return false;
	}


	public clickedLoadCurrentLocation(aCARWAY_EDIT_STATE:CARWAY_EDIT_STATE)
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
							this.m_nDayIndex,
							this.m_nTrackIndex,
							aCARWAY_EDIT_STATE,
							CARWAY_Util_Clone.cloneCoordinates(resolve.coords),
							CARWAY_Util_Clone.cloneString(resolve.m_sFormattedAddress));
					}
					this.m_bLocating = false;
				}
				else
				{
					this.m_bLocating = false;
				}
			})
	}

	private clickedHome(aCARWAY_EDIT_STATE:CARWAY_EDIT_STATE)
	{
		if(!this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home)
		{
			let aCARWAY_Geoposition:CARWAY_Geoposition = null;
			
			if(aCARWAY_EDIT_STATE == CARWAY_EDIT_STATE.START)
			{
				aCARWAY_Geoposition = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionStart;
			}
			else if(aCARWAY_EDIT_STATE == CARWAY_EDIT_STATE.ZIEL)
			{
				aCARWAY_Geoposition =  this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel;
			}

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
							
							this.setNewPosition(this.m_nDayIndex,this.m_nTrackIndex,aCARWAY_EDIT_STATE,this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home.coords,aCARWAY_Geoposition.m_sFormattedAddress);
							
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
				this.m_nDayIndex,
				this.m_nTrackIndex,
					aCARWAY_EDIT_STATE,
					CARWAY_Util_Clone.cloneCoordinates(this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home.coords),
					CARWAY_Util_Clone.cloneString(this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home.m_sFormattedAddress));
		}
	}

	onLongPress(aCARWAY_EDIT_STATE:CARWAY_EDIT_STATE)
	{	
		let aCARWAY_Geoposition:CARWAY_Geoposition = null;
			
		if(aCARWAY_EDIT_STATE == CARWAY_EDIT_STATE.START)
		{
			aCARWAY_Geoposition = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionStart;
		}
		else if(aCARWAY_EDIT_STATE == CARWAY_EDIT_STATE.ZIEL)
		{
			aCARWAY_Geoposition =  this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_nDayIndex].m_arrayCARWAY_Model_Track_Single[this.m_nTrackIndex].m_GeopositionZiel;
		}
		
		let alert = this.m_AlertController.create({
			title: 'Homezone erstellen',
			message: "Möchten Sie folgende Adresse als Homezone setzen?<p>"+aCARWAY_Geoposition.m_sFormattedAddress+"?</p><p>Beim nächsten Klick auf das Home-Symbol wird Ihre Homezone automatisch gesetzt.</p>",
			buttons : [
				{
					text: "Ja, hier bin ich zu Hause",
					handler: data => 
					{
						this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home = new CARWAY_Geoposition();
						this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home.coords = {latitude:aCARWAY_Geoposition.coords.latitude,longitude:aCARWAY_Geoposition.coords.longitude,accuracy:aCARWAY_Geoposition.coords.accuracy,altitude:aCARWAY_Geoposition.coords.altitude,altitudeAccuracy:aCARWAY_Geoposition.coords.altitudeAccuracy,heading:aCARWAY_Geoposition.coords.heading,speed:aCARWAY_Geoposition.coords.speed};
						this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home.m_sFormattedAddress = JSON.parse(JSON.stringify(aCARWAY_Geoposition.m_sFormattedAddress)); 
						console.log("onLongPress"+this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_Home.m_sFormattedAddress);
						this.m_CARWAY_Model_Settings_Provider.saveLocationSettings();
					
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

	private searchPlace()
	{
		this.placesStart = [];
		this.placesZiel = [];
		
		if(!this.searchDisabled)
		{
			switch(this.m_State)
			{
				case CARWAY_EDIT_STATE.START:
					this.placesStart = CARWAY_Util_Geolocation.searchPlace(this.query,'geocode');
					break; 

				case CARWAY_EDIT_STATE.ZIEL:
					this.placesZiel = CARWAY_Util_Geolocation.searchPlace(this.query,'geocode');
					break; 
			}
		}
	}

	private selectPlace(aCARWAY_EDIT_STATE:CARWAY_EDIT_STATE,place,event:Event)
	{
		this.m_bLocating = false;

		event.preventDefault();
		event.stopPropagation();

		this.keyboard.close();

		if(aCARWAY_EDIT_STATE == CARWAY_EDIT_STATE.START)
		{
			this.placesStart = [];
			
			this.placesServiceStart.getDetails({placeId: place.place_id}, (details) => 
			{
				 this.zone.run(() => 
				 {
					this.setNewPosition(this.m_nDayIndex,this.m_nTrackIndex,aCARWAY_EDIT_STATE,{latitude:details.geometry.location.lat(),longitude:details.geometry.location.lng(),accuracy:-1,altitude:-1,altitudeAccuracy:-1,heading:-1,speed:-1},details.formatted_address);
				});
			});
		}
		else if(aCARWAY_EDIT_STATE == CARWAY_EDIT_STATE.ZIEL)
		{
			this.placesZiel = [];

			this.placesServiceZiel.getDetails({placeId: place.place_id}, (details) => 
			{
				 this.zone.run(() => 
				 {
					this.setNewPosition(this.m_nDayIndex,this.m_nTrackIndex,aCARWAY_EDIT_STATE,{latitude:details.geometry.location.lat(),longitude:details.geometry.location.lng(),accuracy:-1,altitude:-1,altitudeAccuracy:-1,heading:-1,speed:-1},details.formatted_address);
				});
			});
		}
	}

}