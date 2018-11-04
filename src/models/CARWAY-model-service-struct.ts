import { CARWAY_Model_Service } from './CARWAY-model-service';
import { CARWAY_WIZARD_OBJECT } from '../providers/constants-provider';
import { CARWAY_Model_Service_Struct_Item } from './CARWAY-model-service-struct-item';

export class CARWAY_Model_Service_Struct
{
    public m_ServiceStructTitle:string = "";
    public m_bDeletable:boolean = true;
    public m_sPathIcon:string = "/assets/icons/icoStar.png";

    public m_ArrayCarwayModelServiceStructItem:Array<CARWAY_Model_Service_Struct_Item> = new Array<CARWAY_Model_Service_Struct_Item>();
    
    constructor()
    {
        console.log("construct CARWAY_Model_Service_Struct");
    }
} 