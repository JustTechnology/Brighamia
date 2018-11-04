import { CARWAY_Util_Text } from './../../util/CARWAY-util-text';
import { CARWAY_Log_Provider } from './../../providers/CARWAY-log-provider';
import { CarwayLocationTrackerProvider } from './../../providers/carway-location-tracker';
import { CARWAY_Model_Track_Single } from '../../models/CARWAY-model-track-single';
import { CARWAY_Util_Date } from '../../util/CARWAY-util-date';
import { CARWAY_Model_Settings_Provider } from '../../providers/CARWAY-model-settings-provider';
import { GlobalConstants, CARWAY_EDIT_STATE, CARWAY_EDIT_TYPE, CARWAY_KEY_TYPE, CARWAY_DISTANCES,LOADING_POSITION_STATE } from '../../providers/constants-provider';
import { CARWAY_DayTrack_Provider } from '../../providers/CARWAY-model-daytrack-provider';
import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Events, ToastController, Platform } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { CARWAY_Util_Clone } from '../../util/CARWAY-util-clone';
import { CARWAY_Util_Route } from '../../util/CARWAY-util-route';
import { CARWAY_Geoposition } from '../../models/CARWAY-model-geoposition';
import { CARWAY_Util_Geolocation } from '../../util/CARWAY-util-geolocation';

@IonicPage()
@Component({
  selector: 'page-routing',
  templateUrl: 'routing.html'
})

export class RoutingPage 
{
	@ViewChild('slides') slides: Slides;

	private m_bindShowSearchbar = false;
	private m_bPreventFirstSlide = true;
	private myGlobalConstants = GlobalConstants;
	private m_bShowEmail:boolean = true;

	private m_oTotalDurationTodayDriven:any;
	private m_oTotalDurationTodayMapAndReal:any;

	private m_oTotalDurationWeekDriven:any;
	private m_oTotalDurationWeekMapAndReal:any;
	
	private m_oTotalDurationAllDriven:any;
	private m_oTotalDurationAllMapAndReal:any;
	private m_bindDistanceInMeterMaps:string = "";
	
	constructor
	(
		public navCtrl: NavController,
		public navParams: NavParams,
		private alertController:AlertController,
		public m_CARWAY_DayTrack_Provider:CARWAY_DayTrack_Provider,
		private modalController:ModalController,
		private m_Events:Events,
		private toastController:ToastController,
		private m_EmailComposer:EmailComposer,
		private m_Platform:Platform,
		private m_CARWAY_Model_Settings_Provider:CARWAY_Model_Settings_Provider,
		private m_CarwayLocationTrackerProvider:CarwayLocationTrackerProvider,
		private m_NgZone:NgZone,
		private m_CARWAY_Log_Provider:CARWAY_Log_Provider,
	)   
  	{
		
	}

	ionViewDidLoad() 
	{
		if(!this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model)
		{
			this.m_Events.subscribe('loading_Tracks', (data) => 
			{ 
				this.calculateDurationTimeIntervall(CARWAY_DISTANCES.ALL);
			});
		}
		else
		{
			this.calculateDurationTimeIntervall(CARWAY_DISTANCES.ALL);
		}

		this.m_bShowEmail  = this.m_Platform.is('cordova'); 

		this.m_Events.subscribe('search:new', (data) =>
		{
			console.log("this.m_CARWAY_DayTrack_Provider:"+this.m_CARWAY_DayTrack_Provider.m_nActDayIndex);
			this.m_Events.publish('search:delete', true);
			
			this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks = this.m_CARWAY_DayTrack_Provider.getCARWAYModelDayArray(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_nTrackDayKey,1);
			//this.m_CARWAY_TabsData_Provider.m_CARWAY_Model_Day = this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1];
			this.slides.slideTo(1, 0, false);
		});

		this.m_Events.subscribe('search:open', (data) =>
		{
			this.m_bindShowSearchbar = data;
		});
		
	}

	editTrack(nTrackIndex:number)
	{
		this.showWizard(CARWAY_EDIT_TYPE.WIZARD, CARWAY_EDIT_STATE.TITLE, nTrackIndex);
	}

	editTitel(nTrackIndex:number)
	{
		this.showWizard(CARWAY_EDIT_TYPE.SINGLE, CARWAY_EDIT_STATE.TITLE, nTrackIndex);
	}

	editStart(nTrackIndex:number)
  	{
		if(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex].m_ArrayBackgroundGeolocationResponse && this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex].m_ArrayBackgroundGeolocationResponse.length>0)
		{
			alert("Der Standort kann nicht geändert werden, da es sich um eine automatisch aufgenommene Route handelt")
		}
		else
		{
			this.showWizard(CARWAY_EDIT_TYPE.SINGLE, CARWAY_EDIT_STATE.START, nTrackIndex);
		}
	} 
  
	editEnde(nTrackIndex:number)
	{
		if(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex].m_ArrayBackgroundGeolocationResponse && this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex].m_ArrayBackgroundGeolocationResponse.length>0)
		{
			alert("Der Standort kann nicht geändert werden, da es sich um eine automatisch aufgenommene Route handelt")
		}
		else
		{
			this.showWizard(CARWAY_EDIT_TYPE.SINGLE, CARWAY_EDIT_STATE.ZIEL, nTrackIndex);
		}
	} 
	
	editReport(nTrackIndex:number)
	{
		this.showWizard(CARWAY_EDIT_TYPE.SINGLE, CARWAY_EDIT_STATE.AKTION, nTrackIndex);
	  }
  
  	editComment(nTrackIndex:number)
	{
		this.showWizard(CARWAY_EDIT_TYPE.SINGLE, CARWAY_EDIT_STATE.KOMMENTAR, nTrackIndex);
	} 
	
  	showWizard(eCARWAY_EDIT_TYPE,eCARWAY_EDIT_STATE, nTrackIndex)
	{
		let aCARWAY_Model_Track_Save:CARWAY_Model_Track_Single = CARWAY_Util_Clone.cloneTrack(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex]);
	
		var modalPage = this.modalController.create('EditDataPage',
		{ 
			type:eCARWAY_EDIT_TYPE, 
			state: eCARWAY_EDIT_STATE,
			dayIndex: this.m_CARWAY_DayTrack_Provider.m_nActDayIndex, 
			trackIndex:nTrackIndex
		}
		,
		{
			showBackdrop: false
		});

		modalPage.present();

		modalPage.onDidDismiss(resolveSaveInfoData =>
		{
			if(resolveSaveInfoData.Save)
			{
				this.saveChanges(nTrackIndex,false)
			}
			else
			{
				this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex] = aCARWAY_Model_Track_Save;
			}		
		});
	}

	// Wenn ein Track in der Mitte hinzugefügt wurde muss der ganze Tag neu gespeichert werden.
	private saveChanges(nTrackIndex:number,bTrackAddedBetween:boolean)
	{
		this.m_CARWAY_DayTrack_Provider.prepareTrackForSave(this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,nTrackIndex)
		.then( (ready) =>
		{
			this.calculateDurationTimeIntervall(CARWAY_DISTANCES.ALL);
			
			if(bTrackAddedBetween)
			{
				this.m_CARWAY_DayTrack_Provider.saveTrackDay
				(
					this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex],
					this.m_CARWAY_DayTrack_Provider.m_nActDayIndex
				)
				.then
				(
					success=>
					{

					}
					,
					fail=>
					{
						CARWAY_Util_Text.showMessage(this.toastController,"Änderungen konnten nicht gespeichert werden");
					}
				);
			}
			else
			{
				this.m_CARWAY_DayTrack_Provider.saveTrack
				(
					this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex],this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,
					nTrackIndex
				)
				.then
				(
					success=>
					{

					}
					,
					fail=>
					{
						CARWAY_Util_Text.showMessage(this.toastController,"Änderungen konnten nicht gespeichert werden");
					}
				)
			}
		});
	}

	private calculateDurationTimeIntervall(aCARWAY_DISTANCES:CARWAY_DISTANCES) 
	{
		console.log("calculateDurationTimeIntervall");
		switch(aCARWAY_DISTANCES)
		{
			case CARWAY_DISTANCES.ALL:
				this.m_oTotalDurationAllDriven = CARWAY_Util_Route.sumDurationAllSecondsAsync(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model,true);
				this.m_oTotalDurationAllMapAndReal = CARWAY_Util_Route.sumDurationAllSecondsAsync(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model);
		
			case CARWAY_DISTANCES.WEEK:
				this.m_oTotalDurationWeekDriven = CARWAY_Util_Route.sumDurationWeekSecondsAsync(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model,CARWAY_Util_Date.getDateTimeFromKey(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_nTrackDayKey,CARWAY_KEY_TYPE.DATE),true);
				this.m_oTotalDurationWeekMapAndReal = CARWAY_Util_Route.sumDurationWeekSecondsAsync(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model,CARWAY_Util_Date.getDateTimeFromKey(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_nTrackDayKey,CARWAY_KEY_TYPE.DATE));
			
			case CARWAY_DISTANCES.DAY:
				this.m_oTotalDurationTodayDriven = CARWAY_Util_Route.sumDurationDaySecondsAsync(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex],true);
				this.m_oTotalDurationTodayMapAndReal = CARWAY_Util_Route.sumDurationDaySecondsAsync(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex]);
				break;
		}
	}

  	private nextSlide()
	{  
		if(this.m_bPreventFirstSlide) 
		{
			this.m_bPreventFirstSlide = false;
			return;
		}
		
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
		this.calculateDurationTimeIntervall(CARWAY_DISTANCES.WEEK);
		this.slides.slideTo(1, 0, false);
	}

	private prevSlide()
	{
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
		this.calculateDurationTimeIntervall(CARWAY_DISTANCES.WEEK);
		this.slides.slideTo(1, 0, false);
	}

	private addTrack(nTrackIndex:number)
	{	
		this.m_CARWAY_DayTrack_Provider.getNewTrack(this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,nTrackIndex);
		
		nTrackIndex = nTrackIndex + 1;

		let aCARWAY_Track = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex]; 	
		
		// Start und Ziel Timekeys setzen
		aCARWAY_Track.m_GeopositionStart.m_nDateTimeKey = Number(String(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_nTrackDayKey)+CARWAY_Util_Date.getActTimeKey());
		aCARWAY_Track.m_GeopositionZiel.m_nDateTimeKey = Number(String(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_nTrackDayKey)+CARWAY_Util_Date.getActTimeKey());
		
		var modalPage = this.modalController.create('EditDataPage',
		{ 
			type:CARWAY_EDIT_TYPE.WIZARD,
			state: CARWAY_EDIT_STATE.TITLE,
			dayIndex: this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,
			trackIndex:nTrackIndex
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
				let bTrackAddedBetween:boolean = nTrackIndex!=this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[this.m_CARWAY_DayTrack_Provider.m_nActDayIndex].m_arrayCARWAY_Model_Track_Single.length-1;
				this.saveChanges(nTrackIndex,!bTrackAddedBetween);
			}
			else
			{
				// Track löschen
				this.m_CARWAY_DayTrack_Provider.deleteTrack(this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,nTrackIndex);
				this.calculateDurationTimeIntervall(CARWAY_DISTANCES.ALL);
			}		
		});

		// Start- u Zielposition setzen
		this.m_CarwayLocationTrackerProvider.getPosition(false)
		.then
		(
			(resolvePosition:CARWAY_Geoposition) =>
			{	
				if(resolvePosition)
				{
					aCARWAY_Track.m_GeopositionStart.coords = CARWAY_Util_Clone.cloneCoordinates(resolvePosition.coords);
					aCARWAY_Track.m_GeopositionZiel.coords = CARWAY_Util_Clone.cloneCoordinates(resolvePosition.coords);
					aCARWAY_Track.m_GeopositionStart.m_sFormattedAddress = resolvePosition.m_sFormattedAddress;
					aCARWAY_Track.m_GeopositionZiel.m_sFormattedAddress = resolvePosition.m_sFormattedAddress;
	
					// Wizard Bescheid geben!
					this.m_Events.publish("newPosition_EditorOnly");
				}
			}
		);
	}

	private saveBusiness(nTrackKey:number)
	{
		this.m_CARWAY_DayTrack_Provider.saveBusiness(this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_nTrackDayKey,nTrackKey);
	}

	private savePrivate(nTrackKey:number)
	{
		this.m_CARWAY_DayTrack_Provider.savePrivate(this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_nTrackDayKey,nTrackKey);
	}

	private doRefresh(refresher)
	{
		this.m_CARWAY_DayTrack_Provider.readModelDay(this.m_CARWAY_DayTrack_Provider.m_nActDayIndex)
		.subscribe((snapshots) => 
		{
			this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks = this.m_CARWAY_DayTrack_Provider.getCARWAYModelDayArray(this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks[1].m_nTrackDayKey,1);
 
			setTimeout(() => 
			{
			  refresher.complete();
			}, 100);
		});
	}

	private clickedMerge(nTrackIndex:number)
	{
		let nDayKeyIndex:number = this.m_CARWAY_DayTrack_Provider.m_nActDayIndex;

		if(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayKeyIndex].m_arrayCARWAY_Model_Track_Single.length<nTrackIndex)
		{
			// Nothing to merge
			return;
		}

		let message: string =  `Möchten Sie die Route <p>'${this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayKeyIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex].m_sTitle}'</p> und die Route <p>'${this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayKeyIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex+1].m_sTitle}'</p> wirklich verbinden? Diese Änderung kann nicht zurückgenommen werden!`;

		let alert = this.alertController.create({
			title: 'Routen verbinden',
			message: message,
			buttons : [
				{
					text: "Nein, abbrechen",
					handler: data => 
					{
						return;
					}
				}
				,
				{
					text: "Ja, Routen verbinden",
					handler: data => 
					{
						this.mergeTrack(nDayKeyIndex,nTrackIndex);
					}
				}
			]
		});
		alert.present();
	}
	
	mergeTrack(nDayKeyIndex:number,nTrackIndex:number)
	{
		let aCarwayModelMergeFirst:CARWAY_Model_Track_Single = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayKeyIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex];
		let aCarwayModelMergeDelete:CARWAY_Model_Track_Single = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayKeyIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex+1];
		
		console.log("mergeTrackNow 1:"+JSON.stringify(aCarwayModelMergeFirst));
		console.log("mergeTrackNow 2 (delete):"+JSON.stringify(aCarwayModelMergeDelete));
		
		// Ankunft ersetzen
		aCarwayModelMergeFirst.m_GeopositionZiel = CARWAY_Util_Clone.cloneGeoposition(aCarwayModelMergeDelete.m_GeopositionZiel,false);
		
		aCarwayModelMergeDelete.m_sTitle ? aCarwayModelMergeFirst.m_sTitle += " / "+CARWAY_Util_Clone.cloneString(aCarwayModelMergeDelete.m_sTitle) : 1;  
		aCarwayModelMergeFirst.m_sComment ? aCarwayModelMergeFirst.m_sComment += " / "+CARWAY_Util_Clone.cloneString(aCarwayModelMergeDelete.m_sComment) : 1; 
		aCarwayModelMergeFirst.m_sReport ? aCarwayModelMergeFirst.m_sReport += " / "+CARWAY_Util_Clone.cloneString(aCarwayModelMergeDelete.m_sReport) : 1; 
		
		this.m_CARWAY_DayTrack_Provider.deleteTrack(nDayKeyIndex,nTrackIndex+1);
		
		this.saveChanges(nTrackIndex,true);
	}

	public deleteTrack(nTrackIndex:number)
	{
		if(this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_bShowDeleteMessage)
		{
			let alert = this.alertController.create();
			
			alert.setTitle("Route löschen");
			
			alert.setMessage("Möchten Sie diese Route wirklich löschen?");
		
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
				this.m_CARWAY_DayTrack_Provider.deleteTrack(this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,nTrackIndex);
				this.calculateDurationTimeIntervall(CARWAY_DISTANCES.ALL);
			}
			});

			alert.addButton({
				text: 'Ja, nicht mehr nachfragen',
				handler: data => 
				{
					this.m_CARWAY_Model_Settings_Provider.myLocationSettings.m_bShowDeleteMessage = false;
					this.m_CARWAY_Model_Settings_Provider.saveLocationSettings();
					this.m_CARWAY_DayTrack_Provider.deleteTrack(this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,nTrackIndex);
					this.calculateDurationTimeIntervall(CARWAY_DISTANCES.ALL);
				}
				});
			
				alert.present();
		}
		else
		{
			this.m_CARWAY_DayTrack_Provider.deleteTrack(this.m_CARWAY_DayTrack_Provider.m_nActDayIndex,nTrackIndex);
			this.calculateDurationTimeIntervall(CARWAY_DISTANCES.ALL);
		}
	}

	private eMailTrack(nDayIndex:number,nTrackIndex:number)
	{
		CARWAY_Util_Text.sendEMail(this.m_EmailComposer,this.toastController,this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[nDayIndex].m_arrayCARWAY_Model_Track_Single[nTrackIndex].toString());
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