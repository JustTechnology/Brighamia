import { CARWAY_Model_Service_Item } from "./CARWAY-model-service-item";
import { CARWAY_Model_Currency } from "./CARWAY-model-currency";


export class CARWAY_Model_Service
{
    public m_arrayCARWAY_Model_Service_Item:Array<CARWAY_Model_Service_Item> = null;
    public m_oPrice:CARWAY_Model_Currency = null; 
    public m_sTitle:string = ""; 

    constructor(sTitle:string)
    {
        this.m_sTitle = sTitle;
        
        console.log("construct CARWAY_Model_Service");
    }

    public toString()
    {
        return this.m_sTitle+" "+this.m_oPrice.m_sEuro+ "."+this.m_oPrice.m_sCent+" €";
    }
}