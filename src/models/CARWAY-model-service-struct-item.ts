import { CARWAY_WIZARD_OBJECT } from '../providers/constants-provider';

export class CARWAY_Model_Service_Struct_Item
{
    public m_Type:CARWAY_WIZARD_OBJECT = CARWAY_WIZARD_OBJECT.NOT_SET;
    
    public m_ServiceStructTitle:string = "";
    public m_ServiceStructText:string = "";
    public m_ServiceStructPlaceholder:string = "";

    constructor(aCARWAY_WIZARD_OBJECT:CARWAY_WIZARD_OBJECT)
    {
        this.m_Type = aCARWAY_WIZARD_OBJECT;
        console.log("construct CARWAY_Model_Service_Struct_Item");
    }
}