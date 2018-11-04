import { GlobalConstants } from './../providers/constants-provider';
import { Geoposition } from "@ionic-native/geolocation";
import { CARWAY_Util_Date } from "../util/CARWAY-util-date";
import { LOADING_POSITION_STATE } from "../providers/constants-provider";

export class CARWAY_Geoposition implements Geoposition
{
    public m_sFormattedAddress:string = "";
    public m_nDateTimeKey:number = 0;
    public coords:Coordinates = {latitude:GlobalConstants.NOT_SET,longitude:GlobalConstants.NOT_SET,accuracy:GlobalConstants.NOT_SET,altitude:GlobalConstants.NOT_SET,altitudeAccuracy:GlobalConstants.NOT_SET,heading:GlobalConstants.NOT_SET,speed:GlobalConstants.NOT_SET};
    public timestamp:number = 0;
	public m_LOADING_POSITION_STATE:LOADING_POSITION_STATE = LOADING_POSITION_STATE.NOT_SET; 

    constructor()
    {
        console.log("construct CARWAY_Geoposition");
    }
}