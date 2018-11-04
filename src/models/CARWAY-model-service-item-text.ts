import { CARWAY_Model_Service_Item } from "./CARWAY-model-service-item";
import { CARWAY_WIZARD_OBJECT } from "../providers/constants-provider";

export class CARWAY_Model_Service_Item_Text extends CARWAY_Model_Service_Item
{
    constructor(sTitle:string,sText:string,sPlaceholder:string)
    {
        super(CARWAY_WIZARD_OBJECT.TEXT,sTitle,sText,sPlaceholder);
        
        console.log("construct CARWAY_Model_Service_Item_Text");
    }
}