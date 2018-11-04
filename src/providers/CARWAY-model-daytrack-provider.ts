import { CARWAY_Model_Track_Single } from './../models/CARWAY-model-track-single';
import { CarwayLocationTrackerProvider } from './carway-location-tracker';
import { CARWAY_Date_Provider } from './CARWAY-date-provider';
import { CARWAY_Util_Date } from '../util/CARWAY-util-date';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { GlobalConstants, CARWAY_KEY_TYPE } from './constants-provider';
import { CARWAY_Log_Provider } from './CARWAY-log-provider';
import { CARWAY_Model_Car_Provider } from './CARWAY-model-car-provider';
import { CARWAY_Model_Day } from '../models/CARWAY-model-day';
import 'rxjs/add/operator/take' 
import { CARWAY_Model } from '../models/CARWAY-model';
import { Observable } from 'rxjs/Observable';
import { CARWAY_Model_Service } from '../models/CARWAY-model-service';
import { CARWAY_Geoposition } from '../models/CARWAY-model-geoposition';
import { CARWAY_Util_Clone } from '../util/CARWAY-util-clone';
import { CARWAY_Util_Route } from '../util/CARWAY-util-route';
import { SELECT_VALUE_ACCESSOR } from '@angular/forms/src/directives/select_control_value_accessor';
import { CARWAY_Util_Geolocation } from '../util/CARWAY-util-geolocation';

@Injectable()
export class CARWAY_DayTrack_Provider 
{
	public m_CARWAY_Model:CARWAY_Model = null;
	public m_bindArrayShowTracks:Array<CARWAY_Model_Day> = new Array<CARWAY_Model_Day>();
	public m_nActDayIndex:number = 1;
	
	constructor
	(
		private angularFireDatabase:AngularFireDatabase,
		private m_CARWAY_Log_Provider:CARWAY_Log_Provider,
		private m_CARWAY_Model_Car_Provider:CARWAY_Model_Car_Provider,
		private m_CARWAY_Date_Provider:CARWAY_Date_Provider,
		private m_CARWAY_LocationTracker_Provider:CarwayLocationTrackerProvider
	) 
	{
		console.log('construct CARWAY_DayTrack_Provider');
	}


	public getCARWAYModelDayArray(nDayKey:number,count:number) : Array<CARWAY_Model_Day>
	{
		let aArrayCARWAY_Model_Day = new Array<CARWAY_Model_Day>();
		
		if(!this.m_CARWAY_Model)
		{
			this.m_CARWAY_Model = new CARWAY_Model();
		}
		
		for(let i=-count ; i<=count ; i++)
		{
			let nDayKeyTemp = CARWAY_Util_Date.getDayKeyAddDay(nDayKey,CARWAY_KEY_TYPE.DATE,i);
			
			if(!this.m_CARWAY_Model.m_arrayCARWAY_Model_Day)
			{
				this.m_CARWAY_Model.m_arrayCARWAY_Model_Day = new Array<CARWAY_Model_Day>();
			}
			
			let nDayIndexTemp:number = this.m_CARWAY_Model.m_arrayCARWAY_Model_Day.findIndex(item => item && item.m_nTrackDayKey==nDayKeyTemp);
			if(nDayIndexTemp==-1)
			{
				// Day nicht vorhanden
				aArrayCARWAY_Model_Day.push(this.createDay(nDayKeyTemp));
			}
			else
			{
				// Day vorhanden
				aArrayCARWAY_Model_Day.push(this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndexTemp]);
			}
		}
		
		return aArrayCARWAY_Model_Day; 
	}

	public createDay(nDayKey:number) : CARWAY_Model_Day
	{
		let dDate:Date = CARWAY_Util_Date.getDateTimeFromKey(nDayKey,CARWAY_KEY_TYPE.DATE);
		let sTitle:string = CARWAY_Util_Date.getTitleFromDate(dDate);
		let sSubtitle:string = CARWAY_Util_Date.getSubtitleFromDate(dDate);

		let aDayKeyPrevious = CARWAY_Util_Date.getDayKeyAddDay(nDayKey,CARWAY_KEY_TYPE.DATE,-1);
		let aDayKeyNext = CARWAY_Util_Date.getDayKeyAddDay(nDayKey,CARWAY_KEY_TYPE.DATE,1);
		 
		let nDayIndexPrevious:number = this.m_CARWAY_Model.m_arrayCARWAY_Model_Day.findIndex(item=> item && item.m_nTrackDayKey==aDayKeyPrevious);
		let nDayIndexThis:number =this.m_CARWAY_Model.m_arrayCARWAY_Model_Day.length;
		let nDayIndexNext:number = this.m_CARWAY_Model.m_arrayCARWAY_Model_Day.findIndex(item=> item && item.m_nTrackDayKey==aDayKeyNext);

		if(nDayIndexPrevious>=0)
		{
			this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndexPrevious].m_nIndexNextCARWAYModelDay = nDayIndexThis;
			this.updateDay(this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndexPrevious],nDayIndexPrevious);
		}

		if(nDayIndexNext>=0)
		{
			this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndexNext].m_nIndexPreviousCARWAYModelDay = this.m_CARWAY_Model.m_arrayCARWAY_Model_Day.length;
			this.updateDay(this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndexNext],nDayIndexNext);
		}

		let aCARWAY_Model_Track_Day:CARWAY_Model_Day = new CARWAY_Model_Day();
		aCARWAY_Model_Track_Day.m_nTrackDayKey = nDayKey;
		aCARWAY_Model_Track_Day.m_dDate = dDate;
		aCARWAY_Model_Track_Day.m_sTitle  = sTitle;
		aCARWAY_Model_Track_Day.m_sSubtitle  = sSubtitle;
		aCARWAY_Model_Track_Day.m_nIndexNextCARWAYModelDay = nDayIndexNext;
		aCARWAY_Model_Track_Day.m_nIndexPreviousCARWAYModelDay = nDayIndexPrevious;

		// Nicht auf Firebase warten - Day sofort in Liste aufnehmen!
		this.m_CARWAY_Model.m_arrayCARWAY_Model_Day.push(aCARWAY_Model_Track_Day);
		
		this.saveTrackDay(aCARWAY_Model_Track_Day,nDayIndexThis);

		return aCARWAY_Model_Track_Day;
	}
	
	private updateDay(aCARWAY_Model_Day:CARWAY_Model_Day,nDayIndex:number)
	{
		let path:string = `${GlobalConstants.CARWAY_baseURL_Route}/${this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID}/${GlobalConstants.CARWAY_baseURL_Track}/${GlobalConstants.CARWAY_baseURL_Var_Days}/${nDayIndex}/`;

		// 3_Cars
		// RW-XD 712
		// Tracks
		// m_arrayCARWAY_Model_Day
		// <dayIndex>

		let promise = this.angularFireDatabase
			.object(path)
			.set(aCARWAY_Model_Day);
		
		promise
			.then((resolve) => 
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","Day erfolgreich in die Firebase aktualisert! resolve:"+resolve);
			}
			, 
			(reject) =>
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","Day konnte nicht in die Firebase aktualisert werden! reject:"+reject);
			});
			
		return promise;
	}

	public sortArray()
	{
		this.m_CARWAY_Model.m_arrayCARWAY_Model_Day.sort((item1,item2) => 
		{
			if(item1 && item2)
			{
				if(item1.m_nTrackDayKey>item2.m_nTrackDayKey)
					return 1;
				else
					return -1;
			}
		});
	}

	saveBusiness(nDayKey:number,nTrackKey:number)
	{
		let dayIndex:number = this. m_CARWAY_Model.m_arrayCARWAY_Model_Day.findIndex(item=> item && item.m_nTrackDayKey==nDayKey);
		let trackIndex:number = this. m_CARWAY_Model.m_arrayCARWAY_Model_Day[dayIndex].m_arrayCARWAY_Model_Track_Single.findIndex(item=> item && item.m_nTrackKey==nTrackKey);

		this. m_CARWAY_Model.m_arrayCARWAY_Model_Day[dayIndex].m_arrayCARWAY_Model_Track_Single[trackIndex].m_bIsPrivate = false;
		 
		let path:string = `${GlobalConstants.CARWAY_baseURL_Route}/${this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID}/${GlobalConstants.CARWAY_baseURL_Track}/${GlobalConstants.CARWAY_baseURL_Var_Days}/${dayIndex}/${GlobalConstants.CARWAY_baseURL_Var_Track}/${trackIndex}/`;
		path = path + "m_bIsPrivate";
		
		let promise = this.angularFireDatabase
			.object(path)
			.set(false);
		
		promise
			.then((resolve) => 
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","saveBusiness erfolgreich gespeichert! Key:"+resolve);
			}
			, 
			(reject) =>
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","saveBusiness konnte nicht gespeichert werden! reject:"+reject);
			});
	}

	savePrivate(nDayKey:number,nTrackKey:number)
	{
		let dayIndex:number = this. m_CARWAY_Model.m_arrayCARWAY_Model_Day.findIndex(item=> item && item.m_nTrackDayKey==nDayKey);
		let trackIndex:number = this. m_CARWAY_Model.m_arrayCARWAY_Model_Day[dayIndex].m_arrayCARWAY_Model_Track_Single.findIndex(item=> item && item.m_nTrackKey==nTrackKey);
		
		this. m_CARWAY_Model.m_arrayCARWAY_Model_Day[dayIndex].m_arrayCARWAY_Model_Track_Single[trackIndex].m_bIsPrivate = true;
		let path:string = `${GlobalConstants.CARWAY_baseURL_Route}/${this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID}/${GlobalConstants.CARWAY_baseURL_Track}/${GlobalConstants.CARWAY_baseURL_Var_Days}/${dayIndex}/${GlobalConstants.CARWAY_baseURL_Var_Track}/${trackIndex}/`;
		path = path + "m_bIsPrivate";

		let promise = this.angularFireDatabase
			.object(path)
			.set(true);
		
		promise
			.then((resolve) => 
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","savePrivate erfolgreich gespeichert! Key:"+resolve);
			}
			, 
			(reject) =>
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","savePrivate konnte nicht gespeichert werden! reject:"+reject);
			});
	}

	public deleteTrack(nDayIndex:number,nTrackIndex:number)
	{
		this. m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Track_Single.splice(nTrackIndex,1);

		// Ganzen Tag speichern um korrekte Reihenfolge herzustellen
		this.saveTrackDay(this. m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex],nDayIndex);
	}
	
	public readModel(sCarID:string)
	{
		this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider::readModel2","sCarID:"+sCarID);
		let path:string = `${GlobalConstants.CARWAY_baseURL_Route}/${sCarID}/${GlobalConstants.CARWAY_baseURL_Track}/`;
		
		let promise = this.angularFireDatabase
			.object<CARWAY_Model>(path)
			.valueChanges()
			.take(1);
		
		promise
		.subscribe((aCARWAYModel) => 
		{
			if(aCARWAYModel)
			{
				this.m_CARWAY_Model = aCARWAYModel as CARWAY_Model;

				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider::readModel","Model erfolgreich gelesen: aCARWAYModel:"+aCARWAYModel);
			}
			else
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider::readModel","Kein Model vorhanden!");
			}
		});

		return promise;
	}

	public readModelDay(nDayIndex:number)
	{
		// TODO Passt der Index immer?
		let path:string = `${GlobalConstants.CARWAY_baseURL_Route}/${this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID}/${GlobalConstants.CARWAY_baseURL_Track}/${GlobalConstants.CARWAY_baseURL_Var_Days}/${nDayIndex}`;
		
		let promise = this.angularFireDatabase
		.object<CARWAY_Model_Day>(path)
		.valueChanges()
		.take(1);
		
		promise
		.subscribe((snapshots) => 
		{
			if(snapshots)
			{
				this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex] = snapshots as CARWAY_Model_Day;
		
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","Day erfolgreich gelesen! Snapshot:"+snapshots);
			}
			else
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","Day konnte nicht gelesen werden!");
			}
		});
 
		return promise;

	}
	public deleteService(nDayIndex:number,nServiceIndex:number) 
  	{
		this. m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Service.splice(nServiceIndex,1);
		
		//let path:string = `${GlobalConstants.CARWAY_baseURL_Route}/${this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID}/${GlobalConstants.CARWAY_baseURL_Track}/${GlobalConstants.CARWAY_baseURL_Var_Days}/${nDayIndex}/${GlobalConstants.CARWAY_baseURL_Var_Service}/${nServiceIndex}/`;
		
		// Ganzen Tag speichern um korrekte Reihenfolge herzustellen
		this.saveTrackDay(this. m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex],nDayIndex);		
		
		// 3_Cars
		// RW-XD 712
		// Tracks
		// m_arrayCARWAYm_CARWAY_Model_Track_Car_Model_Day
		// <dayTrackIndex>
		// <m_arrayCARWAY_Model_Service>
		// <serviceIndex>
		
		/*let promise = this.angularFireDatabase
			.object(path)
			.remove();
		
		promise
		.then((resolve) => 
		{
			this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","Service erfolgreich gelöscht! Key:"+resolve);
		}
		, 
		(reject) =>
		{
			this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","Service konnte nicht gelöscht werden! reject:"+reject);
		});
		*/
	}

	public saveService(aCARWAY_Model_Service:CARWAY_Model_Service,nDayIndex:number,nServiceIndex:number)
	{
		let path:string = `${GlobalConstants.CARWAY_baseURL_Route}/${this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID}/${GlobalConstants.CARWAY_baseURL_Track}/${GlobalConstants.CARWAY_baseURL_Var_Days}/${nDayIndex}/${GlobalConstants.CARWAY_baseURL_Var_Service}/${nServiceIndex}/`;

		// 3_Cars
		// RW-XD 712
		// Tracks
		// m_arrayCARWAY_Model_Day
		// <dayIndex>
	
		let promise = this.angularFireDatabase
			.object(path)
			.set(aCARWAY_Model_Service);
		
		promise
			.then((resolve) => 
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_Model_Service","Service erfolgreich in die Firebase gespeichert! resolve:"+resolve);
			}
			, 
			(reject) =>
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_Model_Service","Service konnte nicht in die Firebase gespeichert werden! reject:"+reject);
			});
			
		return promise;
	
	}

	public getNewTrack(nDayIndex:number,nAfterTrackIndex:number) : CARWAY_Model_Track_Single
	{
		let nTrackIndex = nAfterTrackIndex+1;
		let aCARWAY_Model_Track_Single:CARWAY_Model_Track_Single = new CARWAY_Model_Track_Single(new CARWAY_Geoposition(),new CARWAY_Geoposition());
		
		aCARWAY_Model_Track_Single.m_nTrackKey = CARWAY_Util_Date.getNowTrackKey();

		if(this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Track_Single)
		{
			// Track-Array exisitiert
			this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Track_Single.splice(nTrackIndex, 0, aCARWAY_Model_Track_Single); 

			// Aufgrund der geänderten Indizes muss der ganze Tag gespeichert werden.
			//this.saveTrackDay(this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex],nDayIndex);
		}
		else
		{
			// Track-Array muss erst angelegt werden
			this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Track_Single = new Array<CARWAY_Model_Track_Single>(); 
			this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Track_Single.push(aCARWAY_Model_Track_Single); 

			nTrackIndex =  0;
			
			// Aufgrund der geänderten Indizes muss der ganze Tag gespeichert werden.
			/*this.saveTrack(aCARWAY_Model_Track_Single,nDayIndex,0)
			.then((resolve) => 
			{
			}
			, 
			(reject) =>
			{
			
			});*/
		}

		return aCARWAY_Model_Track_Single;
	}
	
	public prepareTrackForSave(nDayIndex:number,nTrackIndex:number) : Promise<void>
	{
		let aPromisePrepareFinished:Promise<void>  = new Promise(ready =>
		{
			let aCARWAY_Model_Track_Single:CARWAY_Model_Track_Single =  this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex];

			aCARWAY_Model_Track_Single.m_nDurationDrivenSeconds = CARWAY_Util_Route.calculateSetDuration(aCARWAY_Model_Track_Single.m_GeopositionStart.m_nDateTimeKey,aCARWAY_Model_Track_Single.m_GeopositionZiel.m_nDateTimeKey);
			aCARWAY_Model_Track_Single.m_nDurationSetSeconds = CARWAY_Util_Route.calculateSetDuration(aCARWAY_Model_Track_Single.m_GeopositionStart.m_nDateTimeKey,aCARWAY_Model_Track_Single.m_GeopositionZiel.m_nDateTimeKey);
			//aCARWAY_Model_Track_Single.m_nDurationAllSeconds = aCARWAY_Model_Track_Single.m_nDurationSetSeconds+aCARWAY_Model_Track_Single.m_nDurationDrivenSeconds;

			CARWAY_Util_Route.calculateDistanceAndDurationRoute(aCARWAY_Model_Track_Single.m_GeopositionStart.coords,aCARWAY_Model_Track_Single.m_GeopositionZiel.coords)
			.then
			(
				resolve => 
				{
					console.log("prepareTrackForSave2:"+resolve.result.status);
					if(resolve.result.status != "ZERO_RESULTS")
					{
						console.log("prepareTrackForSave5:"+resolve.result.duration.value);
						if(resolve.result.duration.value)
						{
							console.log("prepareTrackForSave6:"+resolve.result.duration.value);
							this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex].m_nDurationMapSeconds = resolve.result.duration.value;
						}
	
						if(resolve.result.distance.value)
						{
							console.log("prepareTrackForSave7:"+resolve.result.duration.value);
							this.m_CARWAY_Log_Provider.add("resolve.result.distance.value",resolve.result.distance.value);
							this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex].m_nDistanceMapsMeter = resolve.result.distance.value;
						}
					}
					else
					{
						this.m_CARWAY_Log_Provider.add("resolve.result.status","ZERO RESULT");
						this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex].m_nDistanceMapsMeter = 0;
					}

					ready();
				}
				,
				reject=>
				{
					console.log("prepareTrackForSave3:");
					this.m_CARWAY_Log_Provider.add("resolve.result.status","reject");
					this.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex].m_nDistanceMapsMeter = 0;

					ready();
				}	
			);
		});
		
		return aPromisePrepareFinished;
	}

	public saveTrackDay(aCARWAY_Model_DayTrack:CARWAY_Model_Day,nDayIndex:number) : Promise<any>
	{
		let aPromiseSaveTrackDay:Promise<any>  = new Promise((success,fail) =>
		{
			let path:string = `${GlobalConstants.CARWAY_baseURL_Route}/${this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID}/${GlobalConstants.CARWAY_baseURL_Track}/${GlobalConstants.CARWAY_baseURL_Var_Days}/${nDayIndex}/`;
								
			this.angularFireDatabase
			.object(path)
			.set(aCARWAY_Model_DayTrack)
			.then((resolve) => 
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","Day erfolgreich in die Firebase gespeichert! resolve:"+resolve);
				success();
			}
			, 
			(reject) =>
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","Day konnte nicht in die Firebase gespeichert werden! reject:"+reject);
				fail();
			});
		});

		return aPromiseSaveTrackDay;
	} 

	public saveTrack(aTempCARWAY_Model_Track:CARWAY_Model_Track_Single, dayIndex:number, trackIndex:number)
	{
		let aPromiseSaveTrack:Promise<any>  = new Promise((success,fail) =>
		{
			this.m_CARWAY_Log_Provider.add("saveTrack","saveTrack "+dayIndex+" "+trackIndex+" "+aTempCARWAY_Model_Track);
			let path:string = `${GlobalConstants.CARWAY_baseURL_Route}/${this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID}/${GlobalConstants.CARWAY_baseURL_Track}/${GlobalConstants.CARWAY_baseURL_Var_Days}/${dayIndex}/${GlobalConstants.CARWAY_baseURL_Var_Track}/${trackIndex}/`;
			
			this.m_CARWAY_Log_Provider.add("saveTrack","path "+path);
			this.angularFireDatabase
			.object(path)
			.set(aTempCARWAY_Model_Track)
			.then
			(
				(resolve) => 
				{
					this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","Track erfolgreich gespeichert! Key:"+resolve);
					success();
				}
				, 
				(reject) =>
				{
					this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","Track konnte nicht gespeichert werden! reject:"+reject);
					fail();
				}
			)
			.catch(error=>
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider","Track konnte nicht gespeichert werden! error:"+JSON.stringify(error));
				fail();
			});
		});

		return aPromiseSaveTrack;
	}

	public deletePicture(sCarID:string,nDayIndex:number,nServiceIndex:number,nServiceItemIndex:number,nPictureIndex:number)
	{
		let path:string = `${GlobalConstants.CARWAY_baseURL_Route}/${this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID}/${GlobalConstants.CARWAY_baseURL_Track}/${GlobalConstants.CARWAY_baseURL_Var_Days}/${nDayIndex}/${GlobalConstants.CARWAY_baseURL_Var_Service}/${nServiceIndex}/${GlobalConstants.CARWAY_baseURL_Var_Service_Item}/${nServiceItemIndex}/${GlobalConstants.CARWAY_baseURL_Var_Service_Item_PictureArray}/${nPictureIndex}`;

		// 3_Cars
		// RW-XD 712
		// Tracks
		// m_arrayCARWAY_Model_Day
		// <dayIndex>
	
		let promise = this.angularFireDatabase
			.object(path)
			.remove();
	}
}
