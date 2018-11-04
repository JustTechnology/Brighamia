import { CARWAY_Util_Date } from '../util/CARWAY-util-date';
import { Injectable } from '@angular/core';

@Injectable()
export class CARWAY_Date_Provider 
{
    public getArrayNeighbourDates(date:Date, count:number): Array<Date> 
    {
 		let aArrayDays = new Array<Date>();
		
		for(let i=count; i>=-count ; i--)
		{
			aArrayDays.push(CARWAY_Util_Date.addDaysToDate(date,-i));
		}
    
        return aArrayDays;
    }


  	constructor() 
  	{
    	console.log('contruct CARWAY_Date_Provider');
  	}


    getActTime(date:Date)
    {
        let sTime = '';

        sTime = date.getHours()+":"+date.getMinutes();
        
        return sTime;
    }
 }
