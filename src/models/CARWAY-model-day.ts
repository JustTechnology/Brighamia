import { CARWAY_Model_Track_Single } from "./CARWAY-model-track-single";
import { CARWAY_Model_Service } from "./CARWAY-model-service";

export class CARWAY_Model_Day
{   
    public m_nTrackDayKey:number = -1;
    public m_dDate:Date = null;
    public m_sTitle:string = "";
    public m_sSubtitle:string = "";
    public m_bSavedFlag = true;
    public m_arrayCARWAY_Model_Track_Single:Array<CARWAY_Model_Track_Single> = null;;
    public m_arrayCARWAY_Model_Service:Array<CARWAY_Model_Service> = null;
    
    public m_nIndexNextCARWAYModelDay:number = 0;
    public m_nIndexPreviousCARWAYModelDay:number = 0;

    constructor()
    {
        console.log("construct CARWAY_Model_Day");
	}
}