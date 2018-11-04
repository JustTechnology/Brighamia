import { CARWAY_Util_Date } from '../util/CARWAY-util-date';
import { CARWAY_Model_Service_Item } from "./CARWAY-model-service-item";
import { CARWAY_WIZARD_OBJECT, CARWAY_TIME_PARTS } from "../providers/constants-provider";

export class CARWAY_Model_Service_Item_Time extends CARWAY_Model_Service_Item
{
    public m_sPlaceholderHour:string = "";
    public m_sPlaceholderMinute:string = "";
 
    public m_sTextHour:string = "";
    public m_sTextMinute:string = "";
    
    public m_sTime:string = "";

    constructor(sTitle:string,sText:string,sPlaceholder:string)
    {
        super(CARWAY_WIZARD_OBJECT.TIME,sTitle,sText,sPlaceholder);
    
        if(this.m_sPlaceholder)
        {
            this.m_sPlaceholderHour = CARWAY_Util_Date.getTimePart(sPlaceholder,CARWAY_TIME_PARTS.HOUR);
            this.m_sPlaceholderMinute = CARWAY_Util_Date.getTimePart(sPlaceholder,CARWAY_TIME_PARTS.MINUTE);
        }

        if(this.m_sText)
        {
            console.log("TIME_PART:"+this.m_sText);
            this.m_sTextHour = CARWAY_Util_Date.getTimePart(sText,CARWAY_TIME_PARTS.HOUR);
            this.m_sTextMinute = CARWAY_Util_Date.getTimePart(sText,CARWAY_TIME_PARTS.MINUTE);
        }
        
        console.log("construct CARWAY_Model_Service_Item_Text");
    }
}