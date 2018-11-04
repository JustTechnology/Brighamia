import { CARWAY_Model_Service_Struct_Item } from './../../models/CARWAY-model-service-struct-item';
import { CARWAY_KEY_TYPE,GlobalConstants, CARWAY_WIZARD_OBJECT } from './../../providers/constants-provider';
import { CARWAY_Util_Date } from './../../util/CARWAY-util-date';
import { CARWAY_Model } from './../../models/CARWAY-model';
import { CARWAY_Util_Text } from './../../util/CARWAY-util-text';
import { CARWAY_DayTrack_Provider } from '../../providers/CARWAY-model-daytrack-provider';
import { LoadingService } from '../../services/loading-service';
import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, MenuController, IonicPage, NavParams, Events, Keyboard, AlertController, Alert, ToastController } from 'ionic-angular';
import { TabPage3 } from '../tab-page-3/tab-page-3';
import { CARWAY_Log_Provider } from '../../providers/CARWAY-log-provider';
import { TabPage1 } from '../tab-page-1/tab-page-1';
import { CARWAY_Model_Car_Provider } from '../../providers/CARWAY-model-car-provider';
import { RoutingPage } from '../routing/routing';
import { IonPullUpFooterState, IonPullUpComponent } from 'ionic-pullup';
import { CarwayLocationTrackerProvider } from '../../providers/carway-location-tracker';
import { Network } from '@ionic-native/network';
import { CARWAY_Geoposition } from '../../models/CARWAY-model-geoposition';
import { CARWAY_Track_Service } from '../../services/CARWAY-track-service';
import { CarwayModelServiceStructProvider } from '../../providers/CARWAY-model-service-struct-provider';
import { CARWAY_Model_Service_Struct } from '../../models/CARWAY-model-service-struct';
import { Storage as IonicStorage } from '@ionic/storage';


@IonicPage
({
    segment:"Kennzeichen/:userid"
})

@Component
({
    selector: 'page-home',
    templateUrl: 'home.html',
})

export class HomePage 
{
    @ViewChild('pullup') pullup: IonPullUpComponent;
    @ViewChild('tabs') tabs: any;
    
    public dateTimeTodayButton: any = {
        buttons: [{
          text: 'Heute',
          handler: () => this.changeDate(null)
        }]
    }

    private m_bShowDateSelector:boolean = false;
    private m_bindShowSearchbar:boolean = false;
    private m_NetworkConnectSubscription = null;
    private m_NetworkDisconnectSubscription = null;
    private m_bShowSearchList=true;
    public tabPageRoute = RoutingPage;
    public tabPageBericht = TabPage3;
    public tabPageEmpty = TabPage1;
    private m_bAlertGPSActive:boolean = false;
    private m_bAlertNetwork:boolean = false;
    private m_alertNetwork:Alert = null; 
    private m_Date:Date = null;

    // State 
    private m_nGPSActiv:number = -1;

    public footerState: IonPullUpFooterState;
    public m_ArraySearchResults : any[] = [];
    
    // Search
    public m_bindTitle:string;
    public m_bindActDayTrack:number;

    private m_bTrackingActive:boolean = false;
    
    private m_sArrayTitles:any[] = []; 
    private m_sArrayIndexDay:number[] = []; 
    
    constructor
    (   
        public platform: Platform,
        public navCtrl: NavController,
        public navParams:NavParams,
        public menuCtrl: MenuController,
        public m_AlertController:AlertController,
        public  loadingService:LoadingService,
        private m_CARWAY_Log_Provider:CARWAY_Log_Provider,
        private m_CARWAY_Model_Car_Provider:CARWAY_Model_Car_Provider,
        private m_CARWAY_DayTrack_Provider:CARWAY_DayTrack_Provider,
        private m_CARWAY_LocationTracker_Provider:CarwayLocationTrackerProvider,
        private m_Events:Events,
        private keyboard:Keyboard,
        private network:Network,
        private m_ToastController:ToastController,
        private m_CARWAY_Track_Service:CARWAY_Track_Service,
        private m_CarwayModelServiceStructProvider:CarwayModelServiceStructProvider,
        private m_IonicStorage:IonicStorage
    ) 
    {
        if(this.m_CARWAY_Model_Car_Provider.m_sSignFromStorage)
        {
            this.initializeApp();
        }
        else
        {
            this.readKeyFromStorage()
            .then((sSign) =>
            {
                // Im Debug findet er den Key nicht!
                if(!sSign)
                {
                    this.m_CARWAY_Model_Car_Provider.m_sSignFromStorage = "";
                    console.log("readKeyFromStorage->WizardPage");
                    this.navCtrl.setRoot('WizardPage');
                }
                else 
                {
                    this.m_CARWAY_Model_Car_Provider.m_sSignFromStorage = sSign;
                    console.log("readKeyFromStorage->HomePage:"+sSign);
                    
                    this.initializeApp();
                }
            })
    
        }
    }

    private readKeyFromStorage()
    {
        let promise = this.m_IonicStorage.get(GlobalConstants.CARWAY_STORAGE_ACT_SIGN);
        
        promise
        .then((sSign:string) =>
        {
            if(sSign)
            {
                this.m_CARWAY_Log_Provider.add("CARWAY_Model_User","Key erfolgreich aus IONIC Storage gelesen!:"+sSign);
            }
            else
            {
                this.m_CARWAY_Log_Provider.add("CARWAY_Model_User","Key konnte nicht aus IONIC Storage gelesen werden!:"+sSign);
            }
        })
        .catch((error) => 
        {
            this.m_CARWAY_Log_Provider.add("MyApp","initializeApp()=>Fehler beim Lesen aus IONIC Storage!:"+error);
            
            // Gastzugang
            //this.rootPage = 'WizardPage';
        });
                
        return promise;
    }


    ionViewDidLoad()
    {

    }

    private initializeApp() 
    {
        this.platform.ready().then(() => 
        {
            this.loadingService.show('Initialisiere App66');

            // NETWORK
            this.m_CARWAY_Log_Provider.add("loadData","Init App");
            this.loadData();
            this.watchNetworkEnabled();
            
            // LOCATION
            this.m_CARWAY_LocationTracker_Provider.watchGPSEnabled();
            this.reloadPosition();        
            this.subscribeEvents();
            
            this.keyboard.hideFormAccessoryBar(true);

            this.footerState = IonPullUpFooterState.Collapsed;

            this.menuCtrl.enable(true);
        });    
    }

    private loadData()
    {
        this.m_CARWAY_Log_Provider.add("loadData","Start Load Data:"+this.m_CARWAY_Model_Car_Provider.m_sSignFromStorage);
        
        if(this.network.type != 'none')
        {
            this.m_CARWAY_Model_Car_Provider.read(this.m_CARWAY_Model_Car_Provider.m_sSignFromStorage);

            this.m_CARWAY_DayTrack_Provider.readModel(this.m_CARWAY_Model_Car_Provider.m_sSignFromStorage)
            .subscribe
            (
                (aCARWAYModel:CARWAY_Model) => 
                {
                    let nTodayKey = CARWAY_Util_Date.getKeyFromDate(new Date(),CARWAY_KEY_TYPE.DATE);

                    this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks = this.m_CARWAY_DayTrack_Provider.getCARWAYModelDayArray(nTodayKey,1);
                    this.m_CARWAY_DayTrack_Provider.m_nActDayIndex = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day.findIndex(item=> item && item.m_nTrackDayKey==nTodayKey);

                    // Tell application that data is loaded
                    this.m_Events.publish('loading_Tracks', true);

                    this.loadingService.hide();
                }
                , 
                (error) => 
                {
                    this.m_CARWAY_Log_Provider.add("loadData","Error:"+JSON.stringify(error));
                }
            )

            this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct = [];

            this.insertDefaultServiceStruct();

            this.m_CarwayModelServiceStructProvider.read("All")
            .subscribe
            (
                (aArray_CARWAY_Model_Service_Struct:Array<CARWAY_Model_Service_Struct>) =>
                {
                    if(aArray_CARWAY_Model_Service_Struct)
                    {
                        aArray_CARWAY_Model_Service_Struct.forEach(aCARWAY_Model_Service_Struct => 
                        {
                            this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct.push(aCARWAY_Model_Service_Struct);
                        });
                    }
                }
                ,
                (error) =>
                {
                    this.m_CARWAY_Log_Provider.add("loadData ServiceStruct","Error:"+JSON.stringify(error));
                }
            );
            
            this.m_CarwayModelServiceStructProvider.read(this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID)
            .subscribe
            (
                (aArray_CARWAY_Model_Service_Struct_User:Array<CARWAY_Model_Service_Struct>) =>
                {
                    if(aArray_CARWAY_Model_Service_Struct_User)
                    {
                        aArray_CARWAY_Model_Service_Struct_User.forEach(aCARWAY_Model_Service_Struct => 
                        {
                            this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct.push(aCARWAY_Model_Service_Struct);
                        });
                    }
                }   
            );
        }
        else
        {
            this.askForNetwork(true);
        }
    }

    private insertDefaultServiceStruct()
    {
        this.insertDefaultServiceStructGasoline();
        this.insertDefaultServiceStructWerkstatt();
        this.insertDefaultServiceStructCleanpark();

        // this.m_CarwayModelServiceStructProvider.save("All")
    }
    
    private insertDefaultServiceStructGasoline()
    {
		let aCARWAY_Model_Service_StructGasoline:CARWAY_Model_Service_Struct = new CARWAY_Model_Service_Struct();

        aCARWAY_Model_Service_StructGasoline.m_ServiceStructTitle = "Tanken";
        aCARWAY_Model_Service_StructGasoline.m_sPathIcon = "assets/icons/icoGasStation.png"
        aCARWAY_Model_Service_StructGasoline.m_bDeletable = false;
 
		aCARWAY_Model_Service_StructGasoline.m_ArrayCarwayModelServiceStructItem  = new Array<CARWAY_Model_Service_Struct_Item>(); 

        let aCARWAY_Model_Service_Struct_Item_Place =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.LOCATION);
        aCARWAY_Model_Service_Struct_Item_Place.m_ServiceStructTitle = "Wo hast du getankt?";
        aCARWAY_Model_Service_Struct_Item_Place.m_ServiceStructPlaceholder = "Hier den Ort der Tankstelle auswählen";
        aCARWAY_Model_Service_StructGasoline.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_Place);
         
        let aCARWAY_Model_Service_Struct_Item_Time =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.TIME);
        aCARWAY_Model_Service_Struct_Item_Time.m_ServiceStructTitle = "Wann hast du getankt?";
        aCARWAY_Model_Service_Struct_Item_Time.m_ServiceStructPlaceholder = "";
        aCARWAY_Model_Service_StructGasoline.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_Time);
         
        let aCARWAY_Model_Service_Struct_Item_Costs =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.COSTS);
        aCARWAY_Model_Service_Struct_Item_Costs.m_ServiceStructTitle = "Wieviel hat der Sprit gekostet?";
        aCARWAY_Model_Service_Struct_Item_Costs.m_ServiceStructPlaceholder = "Benzin/Super/Diesel";
        aCARWAY_Model_Service_StructGasoline.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_Costs);
        
        let aCARWAY_Model_Service_Struct_Item_Text =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.TEXT);
        aCARWAY_Model_Service_Struct_Item_Text.m_ServiceStructTitle = "Möchtest du etwas dazu sagen?";
        aCARWAY_Model_Service_Struct_Item_Text.m_ServiceStructPlaceholder = "Beliebiger Kommentar";
        aCARWAY_Model_Service_StructGasoline.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_Text);
        
        this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct.push(aCARWAY_Model_Service_StructGasoline);
    }

    private insertDefaultServiceStructWerkstatt()
    {
		let aCARWAY_Model_Service_StructRepair:CARWAY_Model_Service_Struct = new CARWAY_Model_Service_Struct();
        aCARWAY_Model_Service_StructRepair.m_ServiceStructTitle = "Werkstatt";
        aCARWAY_Model_Service_StructRepair.m_sPathIcon = "assets/icons/icoGarage.png"
        aCARWAY_Model_Service_StructRepair.m_bDeletable = false;

        let aCARWAY_Model_Service_Struct_Item_Select =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.SELECT);
        aCARWAY_Model_Service_Struct_Item_Select.m_ServiceStructTitle = "Wieso warst du in der Werkstatt?";
        aCARWAY_Model_Service_Struct_Item_Select.m_ServiceStructPlaceholder = "Ungeplante Inspektion","Schaden";
        aCARWAY_Model_Service_StructRepair.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_Select);
        
        let aCARWAY_Model_Service_Struct_Item_Text =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.TEXT);
        aCARWAY_Model_Service_Struct_Item_Text.m_ServiceStructTitle = "Bei welchen Kilometerstand?";
        aCARWAY_Model_Service_Struct_Item_Text.m_ServiceStructPlaceholder = "Hier Kilometerstand eingeben";
        aCARWAY_Model_Service_StructRepair.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_Text);
        
        let aCARWAY_Model_Service_Struct_Item_Location =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.LOCATION);
        aCARWAY_Model_Service_Struct_Item_Location.m_ServiceStructTitle = "Wo warst du in der Werkstatt?";
        aCARWAY_Model_Service_Struct_Item_Location.m_ServiceStructPlaceholder = "Hier den Ort der Werkstatt eingeben";
        aCARWAY_Model_Service_StructRepair.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_Location);
        
        let aCARWAY_Model_Service_Struct_Item_TimeVon =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.TIME);
        aCARWAY_Model_Service_Struct_Item_TimeVon.m_ServiceStructTitle = "Von wann warst du in der Werkstatt?";
        aCARWAY_Model_Service_Struct_Item_TimeVon.m_ServiceStructPlaceholder = "";
        aCARWAY_Model_Service_StructRepair.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_TimeVon);

        let aCARWAY_Model_Service_Struct_Item_TimeBis =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.TIME);
        aCARWAY_Model_Service_Struct_Item_TimeBis.m_ServiceStructTitle = "Bis wann warst du in der Werkstatt?";
        aCARWAY_Model_Service_Struct_Item_TimeBis.m_ServiceStructPlaceholder = "";
        aCARWAY_Model_Service_StructRepair.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_TimeBis);

        let aCARWAY_Model_Service_Struct_Item_Costs =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.COSTS);
        aCARWAY_Model_Service_Struct_Item_Costs.m_ServiceStructTitle = "Was hat die Werkstatt gekostet?";
        aCARWAY_Model_Service_Struct_Item_Costs.m_ServiceStructPlaceholder = "";
        aCARWAY_Model_Service_StructRepair.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_Costs);

        let aCARWAY_Model_Service_Struct_Item_Text_Kommentar =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.TEXT);
        aCARWAY_Model_Service_Struct_Item_Text_Kommentar.m_ServiceStructTitle = "Beliebiger Kommentar?";
        aCARWAY_Model_Service_Struct_Item_Text_Kommentar.m_ServiceStructPlaceholder = "Hier Kommentar eingeben";
        aCARWAY_Model_Service_StructRepair.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_Text_Kommentar);

        this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct.push(aCARWAY_Model_Service_StructRepair);
    }

    private insertDefaultServiceStructCleanpark()
    {
        let aCARWAY_Model_Service_StructCleanpark:CARWAY_Model_Service_Struct = new CARWAY_Model_Service_Struct();
        aCARWAY_Model_Service_StructCleanpark.m_ServiceStructTitle = "Waschanlage";
        aCARWAY_Model_Service_StructCleanpark.m_sPathIcon = "assets/icons/icoCleanpark.png"
        aCARWAY_Model_Service_StructCleanpark.m_bDeletable = false;

        let aCARWAY_Model_Service_Struct_Item_Location =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.LOCATION);
        aCARWAY_Model_Service_Struct_Item_Location.m_ServiceStructTitle = "Wo warst du in der Waschanlage?";
        aCARWAY_Model_Service_Struct_Item_Location.m_ServiceStructPlaceholder = "Ort der Waschanlage eingeben";
        aCARWAY_Model_Service_StructCleanpark.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_Location);
     
        let aCARWAY_Model_Service_Struct_Item_TimeVon =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.TIME);
        aCARWAY_Model_Service_Struct_Item_TimeVon.m_ServiceStructTitle = "Von wann warst du in der Waschanalge?";
        aCARWAY_Model_Service_Struct_Item_TimeVon.m_ServiceStructPlaceholder = "";
        aCARWAY_Model_Service_StructCleanpark.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_TimeVon);

        let aCARWAY_Model_Service_Struct_Item_TimeBis =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.TIME);
        aCARWAY_Model_Service_Struct_Item_TimeBis.m_ServiceStructTitle = "Bis wann warst du in der Waschanalge?";
        aCARWAY_Model_Service_Struct_Item_TimeBis.m_ServiceStructPlaceholder = "";
        aCARWAY_Model_Service_StructCleanpark.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_TimeBis);

        let aCARWAY_Model_Service_Struct_Item_Costs =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.COSTS);
        aCARWAY_Model_Service_Struct_Item_Costs.m_ServiceStructTitle = "Was hat die Waschanlage gekostet?";
        aCARWAY_Model_Service_Struct_Item_Costs.m_ServiceStructPlaceholder = "";
        aCARWAY_Model_Service_StructCleanpark.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_Costs);
        
        let aCARWAY_Model_Service_Struct_Item_Text =  new CARWAY_Model_Service_Struct_Item(CARWAY_WIZARD_OBJECT.TEXT);
        aCARWAY_Model_Service_Struct_Item_Text.m_ServiceStructTitle = "Beliebiger Kommentar?";
        aCARWAY_Model_Service_Struct_Item_Text.m_ServiceStructPlaceholder = "Hier Kommentar eingeben";
        aCARWAY_Model_Service_StructCleanpark.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_Text);
        
        this.m_CarwayModelServiceStructProvider.m_Array_CARWAY_Model_Service_Struct.push(aCARWAY_Model_Service_StructCleanpark);
    }

    private watchNetworkEnabled()
    {
        this.m_NetworkConnectSubscription = this.network.onConnect().subscribe(() => 
        {
            this.m_CARWAY_Log_Provider.add("watchNetworkEnabled"," Network was connected");
            
            this.m_alertNetwork.dismiss(); 

            setTimeout(() => 
            {
                if (this.network.type === 'wifi') 
                {
                    this.m_CARWAY_Log_Provider.add("watchNetworkEnabled"," Network connect WIFI");
                }
              }, 3000);
        });

        this.m_NetworkDisconnectSubscription = this.network.onDisconnect().subscribe(() => 
        {
            this.m_CARWAY_Log_Provider.add("watchNetworkEnabled"," Network was disconnected");
            
           this.askForNetwork(false);
        });
    }

    private askForNetwork(bLoadModel:boolean)
    {
        this.m_bAlertNetwork = true;

        if(this.m_bAlertGPSActive)
        {
            setTimeout(()=>
            {
                this.askForNetwork(bLoadModel)
            }
            ,1000);
        }

        this.m_alertNetwork = this.m_AlertController.create(
        {
            title: 'Internetverbindung',
            message: "Sie haben derzeit keine Internetverbindung. Bitte aktivieren Sie Ihre mobilen Daten",
            buttons : 
            [
                {
                    text: "Internetverbindung erneut prüfen",
                    handler: data => 
                    {
                        setTimeout(() => 
                        {
                            if(this.network.type == "none")
                            {
                                this.askForNetwork(bLoadModel);
                            }
                            else
                            {
                                if(bLoadModel)
                                {
                                    this.m_CARWAY_Log_Provider.add("loadData a1","loadData2");
                                    this.loadData();
                                }
                            }
                        }, 3000);
                    }
                }
                ,
                {
                    text: "Ohne Internetverbindung fortfahren [GESPERRT]",
                    handler: data => 
                    {
                        return;
                    }
                }
            ]
        });
        
        this.m_alertNetwork.present();
    }

    private subscribeEvents()
    {
        this.m_Events.subscribe('search:delete', (data) => 
        { 
            this.m_ArraySearchResults = null;
        });
    }

    private getSearchItemText(): any[] 
    {
        this.m_sArrayTitles = [];
        this.m_sArrayIndexDay = [];
        
        for (let i=0 ; i<this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day.length ; i++)
        {
            if(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[i].m_arrayCARWAY_Model_Track_Single)
            {
                for (let track of this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[i].m_arrayCARWAY_Model_Track_Single)
                {
                    this.m_sArrayTitles.push({Title:track.m_sTitle,Date:CARWAY_Util_Date.getTextFromDate(CARWAY_Util_Date.getDateTimeFromKey(this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day[i].m_nTrackDayKey,CARWAY_KEY_TYPE.DATE),true)});
                    this.m_sArrayIndexDay.push(i);
                }
            }
        }
      return this.m_sArrayTitles;
    }

    private changeDate(aDay)
    {
        let nDayKey:number = GlobalConstants.NOT_SET;

        if(!aDay)
        {
            // Today
            nDayKey = Number(CARWAY_Util_Date.getKeyFromDate(new Date(),CARWAY_KEY_TYPE.DATE));
        }
        else
        {
            nDayKey = Number(aDay.year+CARWAY_Util_Date.convertMonthToKey(aDay.month)+CARWAY_Util_Date.convertDayToKey(aDay.day));
        }
     
        let nDayIndex = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day.findIndex(item=> item &&  item.m_nTrackDayKey==nDayKey);
     
        if(nDayIndex==-1)
        {
            // Neuen Day + Yesterday + Tomorrow erstellen 
            this.m_CARWAY_DayTrack_Provider.m_bindArrayShowTracks = this.m_CARWAY_DayTrack_Provider.getCARWAYModelDayArray(nDayKey,1);
            this.m_CARWAY_DayTrack_Provider.m_nActDayIndex = this.m_CARWAY_DayTrack_Provider.m_CARWAY_Model.m_arrayCARWAY_Model_Day.findIndex(item=> item && item.m_nTrackDayKey==nDayKey);
        }
        else
        {
            this.m_CARWAY_DayTrack_Provider.m_nActDayIndex = nDayIndex;
        }
     
        console.log("changeDate: send "+ this.m_CARWAY_DayTrack_Provider.m_nActDayIndex);

        this.m_Events.publish('search:new', true);
    }

    private reloadPosition()
    {
        this.m_CARWAY_LocationTracker_Provider.getPosition(true)
        .then
        (
            (resolvePosition:CARWAY_Geoposition) =>
            {
                if(resolvePosition)
                {
                    this.m_Events.publish("newPosition");
                }
            }
        )
    }

    // EVENT HANDLER
    private eventShowSearchResult(searchItem)
    {
        let nIndex:number =  this.m_sArrayTitles.findIndex(item=> item && item==searchItem);
     
        this.m_CARWAY_DayTrack_Provider.m_nActDayIndex = this.m_sArrayIndexDay[nIndex];
     
        this.m_Events.publish('search:new', true);
    }

    private eventSearchOpen()
    {
        this.m_bindShowSearchbar = !this.m_bindShowSearchbar;
        
        this.m_Events.publish("search:open",this.m_bindShowSearchbar);
    }

    private eventClickedOpenLog()
    {
        this.navCtrl.push("LogPage");        
    }

    private eventClickedOpenSettings()
    {
        this.navCtrl.push("SettingsPage");
    }

    private eventInputSearchItem(ev: any) 
    {
        this.m_ArraySearchResults = this.getSearchItemText();

        let val = ev.target.value;

        if (val && val.trim() != '') 
        {
            this.m_ArraySearchResults = this.m_ArraySearchResults.filter((item) => 
            {
                return (item.Title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
            
            this.m_bShowSearchList = true;
        } 
        else 
        {
            this.m_bShowSearchList = false;
        }
    }
    
    private clickedToggleTracking()
    {
        this.m_bTrackingActive = !this.m_bTrackingActive;

        if(this.m_bTrackingActive)
        {
            this.m_CARWAY_Track_Service.startTracking(this.m_CARWAY_DayTrack_Provider.m_nActDayIndex);
            
            CARWAY_Util_Text.showMessage(this.m_ToastController,"Ihre Route wird aufgezeichnet");
        }
        else
        {
            this.m_CARWAY_Track_Service.stopTracking();

            CARWAY_Util_Text.showMessage(this.m_ToastController,"Ihre Route wurde gespeichert");
        }
    }

    eventClickedTitle()
    {
        this.m_bShowDateSelector = !this.m_bShowDateSelector;
    }
}