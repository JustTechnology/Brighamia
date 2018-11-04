import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { storage } from 'firebase';
import { CARWAY_Log_Provider } from './CARWAY-log-provider';
import { GlobalConstants } from './constants-provider';
import { CARWAY_Model_Car } from '../models/CARWAY-model-car';

@Injectable()
export class CARWAY_Model_Car_Provider
{
    public m_CARWAY_Model_Car:CARWAY_Model_Car = new CARWAY_Model_Car();
    public m_sSignFromStorage:string = "";

    constructor
        (
            public angularFireDatabase:AngularFireDatabase,
            private m_CARWAY_Log_Provider:CARWAY_Log_Provider
        ) 
    {
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider","construct CARWAY_Model_Car_Provider");
        
        // Initialisieren
        this.m_CARWAY_Model_Car.m_sPictureURL = GlobalConstants.CARWAY_baseURL_Example_Car;
    }

    public read(sSign:string)
    {
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`read(${sSign})`);

        return this.angularFireDatabase
        .object(`${GlobalConstants.CARWAY_baseURL_Signs}/${sSign}/`)
        .valueChanges()
        .take(1)
        .subscribe((aCARWAY_Model_Car) => 
		{
			if(aCARWAY_Model_Car)
			{
				this.m_CARWAY_Model_Car = aCARWAY_Model_Car as CARWAY_Model_Car;
                
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider::readCarModel","Model erfolgreich gelesen: aCARWAYModel_Car:"+JSON.stringify(aCARWAY_Model_Car));
			}
			else
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_DayTrack_Provider::readCarModel","Kein Model vorhanden!");
			}
		});
    }


    public save()
    {
        return this.angularFireDatabase
        .object(`${GlobalConstants.CARWAY_baseURL_Signs}/${this.m_CARWAY_Model_Car.m_sCarID}/`)
        .set(this.m_CARWAY_Model_Car)
        .then((resolve) => 
        {
            this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider","KFZ erfolgreich gespeichert! Key:"+resolve);
        }
        , 
        (reject) =>
        {
            this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider","KFZ konnte nicht gespeichert werden! reject:"+reject);
        });
    }

        
    public updateCarBezeichnung(index:number)
    {
        console.log("updateCarBezeichnung");

        if(this.m_CARWAY_Model_Car.m_sCarID)
        {
            let path:string = `${GlobalConstants.CARWAY_baseURL_Signs}/${this.m_CARWAY_Model_Car.m_sCarID}/m_sCarName`;
            let carname:string =this.m_CARWAY_Model_Car.m_sCarName;
            this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`updateCarBezeichnung(${this.m_CARWAY_Model_Car.m_sCarName})`);
    
            return this.angularFireDatabase
            .object(path)
            .set(carname)
            .catch(error =>
            {
                this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider","updateCarBezeichnung(=>) error"+error);
            })
            .then((data) =>
            {
                this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider","updateCarBezeichnung(=>) success");
            });
        }
    }
    
    public getCarIDTextByIndex(index:number)
    {
        return this.getCarIDTextByString(this.m_CARWAY_Model_Car.m_sCarID);
    }

    public getCarIDTextByString(aString:string)
    {
        let indexArray1 = aString.indexOf( "-" ); 
        let indexArray2 = aString.indexOf( "_" ); 
        
        let KFZ1 = aString.substring(0,indexArray1);
        let KFZ2 = aString.substring(indexArray1+1,indexArray2);
        let KFZ3 = aString.substring(indexArray2+1,aString.length);

        return KFZ1.toUpperCase() + "-" + KFZ2.toUpperCase() + " " +KFZ3;
    }
    
    public exists(sCarID:string)
    {
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`exists(${sCarID})`);
        return this.angularFireDatabase
        .object(`${GlobalConstants.CARWAY_baseURL_Signs}/${sCarID}`)
        .valueChanges()
        .take(1);
    }
  
    public getUserPicture(index:number)
    {
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`getUserPicture(${this.m_CARWAY_Model_Car.m_sCarID})`);
        
        let pictureURL = '';
        
        const pictures = storage().ref(`${GlobalConstants.CARWAY_baseURL_Signs}/${this.m_CARWAY_Model_Car.m_sCarID}/picture/`);
    
        pictures.getDownloadURL().then((url) => 
        {
            pictureURL = url;
            this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider","getUserPicture(=>):PictureAvailable:"+pictureURL);
        })
        .catch(function(error)
        {
            this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider","getUserPicture(=>):NoPictureAvailable:"+error);
        });
  
        return pictureURL;
    }
  
    public saveUserCarPicture(index:number,userPicture:string)
    {
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`setUserPicture(${userPicture})`);
    
        const pictures = storage().ref(`${GlobalConstants.CARWAY_baseURL_Signs}/${this.m_CARWAY_Model_Car.m_sCarID}/Car/`);
        pictures.putString(userPicture, 'data_url'); 
    }

    public getKFZFabrikat()
    {
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider","getKFZFabrikat(=>)");
        
        return this.angularFireDatabase.list(GlobalConstants.CARWAY_baseURL_KFZ_FABRIKAT); 
    }

    public getKFZModell(fabrikat:string)
    {
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`getKFZModell(${fabrikat})`);
        return this.angularFireDatabase.list(GlobalConstants.CARWAY_baseURL_KFZ_MODELL, ref => ref.orderByChild('/id_car_make').equalTo(fabrikat));
    }

    public getKFZGeneration(modell:string)
    {
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`getKFZGeneration(${modell})`);
        return this.angularFireDatabase.list(GlobalConstants.CARWAY_baseURL_KFZ_GENERATION, ref => ref.orderByChild('/id_car_model').equalTo(modell));
    }

    public getKFZMotorisierung(modell:string)
    {
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`getKFZMotorisierung(${modell})`);
        return this.angularFireDatabase.list(GlobalConstants.CARWAY_baseURL_KFZ_MOTORISIERUNG, ref => ref.orderByChild('/id_car_model').equalTo(modell));
    }
}