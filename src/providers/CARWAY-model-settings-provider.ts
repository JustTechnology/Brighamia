import { Injectable } from '@angular/core';
import { CARWAY_Model_Settings } from '../models/CARWAY-model-settings';
import { GlobalConstants } from './constants-provider';
import { Storage } from '@ionic/storage';
import { GeolocationOptions } from '@ionic-native/geolocation';
import { BackgroundGeolocationConfig } from '@ionic-native/background-geolocation';

@Injectable()
export class CARWAY_Model_Settings_Provider 
{
    public myLocationSettings:CARWAY_Model_Settings;
    
    constructor(public storage: Storage) 
  	{
        this.myLocationSettings = new CARWAY_Model_Settings();
        
        this.readLocationSettings();
    }
    
    readLocationSettings()
    {
        this.storage.get(GlobalConstants.CARWAY_STORAGE_KEY)
        .then(result => 
        {
            if (result) 
            {
                this.myLocationSettings = JSON.parse(result);

                if(!this.myLocationSettings.m_nDesiredAccuracy)
                    this.myLocationSettings.m_nDesiredAccuracy = 0;
                
                if(!this.myLocationSettings.m_nStationaryRadius)
                    this.myLocationSettings.m_nStationaryRadius = 20;

                if(!this.myLocationSettings.m_nDistanceFilter)
                    this.myLocationSettings.m_nDistanceFilter = 5;
                 
                if(!this.myLocationSettings.m_nInterval)
                    this.myLocationSettings.m_nInterval = 2000;
                 
                if(!this.myLocationSettings.m_sNotificationTitle)
                    this.myLocationSettings.m_sNotificationTitle = "CARWAY";
                 
                if(!this.myLocationSettings.m_sNotificationText)
                    this.myLocationSettings.m_sNotificationText = "Ihre Fahrt wird aufgezeichnet....";
                
                if(!this.myLocationSettings.m_Home)
                    this.myLocationSettings.m_Home = null;
                
                if(!this.myLocationSettings.m_sNotificationIconColor)
                    this.myLocationSettings.m_sNotificationIconColor = "#fcd736";
                 
                if(!this.myLocationSettings.m_nReloadGeolocationInSeconds)
                    this.myLocationSettings.m_nReloadGeolocationInSeconds = 10;
            
                if(!this.myLocationSettings.m_nPositionDetectionAliveCount)
                    this.myLocationSettings.m_nPositionDetectionAliveCount = 30;
            } 
        });
    }

    saveLocationSettings()
    {
        let test:string = JSON.stringify(this.myLocationSettings); 
        
        this.storage.set(GlobalConstants.CARWAY_STORAGE_KEY,test);
    }

    public getGeolocationOptions() : GeolocationOptions
    {
        let aGeolocationOptions:GeolocationOptions = 
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        return aGeolocationOptions;
    }

    public getGeolocationBackgroundConfig() : BackgroundGeolocationConfig
    {
		let aBackgroundGeolocationConfig:BackgroundGeolocationConfig = 
  		{
			desiredAccuracy: 0,
			stationaryRadius: 20,
			distanceFilter: 5,
			debug: true,
			interval: 2000,
			notificationTitle:"APP 66",
			notificationText:"Ihre Route wird aufgezeichnet....",
			stopOnTerminate:true,
			startOnBoot:true,
			notificationIconColor:"#fcd736",
		};
  
        return aBackgroundGeolocationConfig;
    }

}