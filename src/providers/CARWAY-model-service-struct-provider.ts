import { GlobalModelProvider } from './global-model-provider';
import { CARWAY_Model_Service_Struct } from '../models/CARWAY-model-service-struct';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { CARWAY_Log_Provider } from './CARWAY-log-provider';
import { AngularFireDatabase } from 'angularfire2/database';
import { GlobalConstants } from './constants-provider';
import { CARWAY_DayTrack_Provider } from './CARWAY-model-daytrack-provider';
import { CARWAY_Model_Car_Provider } from './CARWAY-model-car-provider';

@Injectable()
export class CarwayModelServiceStructProvider 
{
	public m_Array_CARWAY_Model_Service_Struct:Array<CARWAY_Model_Service_Struct> = new Array<CARWAY_Model_Service_Struct>();	

	constructor(
		private http: Http,
		private m_CARWAY_Model_Car_Provider:CARWAY_Model_Car_Provider,
		private m_CARWAY_Log_Provider:CARWAY_Log_Provider,
		private angularFireDatabase:AngularFireDatabase) 
	{
        
	}

	public saveServiceStructItem(nServiceStructIndex:number)
    {
        return this.angularFireDatabase
            .object(`${GlobalConstants.CARWAY_baseURL_Pool}/${this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID}/${GlobalConstants.CARWAY_baseURL_ServiceStruct}/${nServiceStructIndex-GlobalConstants.CARWAY_COUNT_DEFAULT_SERVICES}`)
            .set(this.m_Array_CARWAY_Model_Service_Struct[nServiceStructIndex])
            .then((resolve) => 
            {
                this.m_CARWAY_Log_Provider.add("CarwayModelServiceStructProvider","Service-Struct erfolgreich gespeichert! Key:"+resolve); 
            }
            , 
            (reject) =>
            {
                this.m_CARWAY_Log_Provider.add("CarwayModelServiceStructProvider","Service-Struct konnte nicht gespeichert werden! reject:"+reject);
            });
    }

    public read(sCarID:string)
    {
        return this.angularFireDatabase
            .object(`${GlobalConstants.CARWAY_baseURL_Pool}/${sCarID}/${GlobalConstants.CARWAY_baseURL_ServiceStruct}/`)
            .valueChanges()
            .take(1);
    }

    public save(sCarID:string)
    {
        return this.angularFireDatabase
            .object(`${GlobalConstants.CARWAY_baseURL_Pool}/${sCarID}/${GlobalConstants.CARWAY_baseURL_ServiceStruct}/`)
            .set(this.m_Array_CARWAY_Model_Service_Struct)
            .then((resolve) => 
            {
                this.m_CARWAY_Log_Provider.add("CarwayModelServiceStructProvider","Service-Struct erfolgreich gespeichert! Key:"+resolve);
            }
            , 
            (reject) =>
            {
                this.m_CARWAY_Log_Provider.add("CarwayModelServiceStructProvider","Service-Struct konnte nicht gespeichert werden! reject:"+reject);
            });
    }

}
