import { CARWAY_Model_Service_Struct_Item } from './../models/CARWAY-model-service-struct-item';
import { CARWAY_Geoposition } from "../models/CARWAY-model-geoposition";
import { CARWAY_Util_Date } from "./CARWAY-util-date";
import { CARWAY_Model_Track_Single } from "../models/CARWAY-model-track-single";
import { CARWAY_Model_Service_Struct } from "../models/CARWAY-model-service-struct";
import { CARWAY_Model_Car } from '../models/CARWAY-model-car';

export class CARWAY_Util_Clone
{
public static cloneGeoposition(aCARWAY_Geoposition:CARWAY_Geoposition,bSkipKeys:boolean) : CARWAY_Geoposition
    {
        let aCARWAY_GeopositionClone:CARWAY_Geoposition = new CARWAY_Geoposition();

        aCARWAY_GeopositionClone.coords = 
        {
            latitude:aCARWAY_Geoposition.coords.latitude,
            longitude:aCARWAY_Geoposition.coords.longitude,
            accuracy:aCARWAY_Geoposition.coords.accuracy,
            altitude:aCARWAY_Geoposition.coords.altitude,
            altitudeAccuracy:aCARWAY_Geoposition.coords.altitudeAccuracy,
            heading:aCARWAY_Geoposition.coords.heading,
            speed:aCARWAY_Geoposition.coords.speed
        };

        aCARWAY_GeopositionClone.m_nDateTimeKey = aCARWAY_Geoposition.m_nDateTimeKey;

        aCARWAY_GeopositionClone.timestamp = aCARWAY_Geoposition.timestamp;
        aCARWAY_GeopositionClone.m_sFormattedAddress = CARWAY_Util_Clone.cloneString(aCARWAY_Geoposition.m_sFormattedAddress);
 
        return aCARWAY_GeopositionClone;
    }

    public static cloneCoordinates(aCoordinates: Coordinates) : Coordinates
    {
        return {latitude:aCoordinates.latitude,longitude:aCoordinates.longitude,accuracy:aCoordinates.accuracy,altitude:aCoordinates.altitude,altitudeAccuracy:aCoordinates.altitudeAccuracy,heading:aCoordinates.heading,speed:aCoordinates.speed}
    }

    public static cloneString(aString:string) : string
    {
          return JSON.parse(JSON.stringify(aString));
    }


  public static cloneTrack(aCARWAY_Model_Track_Single:CARWAY_Model_Track_Single) : CARWAY_Model_Track_Single
  {
      let aCARWAY_Model_Track_Single_Clone:CARWAY_Model_Track_Single = new CARWAY_Model_Track_Single(this.cloneGeoposition(aCARWAY_Model_Track_Single.m_GeopositionStart,false),this.cloneGeoposition(aCARWAY_Model_Track_Single.m_GeopositionZiel,false)); 
       
      aCARWAY_Model_Track_Single_Clone.m_sTitle = aCARWAY_Model_Track_Single.m_sTitle;
      aCARWAY_Model_Track_Single_Clone.m_ArrayBackgroundGeolocationResponse = aCARWAY_Model_Track_Single.m_ArrayBackgroundGeolocationResponse; 
      aCARWAY_Model_Track_Single_Clone.m_bIsDeleted = aCARWAY_Model_Track_Single.m_bIsDeleted; 
      aCARWAY_Model_Track_Single_Clone.m_bIsPrivate = aCARWAY_Model_Track_Single.m_bIsPrivate;
      aCARWAY_Model_Track_Single_Clone.m_bIsSearchbarFiltered = aCARWAY_Model_Track_Single.m_bIsSearchbarFiltered;
      aCARWAY_Model_Track_Single_Clone.m_nDistanceDrivenMeter = aCARWAY_Model_Track_Single.m_nDistanceDrivenMeter;
      aCARWAY_Model_Track_Single_Clone.m_nDistanceMapsMeter = aCARWAY_Model_Track_Single.m_nDistanceMapsMeter;
      aCARWAY_Model_Track_Single_Clone.m_nDistanceAllMeter = aCARWAY_Model_Track_Single.m_nDistanceAllMeter;
      aCARWAY_Model_Track_Single_Clone.m_nDurationDrivenSeconds = aCARWAY_Model_Track_Single.m_nDurationDrivenSeconds;
      aCARWAY_Model_Track_Single_Clone.m_nDurationSetSeconds = aCARWAY_Model_Track_Single.m_nDurationSetSeconds;
      aCARWAY_Model_Track_Single_Clone.m_nDurationMapSeconds = aCARWAY_Model_Track_Single.m_nDurationMapSeconds;
      aCARWAY_Model_Track_Single_Clone.m_nDurationAllSeconds = aCARWAY_Model_Track_Single.m_nDurationAllSeconds;
      aCARWAY_Model_Track_Single_Clone.m_nTrackKey = aCARWAY_Model_Track_Single.m_nTrackKey;
      aCARWAY_Model_Track_Single_Clone.m_sAktionen = aCARWAY_Model_Track_Single.m_sAktionen;
      aCARWAY_Model_Track_Single_Clone.m_sComment = aCARWAY_Model_Track_Single.m_sComment;
      aCARWAY_Model_Track_Single_Clone.m_sReport = aCARWAY_Model_Track_Single.m_sReport;
      
      return aCARWAY_Model_Track_Single_Clone;
    }

    public static cloneServiceStruct(aCARWAY_Model_Service_Struct:CARWAY_Model_Service_Struct) : CARWAY_Model_Service_Struct
    {
        let aCARWAY_Model_Service_Struct_Clone:CARWAY_Model_Service_Struct = new CARWAY_Model_Service_Struct();

        aCARWAY_Model_Service_Struct_Clone.m_ServiceStructTitle = aCARWAY_Model_Service_Struct.m_ServiceStructTitle;

        aCARWAY_Model_Service_Struct_Clone.m_ArrayCarwayModelServiceStructItem = new Array<CARWAY_Model_Service_Struct_Item>();
        
        if(aCARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem)
        {
            for(let i=0 ; i<aCARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem.length ; i++)
            {
                let aCARWAY_Model_Service_Struct_Item_Clone:CARWAY_Model_Service_Struct_Item = new CARWAY_Model_Service_Struct_Item(aCARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem[i].m_Type);
    
                aCARWAY_Model_Service_Struct_Item_Clone.m_ServiceStructTitle = aCARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem[i].m_ServiceStructTitle;
                aCARWAY_Model_Service_Struct_Item_Clone.m_ServiceStructText =  aCARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem[i].m_ServiceStructText;
                aCARWAY_Model_Service_Struct_Item_Clone.m_ServiceStructPlaceholder =  aCARWAY_Model_Service_Struct.m_ArrayCarwayModelServiceStructItem[i].m_ServiceStructPlaceholder;
    
                aCARWAY_Model_Service_Struct_Clone.m_ArrayCarwayModelServiceStructItem.push(aCARWAY_Model_Service_Struct_Item_Clone);
            }
        }

        return aCARWAY_Model_Service_Struct_Clone;
    }

    public static cloneCar(aCARWAY_Model_Car:CARWAY_Model_Car) : CARWAY_Model_Car
    {
        let aCARWAY_Model_CarClone:CARWAY_Model_Car = new CARWAY_Model_Car();

        aCARWAY_Model_CarClone.m_sCarID =  aCARWAY_Model_Car.m_sCarID;
        aCARWAY_Model_CarClone.m_sCarName =  aCARWAY_Model_Car.m_sCarName;
        aCARWAY_Model_CarClone.m_sPassword =  aCARWAY_Model_Car.m_sPassword;
        
        if(aCARWAY_Model_Car.m_sArrayFlotte)
        {
            aCARWAY_Model_Car.m_sArrayFlotte.forEach(sFlotte => 
            {
                aCARWAY_Model_CarClone.m_sArrayFlotte.push(sFlotte);    
            });
        }

        return aCARWAY_Model_CarClone;
    }
}    
