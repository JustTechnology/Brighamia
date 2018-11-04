import { CARWAY_Geoposition } from "./CARWAY-model-geoposition";
import { BackgroundGeolocationResponse } from "@ionic-native/background-geolocation";

export class routeSnappedToRoadLatLngPlace
{
    public lat:number =-1;    
    public lng:number =-1;    
    public placeID:number =-1;    
}

export class CARWAY_Model_Track_Single
{
    public m_nTrackKey?:number = -1;

    public m_sTitle?:string = '';
    
    public m_sReport?:string = '';
    public m_sAktionen?:string = '';

    public m_sComment?:string = '';

    public m_bIsPrivate?:boolean = false;    
    public m_bIsDeleted?:boolean = false;
    
    public m_bIsSearchbarFiltered?:boolean = false;
    public m_nDistanceDrivenMeter:number = 0;
    public m_nDistanceMapsMeter:number = 0;
    public m_nDistanceAllMeter:number = 0;

    public m_nDurationDrivenSeconds?:number = 0;
    public m_nDurationSetSeconds?:number = 0;
    public m_nDurationMapSeconds?:number = 0;
    public m_nDurationAllSeconds?:number = 0;

    public m_ArrayBackgroundGeolocationResponse:BackgroundGeolocationResponse[] = null;
    public m_ArrayRouteSnappedToRoadLatLng:routeSnappedToRoadLatLngPlace[] = null;

    constructor(public m_GeopositionStart:CARWAY_Geoposition,public m_GeopositionZiel:CARWAY_Geoposition)
    {
        console.log("construct CARWAY_Model_Track_Single");
    }

    public toString()
    {
        return String(this.m_nTrackKey) + String(this.m_sTitle); 
    }
}