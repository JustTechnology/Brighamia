import { CARWAY_Model_Service_Item } from "./CARWAY-model-service-item";
import { CARWAY_Model_Service_Item_Costs } from "./CARWAY-model-service-item-costs";
import { CARWAY_Model_Currency } from "./CARWAY-model-currency";
import { CARWAY_WIZARD_OBJECT } from "../providers/constants-provider";


export class CARWAY_Model_Service_Item_Array_Costs extends CARWAY_Model_Service_Item
{ 
    public m_Array_CARWAY_Model_Service_Item_Costs?:Array<CARWAY_Model_Service_Item_Costs> = new Array<CARWAY_Model_Service_Item_Costs>();
    public m_oTotal:CARWAY_Model_Currency = new CARWAY_Model_Currency();
    
    constructor(sTitle:string,sPlaceholder:string,sText:string,aCARWAY_Model_Service_Item_Costs:CARWAY_Model_Service_Item_Costs)
    {
        super(CARWAY_WIZARD_OBJECT.COSTS,sTitle,sText,sPlaceholder);

        this.m_Array_CARWAY_Model_Service_Item_Costs.push(aCARWAY_Model_Service_Item_Costs);
        
        this.m_oTotal.m_sEuro = "0";
        this.m_oTotal.m_sCent = "00";
        
        console.log("construct CARWAY_Model_Service_Item_Array_Costs");
    }
}