import { CARWAY_Geoposition } from './CARWAY-model-geoposition';

export class CARWAY_Model_Settings
{
    public m_nDesiredAccuracy:number =  0;
    public m_nStationaryRadius:number = 20;
    public m_nDistanceFilter:number = 5;
    public m_bDebug:boolean = true;
    public m_nInterval:number = 2000;
    public m_sNotificationTitle:string = "CARWAY";
    public m_sNotificationText:string = "Ihre Fahrt wird aufgezeichnet....";
    public m_bStopOnTerminate:boolean = true;
    public m_bStartOnBoot:boolean = true;
    public m_sNotificationIconColor:string = "#fcd736";    
    public m_Home:CARWAY_Geoposition = null;
    public m_bShowDeleteMessage:boolean = true;
    public m_bShowAlwaysAktPosition:boolean = false;
    public m_nReloadGeolocationInSeconds:number = 10;
    public m_nPositionDetectionAliveCount:number = 30;
    
    constructor()
    {
        console.log("construct CARWAY_Model_User");
    }
}