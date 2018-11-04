import { CARWAY_Model_Service_Item } from "./CARWAY-model-service-item";
import { CARWAY_WIZARD_OBJECT } from "../providers/constants-provider";

export class CARWAY_Model_Service_Item_Select extends CARWAY_Model_Service_Item
{
    public m_sArrayText:Array<string> = [];
    
    constructor(sTitle:string,sText:string,sPlaceholder:string,sArrayText:Array<string>)
    {
        super(CARWAY_WIZARD_OBJECT.SELECT,sTitle,sText,sPlaceholder);
        
        this.m_sArrayText = sArrayText;

        console.log("construct CARWAY_Model_Service_Item_Text");
    }
}