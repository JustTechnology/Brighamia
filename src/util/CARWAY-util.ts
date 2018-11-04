import { CARWAY_Model_Service_Struct } from "../models/CARWAY-model-service-struct";
import { CARWAY_Model_Service_Item } from "../models/CARWAY-model-service-item";
import { CARWAY_Model_Service } from "../models/CARWAY-model-service";
import { CARWAY_WIZARD_OBJECT } from "../providers/constants-provider";
import { CARWAY_Model_Service_Item_Text } from "../models/CARWAY-model-service-item-text";
import { CARWAY_Model_Service_Item_Time } from "../models/CARWAY-model-service-item-time";
import { CARWAY_Model_Service_Item_Location } from "../models/CARWAY-model-service-item-location";
import { CARWAY_Model_Service_Item_Array_Costs } from "../models/CARWAY-model-service-item-array-costs";
import { CARWAY_Model_Service_Item_Select } from "../models/CARWAY-model-service-item-select";
import { CARWAY_Model_Service_Item_Costs } from "../models/CARWAY-model-service-item-costs";

export class CARWAY_Util
{
    public static convertServiceStructToServiceItemArray(aCARWAY_Model_Service_Struct:CARWAY_Model_Service_Struct) : CARWAY_Model_Service
    {
        let aCARWAY_Model_Service:CARWAY_Model_Service = new CARWAY_Model_Service(aCARWAY_Model_Service_Struct.m_ServiceStructTitle);

		aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item ? 1 : aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item = new Array<CARWAY_Model_Service_Item>(); 

		aCARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem.forEach(aCarwayModelServiceStructItem => 
		{
			switch(aCarwayModelServiceStructItem.m_Type)
			{
				case CARWAY_WIZARD_OBJECT.TEXT:
					aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Text(aCarwayModelServiceStructItem.m_ServiceStructTitle, aCarwayModelServiceStructItem.m_ServiceStructText, aCarwayModelServiceStructItem.m_ServiceStructPlaceholder));
					break;
				
				case CARWAY_WIZARD_OBJECT.TIME:
					aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Time(aCarwayModelServiceStructItem.m_ServiceStructTitle, aCarwayModelServiceStructItem.m_ServiceStructText, aCarwayModelServiceStructItem.m_ServiceStructPlaceholder));
					break;

				case CARWAY_WIZARD_OBJECT.LOCATION:
					aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Location(aCarwayModelServiceStructItem.m_ServiceStructTitle, aCarwayModelServiceStructItem.m_ServiceStructText, aCarwayModelServiceStructItem.m_ServiceStructPlaceholder));
					break;

				case CARWAY_WIZARD_OBJECT.COSTS:
					aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Array_Costs(aCarwayModelServiceStructItem.m_ServiceStructTitle,aCarwayModelServiceStructItem.m_ServiceStructPlaceholder,aCarwayModelServiceStructItem.m_ServiceStructText, new CARWAY_Model_Service_Item_Costs("")));
					break;

				case CARWAY_WIZARD_OBJECT.SELECT:
                    aCARWAY_Model_Service.m_arrayCARWAY_Model_Service_Item.push(new CARWAY_Model_Service_Item_Select(aCarwayModelServiceStructItem.m_ServiceStructTitle, aCarwayModelServiceStructItem.m_ServiceStructText,"",aCarwayModelServiceStructItem.m_ServiceStructPlaceholder.split(",")));
                    break;
				}
		});

        return aCARWAY_Model_Service;
	}
}