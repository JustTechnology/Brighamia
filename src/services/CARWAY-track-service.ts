import { CARWAY_Util_Date } from './../util/CARWAY-util-date';
import { CARWAY_Geoposition } from './../models/CARWAY-model-geoposition';
import { CARWAY_Log_Provider } from './../providers/CARWAY-log-provider';
import { CARWAY_Model_Track_Single } from './../models/CARWAY-model-track-single';
import { Injectable } from '@angular/core';
import { CarwayLocationTrackerProvider } from '../providers/carway-location-tracker';
import { BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';

import { CARWAY_KEY_TYPE, GlobalConstants } from '../providers/constants-provider';
import { CARWAY_Util_Geolocation } from '../util/CARWAY-util-geolocation';
import { Http } from '@angular/http';
import { ToastController, Events } from 'ionic-angular';
import { CARWAY_DayTrack_Provider } from '../providers/CARWAY-model-daytrack-provider';
import { CARWAY_Util_Text } from '../util/CARWAY-util-text';

@Injectable()
export class CARWAY_Track_Service
{
    private m_CARWAY_Model_Track_Single:CARWAY_Model_Track_Single = null;
    private m_nDayIndex:number = -1;
    private m_nTrackIndex:number = -1;
    
    constructor
    (
        private m_CARWAY_LocationTracker_Provider:CarwayLocationTrackerProvider,
        private m_CARWAY_Log_Provider:CARWAY_Log_Provider,
        private m_CARWAY_DayTrack_Provider:CARWAY_DayTrack_Provider,
        private m_Http:Http,
        private m_ToastController:ToastController,
        private m_Events:Events
    )
    {

    }

    public isTrackingActive() : boolean
    {
        return this.m_CARWAY_LocationTracker_Provider.m_bTrackingActive; 
    }

    public startTracking(nDayIndex:number)
    {
        this.m_nDayIndex = nDayIndex;
        this.m_nTrackIndex = 0;
        
        this.stopTracking()
        .then(resolve =>
        {
            this.m_CARWAY_Model_Track_Single = this.m_CARWAY_DayTrack_Provider.getNewTrack(nDayIndex,-1);
            this.m_CARWAY_LocationTracker_Provider.startTracking((aBackgroundGeolocationResponse:BackgroundGeolocationResponse) : void => { this.callbackBackgroudGeolocationReceived(aBackgroundGeolocationResponse);});
        })
        .catch(error =>
        {
			this.m_CARWAY_Log_Provider.add("startTracking","Error ("+error.code+")"+error.message);
        });
    }

    public stopTracking() : Promise<void>
    {
        let aPromise:Promise<void> = new Promise((resolve) =>
        {
            if(!this.m_CARWAY_Model_Track_Single)
            {
                resolve();
            }
    
            this.m_CARWAY_LocationTracker_Provider.stopTracking();
    
            // Titel
            this.m_CARWAY_Model_Track_Single.m_sTitle = 
                CARWAY_Util_Date.getTextFromTime(CARWAY_Util_Date.getDateTimeFromKey(this.m_CARWAY_Model_Track_Single.m_GeopositionStart.m_nDateTimeKey,CARWAY_KEY_TYPE.TIME))+ 
                " - " + 
                CARWAY_Util_Date.getTextFromTime(CARWAY_Util_Date.getDateTimeFromKey(this.m_CARWAY_Model_Track_Single.m_GeopositionZiel.m_nDateTimeKey,CARWAY_KEY_TYPE.TIME)); 
        
            // Track speichern
            this.m_CARWAY_DayTrack_Provider.prepareTrackForSave(this.m_nDayIndex,this.m_nTrackIndex)
			.then( () =>
			{
                this.m_CARWAY_DayTrack_Provider.saveTrack(this.m_CARWAY_Model_Track_Single,this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,this.m_nTrackIndex)
                .then
                (   
                    success=>
                    {
                        // Gespeichert
                        this.m_CARWAY_Log_Provider.add("Tracker","Track gespeichert");
                        this.m_CARWAY_Model_Track_Single = null;
                        resolve();
                    }
                    ,
                    fail=>
                    {
                        // Nicht gespeichert	
                        this.m_CARWAY_Log_Provider.add("Tracker","Track konnte nicht gespeichert werden.");
                        resolve();
                    }
                );
			});
        });

        return aPromise;
    }
    
    private processResponse(aBackgroundGeolocationResponse:BackgroundGeolocationResponse,aCARWAY_Geoposition:CARWAY_Geoposition)
    {
        this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse.push(aBackgroundGeolocationResponse);

        if(this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse.length==1)
        {
            this.m_Events.publish("callbackGeolocationResponse",
                GlobalConstants.NOT_SET,
                GlobalConstants.NOT_SET,
                this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse[this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse.length-1].latitude,
                this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse[this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse.length-1].longitude);
        }
        else if(this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse.length>1)
        {
            let nDistance:number = CARWAY_Util_Geolocation.getDistanceFromLatLonInM
            (
                this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse[this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse.length-2].latitude,
                this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse[this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse.length-2].longitude,
                this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse[this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse.length-1].latitude,
                this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse[this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse.length-1].longitude
            );

            this.m_CARWAY_Model_Track_Single.m_nDistanceDrivenMeter += nDistance; 
            
            this.m_Events.publish("callbackGeolocationResponse",
                this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse[this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse.length-2].latitude,
                this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse[this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse.length-2].longitude,
                this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse[this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse.length-1].latitude,
                this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse[this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse.length-1].longitude);
        }
        
        this.m_CARWAY_DayTrack_Provider.saveTrack(this.m_CARWAY_Model_Track_Single,this.m_nDayIndex,this.m_nTrackIndex)
    }
    public callbackBackgroudGeolocationReceived(aBackgroundGeolocationResponse:BackgroundGeolocationResponse)
    {
        if(!this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse)
        {
            this.m_CARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse = new Array<BackgroundGeolocationResponse>();
            
            this.setFormattedAdress(this.m_CARWAY_Model_Track_Single.m_GeopositionStart,aBackgroundGeolocationResponse)
            .then((ready)=>
            {
                this.processResponse(aBackgroundGeolocationResponse,this.m_CARWAY_Model_Track_Single.m_GeopositionStart);
            })
        }
        else
        {
            this.setFormattedAdress(this.m_CARWAY_Model_Track_Single.m_GeopositionZiel,aBackgroundGeolocationResponse)
            .then((ready)=>
            {
                this.processResponse(aBackgroundGeolocationResponse,this.m_CARWAY_Model_Track_Single.m_GeopositionZiel);
            })
        }
    }

    private setFormattedAdress(aCARWAY_Geoposition:CARWAY_Geoposition,aBackgroundGeolocationResponse:BackgroundGeolocationResponse)  : Promise<any>
	{
        let aPromiseSetFormattedAdress:Promise<any> = new Promise(ready  =>
        {
            aCARWAY_Geoposition.coords = {latitude:aBackgroundGeolocationResponse.latitude,longitude:aBackgroundGeolocationResponse.longitude,accuracy:GlobalConstants.NOT_SET,altitude:GlobalConstants.NOT_SET,altitudeAccuracy:GlobalConstants.NOT_SET,heading:GlobalConstants.NOT_SET,speed:GlobalConstants.NOT_SET};
            aCARWAY_Geoposition.m_nDateTimeKey = Number(CARWAY_Util_Date.getActDateTimeKey());
        
            // TODO aBackgroundGeolocationResponse.locationId
            CARWAY_Util_Geolocation.getPlaceFromLatLng(this.m_Http,this.m_CARWAY_Model_Track_Single.m_GeopositionStart.coords.latitude,this.m_CARWAY_Model_Track_Single.m_GeopositionStart.coords.longitude)
            .subscribe
            (
                aPlace => 
                {
                    aCARWAY_Geoposition.m_sFormattedAddress = aPlace.json().results[0].formatted_address;
                    CARWAY_Util_Text.showMessage(this.m_ToastController,"FormAdr:"+aCARWAY_Geoposition.m_sFormattedAddress);
                    ready();
                }
                , 
                (error) => 
                {
                    ready();
                }
            );
        });

        return aPromiseSetFormattedAdress;
    }
}