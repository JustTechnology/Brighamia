import { CARWAY_Model_Currency } from "./CARWAY-model-currency";
import { CARWAY_WIZARD_OBJECT } from "../providers/constants-provider";
import { CARWAY_Model_Service_Item } from "./CARWAY-model-service-item";

export class CARWAY_Model_Service_Item_Costs
{ 
    public m_sText:string = "";
    public m_sPlaceholder = "";
    public m_nAmount:string = "";
    public m_oPrice:CARWAY_Model_Currency = new CARWAY_Model_Currency();
    public m_Document?:URL;
    
    constructor(sPlaceholder:string)
    {
        this.m_sPlaceholder = sPlaceholder; 

        console.log("construct CARWAY_Model_Service_Item_Costs");
    }
}