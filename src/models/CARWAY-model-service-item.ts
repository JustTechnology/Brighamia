import { CARWAY_WIZARD_OBJECT } from "../providers/constants-provider";

export class CARWAY_Model_Service_Item 
{
    public m_Type:CARWAY_WIZARD_OBJECT = CARWAY_WIZARD_OBJECT.NOT_SET;
    
    public m_sTitle:string = "";
    public m_sText:string = "";
    public m_sPlaceholder:string = "";
    public m_ArrayPictures:Array<string> = [];

    constructor(type:CARWAY_WIZARD_OBJECT,sTitle:string,sText:string,sPlaceholder:string)
    {  
        this.m_Type = type;
        this.m_sTitle = sTitle;
        this.m_sText = sText;
        this.m_sPlaceholder = sPlaceholder;
        
        console.log("construct CARWAY_Model_Service_Item");
    }
}