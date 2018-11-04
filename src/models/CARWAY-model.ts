import { CARWAY_Model_Day } from "./CARWAY-model-day";

export class CARWAY_Model
{   
    public m_sTrackCarKey:string = "";
    public m_sCarID:string = "";
    
    public m_arrayCARWAY_Model_Day:Array<CARWAY_Model_Day>;
    
    constructor()
    {
        console.log("construct CARWAY_Model");
    }
}