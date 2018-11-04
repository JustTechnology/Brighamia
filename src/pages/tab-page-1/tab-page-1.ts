import { ListViewExpandableService } from './../../services/list-view-expandable-service';
import { CARWAY_Model_Track_Single, routeSnappedToRoadLatLngPlace } from './../../models/CARWAY-model-track-single';
import { google } from 'google-maps';
import { CARWAY_Log_Provider } from './../../providers/CARWAY-log-provider';
import { CARWAY_Model_Settings_Provider } from './../../providers/CARWAY-model-settings-provider';
import { GlobalConstants, CARWAY_DISTANCES, CARWAY_EDIT_TYPE, CARWAY_EDIT_STATE } from './../../providers/constants-provider';
import { CARWAY_Util_Geolocation } from './../../util/CARWAY-util-geolocation';
import { Http } from '@angular/http';
import { Component, ViewChild } from '@angular/core';
import { TabsService } from '../../services/tabs-service';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Events, Slides, ModalController } from 'ionic-angular';
import { CARWAY_DayTrack_Provider } from '../../providers/CARWAY-model-daytrack-provider';
import { CARWAY_Util_Date } from '../../util/CARWAY-util-date';
import { CARWAY_KEY_TYPE } from '../../providers/constants-provider';
import { CarwayLocationTrackerProvider } from '../../providers/carway-location-tracker';
import { CARWAY_Track_Service } from '../../services/CARWAY-track-service';
import { CARWAY_Util_Text } from '../../util/CARWAY-util-text';
import { BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { CARWAY_Util_Route } from '../../util/CARWAY-util-route';

declare var google: any;

@IonicPage()
@Component
({
  templateUrl: 'tab-page-1.html',
  providers: [TabsService]
})

export class TabPage1 
{
	@ViewChild('slidesMap') slidesMap: Slides;

	private m_Map:google.maps.Map = null;
	private m_bLoadingMap:boolean = true;
	private aCARWAY_Model_Track_Single:CARWAY_Model_Track_Single;
	
	private m_oTotalKmToday:any;
	private m_oTotalKmWeek:any;
	private m_oTotalKmAll:any;
	
	private m_bLoadedPosition:boolean = false;
	private m_bLoadedModel:boolean = false;

	private m_LngLatStart:google.maps.LatLng = null;
	private m_LngLatZiel:google.maps.LatLng = null;
	private m_sAdressStart:string = "";
	private m_sAdressZiel:string = "";

	constructor
		(
			private m_ModalController:ModalController,
			private m_CARWAY_DayTrack_Provider:CARWAY_DayTrack_Provider,
			public m_CARWAY_LocationTracker_Provider:CarwayLocationTrackerProvider,
			public navCtrl:NavController,
			public navParams:NavParams,
			public loadingController:LoadingController,
			private toastController:ToastController,
			public http:Http,
			private m_Events:Events,
			private m_CARWAY_Model_Settings_Provider:CARWAY_Model_Settings_Provider,
			private m_LogProvider:CARWAY_Log_Provider,
			private m_CARWAY_Track_Service:CARWAY_Track_Service,
			private m_CARWAY_Log_Provider:CARWAY_Log_Provider
		) 
  	{
		this.subscribeEvents()
	}

	private subscribeEvents()
	{
		this.m_Events.subscribe('search:new', (data) =>
		{
			this.m_Events.publish('search:delete', true);
			console.log("Angekommen:"+this.m_CARWAY_DayTrack_Provider.m_nActDayIndex);
			this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks = this.m_CARWAY_DayTrack_Provider.getCARWAYModelDayArray(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_nTrackDayKey,1);
			
			this.slidesMap.slideTo(1, 0, false);

			this.showMap();
		});

		this.m_Events.subscribe('newPosition', (data) =>
		{
			this.m_bLoadedPosition = true;
			if(this.m_bLoadedModel)
			{
				this.showMap();
			}
		});

		this.m_Events.subscribe('loading_Tracks', (data) => 
		{ 
			this.m_bLoadedModel = true;
			if(this.m_bLoadedPosition)
			{
				this.showMap();
			}
			this.calculateDistancesTimeIntervall(CARWAY_DISTANCES.ALL);
		});

		this.m_Events.subscribe('callbackGeolocationResponse', (nLatPrev,nLngPrev,nLatAct,nLngAct,nDistance) => 
		{ 
				// user and time are the same arguments passed in `events.publish(user, time)`
			this.callbackDrawPositionOnMap(nLatPrev,nLngPrev,nLatAct,nLngAct);
		});
	}
	
	ionViewDidEnter()
	{      
		if(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model)
		{
			// Routen sind geladen, Karte anzeigen
			this.showMap();
		}
		else
		{
			// Routen sind nicht geladen -> warten auf Nachricht!
			this.m_Events.subscribe('loading_Tracks', (data) => 
			{ 
				this.showMap();
			});
		}

		this.slideToFirst();
	}

 	ionViewDidLoad()
  	{
		if(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model)
		{
			this.calculateDistancesTimeIntervall(CARWAY_DISTANCES.ALL);
		}
	}
  
	private slideToFirst()
	{
		// Sobald Slides aufgebaut sind, sofort und unsichtbar zum Slide 1 wechseln.
		setTimeout(() => 
		{
			if(this.slidesMap && this.slidesMap.realIndex == 1)
			{ 
				return;
			}  

			if(this.slidesMap)
			{
				this.slidesMap.slideTo(1, 0, false);
			}
			
			this.slideToFirst();
		}
		,100);
	}

	private showMap()
	{
		// Da DIV Element dynamisch generiert wird -> Warten bis es bereitsteht! 
		let aDivElemetMap = document.getElementById("map_"+this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_nTrackDayKey);

		if(!aDivElemetMap)
		{
			setTimeout(() => 
			{
				this.showMap();
			}, 
			100);
		}
		else
		{
			this.initMap(aDivElemetMap);
			this.fillMap();
		}
	}
	
	private initMap(aDivElemetMap:any)
	{
		let arrayTrack = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single;
		// Karte mit 0 initialisieren und Weltkarte zeigen, da evt. kein GPS verfügbar
		let mapOptions = 
		{
			center: new google.maps.LatLng(0,0),
			zoom: 1,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}

		this.m_Map = new google.maps.Map(aDivElemetMap, mapOptions);
	
		let a = this.http;
		let b = this.m_CARWAY_DayTrack_Provider;

		this.m_Map.addListener('dblclick', function( event )
		{
			if(!this.m_LngLatStart || this.m_LngLatZiel)
			{
				this.m_LngLatZiel = null; 
				this.m_LngLatStart = event.latLng;
	
				CARWAY_Util_Geolocation.getLatLngDetails(a,this.m_LngLatStart.lat(),this.m_LngLatStart.lng())
				.subscribe
				(
					aLatLngDetail => 
					{
						this.m_sAdressStart = aLatLngDetail.json().results[0].formatted_address 
						alert("Startposition gesetzt:"+this.m_sAdressStart);
					}
					,
					error => 
					{

					}
				)
			}
			else
			{
				this.m_LngLatZiel = event.latLng;
				
				CARWAY_Util_Geolocation.getLatLngDetails(a,this.m_LngLatZiel.lat(),this.m_LngLatZiel.lng())
				.subscribe
				(
					aLatLngDetail => 
					{
						this.sAdressZiel = aLatLngDetail.json().results[0].formatted_address;
						alert("Zielposition gesetzt"+this.m_sAdressZiel); 
						
						b.getNewTrack(b.m_nActDayIndex,-1);
		
						let aCARWAY_Track =b.m_CARWAY_Model.m_arrayCARWAY_Model_Day[b.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single[0]; 	
						
						aCARWAY_Track.m_GeopositionStart.coords = {latitude:this.m_LngLatStart.lat(),longitude:this.m_LngLatStart.lng(),accuracy:-1,altitude:-1,altitudeAccuracy:-1,heading:-1,speed:-1}
						aCARWAY_Track.m_GeopositionZiel.coords = {latitude:this.m_LngLatZiel.lat(),longitude:this.m_LngLatZiel.lng(),accuracy:-1,altitude:-1,altitudeAccuracy:-1,heading:-1,speed:-1}
				
						aCARWAY_Track.m_GeopositionStart.m_sFormattedAddress = this.m_sAdressStart;
						aCARWAY_Track.m_GeopositionZiel.m_sFormattedAddress = this.m_sAdressZiel;
						
						// Start und Ziel Timekeys setzen
						aCARWAY_Track.m_GeopositionStart.m_nDateTimeKey = Number(String(b.m_CARWAY_Model.m_arrayCARWAY_Model_Day[b.m_nActDayIndex].m_nTrackDayKey)+CARWAY_Util_Date.getActTimeKey());
						aCARWAY_Track.m_GeopositionZiel.m_nDateTimeKey = Number(String(b.m_CARWAY_Model.m_arrayCARWAY_Model_Day[b.m_nActDayIndex].m_nTrackDayKey)+CARWAY_Util_Date.getActTimeKey());
						
						var modalPage = this.m_ModalController.create('EditDataPage',
						{ 
							type:CARWAY_EDIT_TYPE.WIZARD,
							state: CARWAY_EDIT_STATE.TITLE,
							dayIndex:b.m_nActDayIndex,
							trackIndex:0
						}
						,
						{
							showBackdrop: true
						});
				
						modalPage.present();
				
						modalPage.onDidDismiss(resolveSaveInfoData =>
						{
							if(resolveSaveInfoData.Save)
							{
								// Speichern
								b.saveTrack
								(
									b.m_CARWAY_Model.m_arrayCARWAY_Model_Day[b.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single[0],this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,
									0
								)
							}
							else
							{
								// Track löschen
								b.deleteTrack(b.m_nActDayIndex,0);
							}		
						});
				
									}
					,
					error => 
					{

					}
				)
			}
		});
			
		this.m_bLoadingMap = false;
	}

	private fillMap()
	{
		this.drawHereMarker();
		
		this.drawTrackMarkersAndStraightConnections();
		
		this.drawRoute();
		
		this.setBoundsAndCenterMap();
	}

	private isGeopositionAvailable(arrayTrack:Array<CARWAY_Model_Track_Single>) : boolean
	{
		if(!arrayTrack)
		{
			return false;
		}

		if(arrayTrack.length==0)
		{
			return false;
		}

		for(let i=0 ; i<arrayTrack.length ; i++) 
		{
			if(arrayTrack[i].m_GeopositionStart.coords.latitude != GlobalConstants.NOT_SET || arrayTrack[i].m_GeopositionZiel.coords.latitude != GlobalConstants.NOT_SET)
			{
				return true;
			}
		}

		return false;
	}

	private drawHereMarker()
	{
		let arrayTrack = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single;
	
		if(this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_bShowAlwaysAktPosition || !this.isGeopositionAvailable(arrayTrack))
		{
			CARWAY_Util_Geolocation.setHereMarker(this.toastController,this.m_CARWAY_LocationTracker_Provider,this.m_Map,true)
			.then
			(
				resolveMarker =>
				{
					// Alles prima
				}
				,
				rejectMarker =>
				{
					// Position konnte nicht bestimmt werden, vielleicht meldet sich die Aorta...
					this.m_Events.subscribe('newPosition', (data) =>
					{
						CARWAY_Util_Geolocation.setHereMarker(this.toastController,this.m_CARWAY_LocationTracker_Provider,this.m_Map,true)
						this.m_Events.unsubscribe('newPosition');
					});
				}
			);
		}
	}
	
	private drawTrackMarkersAndStraightConnections()
	{
		let arrayTrack = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single;
		
		if(!this.isGeopositionAvailable(arrayTrack))
		{
			return;
		}

		arrayTrack.forEach(track => 
		{
			let latlngList:Array<any> = new Array<any>();

			// Startpositon anzeigen
			if(track.m_GeopositionStart.coords.latitude>0 && track.m_GeopositionStart.coords.longitude>0)
			{
				latlngList.push(new google.maps.LatLng (track.m_GeopositionStart.coords.latitude,track.m_GeopositionStart.coords.longitude));
				
				CARWAY_Util_Geolocation.addMarker(
						this.m_Map,
						GlobalConstants.CARWAY_MARKER_66,
						track.m_GeopositionStart.coords.latitude,
						track.m_GeopositionStart.coords.longitude,
						"<h3>Start:</h3><p>"+track.m_sTitle+"</p><p>"+track.m_GeopositionStart.m_sFormattedAddress+"<p/>",
						false);
			}

			// Zielpositon anzeigen
			if(track.m_GeopositionZiel.coords.latitude>0 && track.m_GeopositionZiel.coords.longitude>0)
			{
				latlngList.push(new google.maps.LatLng (track.m_GeopositionZiel.coords.latitude,track.m_GeopositionZiel.coords.longitude));
				
				CARWAY_Util_Geolocation.addMarker(
						this.m_Map,
						GlobalConstants.CARWAY_MARKER_66,
						track.m_GeopositionZiel.coords.latitude,
						track.m_GeopositionZiel.coords.longitude,
						"<h3>Ziel:</h3><p>"+track.m_sTitle+"</p><p>"+track.m_GeopositionZiel.m_sFormattedAddress+"<p/>",
						false);
			}

			
			if(!track.m_ArrayBackgroundGeolocationResponse || track.m_ArrayBackgroundGeolocationResponse.length==0)
			{
				if(track.m_GeopositionStart.coords.latitude>0 && track.m_GeopositionZiel.coords.latitude>0)
				{
					if(track.m_GeopositionStart.coords.latitude!=track.m_GeopositionZiel.coords.latitude && track.m_GeopositionStart.coords.longitude!=track.m_GeopositionZiel.coords.longitude)
					{
						let arrayGoogleLatLng:Array<google.maps.LatLng> =
						[
							new google.maps.LatLng(track.m_GeopositionStart.coords.latitude,track.m_GeopositionStart.coords.longitude),
							new google.maps.LatLng(track.m_GeopositionZiel.coords.latitude,track.m_GeopositionZiel.coords.longitude)
						]
		
						// Verbinde die Koordinaten Luftlinie 
						CARWAY_Util_Geolocation.addConnections(this.m_Map,arrayGoogleLatLng,false);
					}
				}
			}
		});
	}

	private setBoundsAndCenterMap()
	{
		let arrayTrack = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single;
	
		if(this.isGeopositionAvailable(arrayTrack))
		{
			// Bounds berechnen
			var bounds:google.maps.LatLngBounds = new google.maps.LatLngBounds();

			arrayTrack.forEach(track => 
			{
				if(track.m_GeopositionStart.coords.latitude>0)
				{
					bounds.extend(new google.maps.LatLng(track.m_GeopositionStart.coords.latitude,track.m_GeopositionStart.coords.longitude));
				}
				
				if(track.m_GeopositionZiel.coords.latitude>0)
				{
					bounds.extend(new google.maps.LatLng(track.m_GeopositionZiel.coords.latitude,track.m_GeopositionZiel.coords.longitude));
				}
			});

			// fitBounds() ersetzt den Zoom!
			this.m_Map.fitBounds(bounds);
			this.m_Map.setCenter(bounds.getCenter());
		}
	}

	private eventClickedStartTracking()
  	{
		this.m_CARWAY_Track_Service.startTracking(this.m_CARWAY_DayTrack_Provider.m_nActDayIndex);
  	}

  	private eventClickedStopTracking()
    {
		 this.m_CARWAY_Track_Service.stopTracking();
  	}

	public callbackDrawPositionOnMap(nLatPrev:number,nLngPrev:number,nLatAct:number,nLngAct:number)
	{
		this.m_LogProvider.add("callbackDrawPositionOnMap START","");
		this.m_LogProvider.add("callbackDrawPositionOnMap","nLatAct:"+nLatAct+" / nLngAct:"+nLngAct);
		// Neue, gemessene Koordinate
		CARWAY_Util_Geolocation.addCircle(this.m_Map,nLatAct,nLngAct);

		// Versuche ene Strasse zu finden, und gebe einzelne Koordinaten auf der Strasse zurück.
		CARWAY_Util_Geolocation.readSnappedRoutePoints(this.http,nLatPrev+","+nLngPrev+"|"+nLatAct+","+nLngAct)
		.then
		(
			(resolve:Array<routeSnappedToRoadLatLngPlace>) =>
			{
				let arrayGoogleLatLng:Array<google.maps.LatLng> = CARWAY_Util_Geolocation.convertLatLngPlaceToGoogleLatLng(resolve);
				
				this.m_LogProvider.add("callbackDrawPositionOnMap SNAPPED PUNKTE","arrayGoogleLatLng:"+arrayGoogleLatLng.length);
				
				// Verbinde die Koordinaten auf der Strasse
				CARWAY_Util_Geolocation.addConnections(this.m_Map,arrayGoogleLatLng,true);
			},
			error=>
			{
				this.m_CARWAY_Log_Provider.add("callbackDrawPositionOnMap","Error ("+error.code+")"+error.message);
			}
		);

		//Zentriere die Karte auf neue Koordinate und Zoome etwas heran.
		CARWAY_Util_Geolocation.centerMap(this.m_Map,nLatAct,nLngAct,15);
	}
	  
	private drawRoute()
	{
		this.m_CARWAY_Log_Provider.add("drawRoute","drawRoute");
		let arrayTrack = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single;
		
		if(!arrayTrack)
		{
			return;
		}
		
		arrayTrack.forEach(track => 
		{
			if(track.m_ArrayBackgroundGeolocationResponse)
			{
				let nOffset:number = 0;
				
				while(track.m_ArrayBackgroundGeolocationResponse.length>nOffset)
				{
					let aPart:Array<BackgroundGeolocationResponse> = new Array<BackgroundGeolocationResponse>();

					for(let i=0+nOffset ; i<50+nOffset && i<track.m_ArrayBackgroundGeolocationResponse.length ; i++)
					{
						aPart.push(track.m_ArrayBackgroundGeolocationResponse[i])
					}
				
					nOffset = nOffset + 50;

					let sPath = CARWAY_Util_Geolocation.convertGeolocationResponseToPath(aPart);
					
					// Versuche ene Strasse zu finden, und gebe einzelne Koordinaten auf der Strasse zurück.
					CARWAY_Util_Geolocation.readSnappedRoutePoints(this.http,sPath)
					.then
					(
						(resolve:Array<any>) =>
						{
							let arrayGoogleLatLng:Array<google.maps.LatLng> = CARWAY_Util_Geolocation.convertLatLngPlaceToGoogleLatLng(resolve);
							
							// Verbinde die Koordinaten auf der Strasse
							CARWAY_Util_Geolocation.addConnections(this.m_Map,arrayGoogleLatLng,true);
						},
						error=>
						{
							this.m_CARWAY_Log_Provider.add("drawRoute","Error ("+error.code+")"+error.message);
						}
					);
				}
			}
		});
	}
	
	public mouseoverWideDiv() 
	{
	  	this.slidesMap.lockSwipes(true);
	};
  
	public mouseleaveWideDiv() 
	{
	 	 this.slidesMap.lockSwipes(false);
 	};
  
	private nextSlide()
	{  
		this.m_bLoadingMap = true;
	
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
			
		this.calculateDistancesTimeIntervall(CARWAY_DISTANCES.WEEK);
		this.slidesMap.slideTo(1, 0, false);
		this.showMap();
	}
	
	private prevSlide()
	{
	   	this.m_bLoadingMap = true;
	
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
		 
		this.calculateDistancesTimeIntervall(CARWAY_DISTANCES.WEEK);
	   	this.slidesMap.slideTo(1, 0, false);
	   	this.showMap();
	}
	
	
	
	async berechneRoute(){
    let loader = this.loadingController.create({
      content:"Route berechnen..."
    });

    loader.present();
    
    var directionDisplay = new google.maps.DirectionsRenderer({suppressMakers:true});
    directionDisplay.setMap(this.m_Map);
    directionDisplay.setPanel(document.getElementById('beschreibung'));

    var directionsService = new google.maps.DirectionsService();
    directionsService.route({
      //origin: this.start,
     // destination:this.ziel,
      travelMode:'DRIVING'
    },function(result,status){
      if(status=='OK'){
        directionDisplay.setDirections(result);

      }
    });
    
    
    loader.dismiss();
  }

  
  reverseGeocode()
  {
	  /*
    let url:string = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.geoCodeExample}&key=AIzaSyCR5BUIo2C5JS8wCSanmmWQANLvwgq9ZCA`
    this.http.post(url, "").subscribe(data => 
      {
        var myObj = data.json();
        let coords:any = myObj.results[0].geometry.location;
      this.rgcOrt = " "+String(coords.lat)+" / "+String(coords.lng);
  }, error => {
      // this.errorMessage = JSON.stringify(error.json());
  });
  */
  }

 
  getDistance (start, end) {
    const origin = new google.maps.LatLng(start[0], start[1]);
    const final = new google.maps.LatLng(end[0], end[1]);
    const service = new google.maps.DistanceMatrixService();
  
    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(
      {
          origins: [origin],
        destinations: [final],
        travelMode: 'DRIVING'
      }, (response, status) => {
        if(status === 'OK') {
          resolve({ result: response.rows[0].elements[0]});
        } else {
          reject(new Error('Not OK'));
        }
      }
    );
    });
  }

  private calculateDistancesTimeIntervall(aCARWAY_DISTANCES:CARWAY_DISTANCES) 
  {
	  switch(aCARWAY_DISTANCES)
	  {
		  case CARWAY_DISTANCES.ALL:
			  this.m_oTotalKmAll = CARWAY_Util_Route.sumDistanceAllAsync(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model,false);
	  
		  case CARWAY_DISTANCES.WEEK:
			  this.m_oTotalKmWeek = CARWAY_Util_Route.sumDistanceWeekAsync(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model,CARWAY_Util_Date.getDateTimeFromKey(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_nTrackDayKey,CARWAY_KEY_TYPE.DATE),false);
		  
		  case CARWAY_DISTANCES.DAY:
			  this.m_oTotalKmToday = CARWAY_Util_Route.sumDistanceDayAsync(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex],false);
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
}