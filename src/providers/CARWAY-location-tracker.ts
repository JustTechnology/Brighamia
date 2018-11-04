import { CARWAY_Util_Clone } from './../util/CARWAY-util-clone';
import { CARWAY_Log_Provider } from './CARWAY-log-provider';
import { CARWAY_Util_Text } from './../util/CARWAY-util-text';
import { CARWAY_Util_Geolocation } from './../util/CARWAY-util-geolocation';
import { Injectable} from '@angular/core';
import { CARWAY_Geoposition } from '../models/CARWAY-model-geoposition';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { CARWAY_Model_Settings_Provider } from './CARWAY-model-settings-provider';
import { ToastController, Events, Platform, AlertController, Alert } from 'ionic-angular';
import { Http } from '@angular/http';
import { BackgroundGeolocation, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';

@Injectable()
export class CarwayLocationTrackerProvider
{
	public m_bTrackingActive:boolean = false;
	
	private m_CurrentPosition:CARWAY_Geoposition = new CARWAY_Geoposition(); 
	private m_bPositionDeprecated:boolean = true;
	private m_AlertAskForGPS:Alert = null;
	
	constructor
	( 
		private m_Geolocation: Geolocation,
		private m_CARWAY_Model_Settings_Provider:CARWAY_Model_Settings_Provider,
		private m_CARWAY_Log_Provider:CARWAY_Log_Provider,
		private m_AlertController:AlertController,
		private m_ToastController:ToastController,
		private m_BackgroundGeolocation: BackgroundGeolocation,
		private m_Http: Http,
		private m_Platform:Platform,
	) 
  	{
		console.log("CarwayLocationTrackerProvider");
	}

	public getPosition(bForceReloadPosition:boolean) : Promise<CARWAY_Geoposition>
	{
		let aPromiseGeoposition:Promise<CARWAY_Geoposition>  = new Promise(resolvePosition =>
		{
			if(!this.m_Platform.is('cordova'))
			{
				// Kein GPS installiert
				this.clearGepositon();
				resolvePosition(null);
			}
			else
			{
				if(!this.m_Platform.is('core'))
				{
					// GPS ausgeschaltet?
					this.m_BackgroundGeolocation.isLocationEnabled()
					.then(nEnabled =>
					{
						if(nEnabled)
						{
							// Positionsbestimmung kann durchgeführt werden!
							resolvePosition(this.loadPosition(bForceReloadPosition))
						}
						else
						{
							// GPS ausgeschaltet -> WATCH aktiviert den GPS-Alert -> 
							resolvePosition(this.m_CurrentPosition); 
						}
					})
					.catch(error =>
					{
						// Es konnte nicht ermittelt werden, ob GPS aktiviert ist.
						resolvePosition(this.loadPosition(bForceReloadPosition));
					});
				}
				else
				{
					// Browser -> GPS aktiviert
					resolvePosition(this.loadPosition(bForceReloadPosition));
				}
			}
		});

		return aPromiseGeoposition;
	}
	 
	private loadPosition(bForceReload:boolean) : Promise<CARWAY_Geoposition>
	{
		let aPromiseGeoposition:Promise<CARWAY_Geoposition>  = new Promise(resolvePosition =>
		{
			if(bForceReload || this.m_bPositionDeprecated || this.m_CurrentPosition.coords.latitude == -1)
			{
				this.m_Geolocation.getCurrentPosition(this.m_CARWAY_Model_Settings_Provider.getGeolocationOptions())
				.then
				(
					(aGeoposition:Geoposition) => 
					{
						this.startPositionDeprecatedCounter();

						this.m_CurrentPosition.coords = CARWAY_Util_Clone.cloneCoordinates(aGeoposition.coords);
						
						CARWAY_Util_Geolocation.getLatLngDetails(this.m_Http,this.m_CurrentPosition.coords.latitude,this.m_CurrentPosition.coords.longitude)
						.subscribe
						(
							aLatLngDetail => 
							{
								this.m_CurrentPosition.m_sFormattedAddress = aLatLngDetail.json().results[0].formatted_address;
								resolvePosition(this.m_CurrentPosition);
							}
							,
							error => 
							{
								this.m_CurrentPosition.m_sFormattedAddress = JSON.stringify(error);
								resolvePosition(this.m_CurrentPosition);
							}
						)
					}
				)
				.catch
				(
					(error:any) => 
					{
						this.m_CurrentPosition.m_sFormattedAddress = JSON.stringify(error);
						resolvePosition(null);
					}
				);
			}
			else
			{
				resolvePosition(this.m_CurrentPosition); 
			}
		});

		return aPromiseGeoposition;
	}

	private startPositionDeprecatedCounter()
	{
		this.m_bPositionDeprecated = false;

		setTimeout( ()=>
		{
			this.m_bPositionDeprecated = true;
		}, 
		(this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_nReloadGeolocationInSeconds*10000));
	}
  
	private askForGPS()
	{
		if(this.m_AlertAskForGPS)
		{
			return;
		}

		this.m_AlertAskForGPS = this.m_AlertController.create(
		{
			title: 'GPS aktivieren',
			message: "Die Hauptfunktionen der App66 besteht aus dem automatischen Aufzeichnen von Routen. Hierfür wird das GPS-Signal benötigt. Bitte schalten Sie das GPS-System jetzt ein.",
			buttons : 
			[
				{
					text: "Standortermittlung erneut testen",
					handler: data => 
					{
						this.m_BackgroundGeolocation.isLocationEnabled()
						.then((nEnabled) =>
						{
							if(nEnabled)
							{
								// Alles OK -> GPS aktiv!
								return;
							}
							else
							{
								this.m_AlertAskForGPS = null;
								this.askForGPS();
							}	
						})
						.catch(error => 
						{
							this.m_CARWAY_Log_Provider.add("loadCurrentPosition","Error"+error.code+" - "+error.message);
				
							return;
						});
					}
				}
				,
				{
					text: "App 66 ohne GPS-System nutzen",
					handler: data => 
					{
						// GPS deaktivert lassen						
						return;
					}
				}
			]
		});
		
		this.m_AlertAskForGPS.present();

		this.m_AlertAskForGPS.onDidDismiss(()=>this.m_AlertAskForGPS = null);
	}

  	public startTracking(callbackBackgroudGeolocationReceived:Function) 
    {
		this.m_bTrackingActive = true;
		
		this.m_BackgroundGeolocation.configure(this.m_CARWAY_Model_Settings_Provider.getGeolocationBackgroundConfig())
		.subscribe
		(
			(aBackgroundGeolocationResponse:BackgroundGeolocationResponse) => 
			{
				callbackBackgroudGeolocationReceived(aBackgroundGeolocationResponse);
			}
			, 
			(error) => 
			{
				this.m_CARWAY_Log_Provider.add("loadCurrentPosition","Error"+error.code+" - "+error.message);
			}
		);
	
        this.m_BackgroundGeolocation.start();
  	}

  	public stopTracking() : Promise<any>
  	{
		this.m_bTrackingActive = false;

		return this.m_BackgroundGeolocation.stop();
 	}

	 private clearGepositon()
	 {
		 this.m_CurrentPosition.coords =  {latitude:-1,longitude:-1,accuracy:-1,altitude:-1,altitudeAccuracy:-1,heading:-1,speed:-1};
		 this.m_CurrentPosition.m_nDateTimeKey = -1;
		 this.m_CurrentPosition.m_sFormattedAddress = "";
		 this.m_CurrentPosition.timestamp = -1;
	 }
	 
	public watchGPSEnabled()
    {
		if(!this.m_Platform.is('cordova'))
		{
			return;
		}
		
		this.m_BackgroundGeolocation.isLocationEnabled()
		.then(nEnabled =>
		{
			if(!nEnabled)
			{
				this.askForGPS();
			}
		})
		.catch(error => 
		{
			this.m_CARWAY_Log_Provider.add("loadCurrentPosition","Error"+error.code+" - "+error.message);
		});
		
		this.m_BackgroundGeolocation.watchLocationMode()
		.subscribe
		(
			nEnabled => 
			{
				if(nEnabled)
				{
					if(this.m_AlertAskForGPS)
					{
						this.m_AlertAskForGPS.dismiss();
						this.m_AlertAskForGPS = null;
					}
				}
				else
				{
					this.askForGPS();
				}
			}
			,
			error => 
			{
				this.m_CARWAY_Log_Provider.add("loadCurrentPosition","Error"+error.code+" - "+error.message);
			}
		);
    }

	public loadCurrentPositionForced(aCallbackLoadingPositionFinished:Function,aCallbackReadingAddressFinished:Function)
  	{
		this.m_Geolocation.getCurrentPosition(this.m_CARWAY_Model_Settings_Provider.getGeolocationOptions())
		.then((aGeoposition:Geoposition) => 
		{
			this.m_Geolocation.getCurrentPosition(this.m_CARWAY_Model_Settings_Provider.getGeolocationOptions())
			.then((aGeoposition:Geoposition) => 
			{
				if(aGeoposition.coords.latitude != -1)
				{
					this.m_CurrentPosition.coords = aGeoposition.coords;
					
					aCallbackLoadingPositionFinished ? aCallbackLoadingPositionFinished() : 0;
					
					CARWAY_Util_Geolocation.getLatLngDetails(this.m_Http,this.m_CurrentPosition.coords.latitude,this.m_CurrentPosition.coords.longitude)
					.subscribe(aLatLngDetail => 
					{
						this.m_CurrentPosition.m_sFormattedAddress = aLatLngDetail.json().results[0].formatted_address;
						aCallbackReadingAddressFinished ? aCallbackReadingAddressFinished() : 0;
					});
				}
			})
			.catch((error) => 
			{
				this.m_CARWAY_Log_Provider.add("loadCurrentPositionForced","Error"+error.code+" - "+error.message);

				aCallbackLoadingPositionFinished ? aCallbackLoadingPositionFinished() : 0; 
			})
		})
		.catch((error) => 
		{
			this.m_CARWAY_Log_Provider.add("loadCurrentPositionForced","Error"+error.code+" - "+error.message);
			
			aCallbackLoadingPositionFinished ? aCallbackLoadingPositionFinished() : 0; 
		})
	}
}