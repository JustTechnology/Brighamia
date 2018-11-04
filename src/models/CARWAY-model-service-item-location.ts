import { ListPage } from '../pages/list/list';
import { CARWAY_Model_Service_Item } from "./CARWAY-model-service-item";
import { CARWAY_WIZARD_OBJECT } from "../providers/constants-provider";
import { CARWAY_Geoposition } from './CARWAY-model-geoposition';

export class CARWAY_Model_Service_Item_Location extends CARWAY_Model_Service_Item
{
    public m_CARWAY_Geoposition:CARWAY_Geoposition = null;

    constructor(sTitle:string,sText:string,sPlaceholder:string)
    {
        super(CARWAY_WIZARD_OBJECT.LOCATION,sTitle,sText,sPlaceholder);
        
        console.log("construct CARWAY_Model_Service_Item_Location");
    }
}