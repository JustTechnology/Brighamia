import { CARWAY_Model } from "../models/CARWAY-model";
import { CARWAY_KEY_TYPE } from "../providers/constants-provider";
import { CARWAY_Util_Date } from "./CARWAY-util-date";
import { CARWAY_Model_Day } from "../models/CARWAY-model-day";
import { CARWAY_Util_Currency } from "./CARWAY-util-currency";

declare var google: any;

export class CARWAY_Util_Route
{
    public static calculateDistanceAndDurationRoute(cStart:Coordinates,cZiel:Coordinates) : any
    {
      	const service = new google.maps.DistanceMatrixService();
      
		return new Promise((resolve, reject) => 
		{
			if(cStart.latitude != -1 && cZiel.latitude != -1)
			{
				service.getDistanceMatrix(
					{
					  origins: [new google.maps.LatLng(cStart.latitude,cStart.longitude)],
					  destinations: [new google.maps.LatLng(cZiel.latitude,cZiel.longitude)],
					  travelMode: 'DRIVING'
				  }
				  , 
				  (response, status) => 
				  {
					  if(status === 'OK') 
					  {
							resolve({ result: response.rows[0].elements[0]});
					  } 
					  else 
					  {
							reject();
					  }
					});
			}
			else
			{
				reject();
			}
		});
    }
 
    public static async sumDistanceAllAsync(aCARWAY_Model:CARWAY_Model,bOnlyDrivenKm:boolean)
    {
          return await CARWAY_Util_Currency.convertDotToComma((Math.round((this.sumDistanceAll(aCARWAY_Model,bOnlyDrivenKm)/1000)*100))/100);
    }
      
	public static sumDistanceAll(aCARWAY_Model:CARWAY_Model,bOnlyDrivenKm:boolean) : number
	{ 
		let nSumDistanceAll:number = 0;
		
		if(aCARWAY_Model.m_arrayCARWAY_Model_Day)
		{
			aCARWAY_Model.m_arrayCARWAY_Model_Day.forEach(day => 
			{
				if(day)
				{
					nSumDistanceAll += CARWAY_Util_Date.round(this.sumDistanceDay(day,bOnlyDrivenKm),1);
				}
			});
		}

		console.log("nSumDistanceAll:"+nSumDistanceAll);

		return nSumDistanceAll;
	}
 
	public static async sumDurationAllSecondsAsync(aCARWAY_Model:CARWAY_Model,bOnlyDrivenDuration=false)
    {
		return await CARWAY_Util_Date.convertSecondsToTitleTime(this.sumDurationAllSeconds(aCARWAY_Model,bOnlyDrivenDuration));
	}
      
	public static sumDurationAllSeconds(aCARWAY_Model:CARWAY_Model,bOnlyDrivenDuration:boolean) : number
	{ 
		let nSumDurationAll:number = 0;
		
		if(aCARWAY_Model.m_arrayCARWAY_Model_Day)
		{
			aCARWAY_Model.m_arrayCARWAY_Model_Day.forEach(day => 
			{
				if(day)
				{
					nSumDurationAll += this.sumDurationDaySeconds(day,bOnlyDrivenDuration);
				}
			});
		}

		console.log("sumDurationAll ENDE:"+nSumDurationAll);
		return nSumDurationAll;
	}
 
	public static async sumDistanceWeekAsync(aCARWAY_Model:CARWAY_Model,aDate:Date,bOnlyDrivenKm:boolean)
	{
		return await CARWAY_Util_Currency.convertDotToComma((Math.round((this.sumDistanceWeek(aCARWAY_Model,aDate,bOnlyDrivenKm)/1000)*100))/100);
	}
  
	public static sumDistanceWeek(aCARWAY_Model:CARWAY_Model,aDate:Date,bOnlyDrivenKm:boolean) : number
	{ 
		let nSumDistanceWeek:number = 0;
		
		let aMondayDate:Date =  CARWAY_Util_Date.getMonday(aDate);

		for(let i=0 ; i<6 ; i++)
		{
			let aDayKey = CARWAY_Util_Date.getKeyFromDate(CARWAY_Util_Date.addDaysToDate(aMondayDate,i),CARWAY_KEY_TYPE.DATE);
			let aDayIndex = aCARWAY_Model.m_arrayCARWAY_Model_Day.findIndex(item=> item && item.m_nTrackDayKey==aDayKey);
		
			if(aCARWAY_Model.m_arrayCARWAY_Model_Day[aDayIndex])
			{
				nSumDistanceWeek += CARWAY_Util_Date.round(this.sumDistanceDay(aCARWAY_Model.m_arrayCARWAY_Model_Day[aDayIndex],bOnlyDrivenKm),1);
			}
		}

		console.log("nSumDistanceWeek:"+nSumDistanceWeek);
		
		return nSumDistanceWeek;
	}

	public static async sumDurationWeekSecondsAsync(aCARWAY_Model:CARWAY_Model,aDate:Date,bOnlyDrivenDuration:boolean=false)
	{
		return await CARWAY_Util_Date.convertSecondsToTitleTime(this.sumDurationWeekSeconds(aCARWAY_Model,aDate,bOnlyDrivenDuration));
	}
  
	public static sumDurationWeekSeconds(aCARWAY_Model:CARWAY_Model,aDate:Date,bOnlyDrivenDuration:boolean) : number
	{ 
		let nSumDurationWeek:number = 0;
		
		let aMondayDate:Date =  CARWAY_Util_Date.getMonday(aDate);

		for(let i=0 ; i<=6 ; i++)
		{
			let aDayKey = CARWAY_Util_Date.getKeyFromDate(CARWAY_Util_Date.addDaysToDate(aMondayDate,i),CARWAY_KEY_TYPE.DATE);
			let aDayIndex = aCARWAY_Model.m_arrayCARWAY_Model_Day.findIndex(item=> item && item.m_nTrackDayKey==aDayKey);
		
			if(aCARWAY_Model.m_arrayCARWAY_Model_Day[aDayIndex])
			{
				nSumDurationWeek = nSumDurationWeek + this.sumDurationDaySeconds(aCARWAY_Model.m_arrayCARWAY_Model_Day[aDayIndex],bOnlyDrivenDuration);
				console.log("sumDurationWeek "+nSumDurationWeek);
			}
		}
		
		console.log("sumDurationWeek ENDE:"+nSumDurationWeek);
		
		return nSumDurationWeek;
	}

	public static async sumDistanceDayAsync(aCARWAY_Model_Day:CARWAY_Model_Day,bOnlyDriveKm:boolean)
	{
		return await CARWAY_Util_Currency.convertDotToComma((Math.round((this.sumDistanceDay(aCARWAY_Model_Day,bOnlyDriveKm)/1000)*100))/100);
	}
	
	public static sumDistanceDay(aCARWAY_Model_Day:CARWAY_Model_Day,bOnlyDriveKm:boolean) : number
	{
		let nSumDistanceDay:number = 0;

		if(aCARWAY_Model_Day.m_arrayCARWAY_Model_Track_Single)
		{
			aCARWAY_Model_Day.m_arrayCARWAY_Model_Track_Single.forEach(track => 
			{
				if(track)
				{
					if(bOnlyDriveKm)
					{
						nSumDistanceDay += track.m_nDistanceDrivenMeter;
					}
					else
					{
						nSumDistanceDay += track.m_nDistanceAllMeter;
					}
				}
			});
		}

		console.log("nSumDistanceDay:"+nSumDistanceDay);

		return nSumDistanceDay;
	}

	public static async sumDurationDaySecondsAsync(aCARWAY_Model_Day:CARWAY_Model_Day,bOnlyDrivenDuration=false)
	{
		return await CARWAY_Util_Date.convertSecondsToTitleTime(this.sumDurationDaySeconds(aCARWAY_Model_Day,bOnlyDrivenDuration));
	}
	
	public static sumDurationDaySeconds(aCARWAY_Model_Day:CARWAY_Model_Day,bOnlyDrivenDuration:boolean) : number
	{
		let nSumDurationDay:number = 0;
	
		if(aCARWAY_Model_Day.m_arrayCARWAY_Model_Track_Single)
		{
			aCARWAY_Model_Day.m_arrayCARWAY_Model_Track_Single.forEach(track => 
			{
				if(track)
				{
					if(bOnlyDrivenDuration)
					{
						if(track.m_nDurationDrivenSeconds>0)
						{
							nSumDurationDay += Number(track.m_nDurationDrivenSeconds); 
						}
					}
					else
					{
						if(track.m_nDurationAllSeconds>0)
						{
							nSumDurationDay += Number(track.m_nDurationAllSeconds);
						}
					}
				}
			});
		}

		return nSumDurationDay;
	}

	public static calculateSetDuration(nDayKeyStart:number,nDayKeyZiel:number) : number 
    {
		if(nDayKeyStart == -1 || nDayKeyZiel == -1)
		{
			return 0;
		}
		
        let dateStart = CARWAY_Util_Date.getDateTimeFromKey(nDayKeyStart,CARWAY_KEY_TYPE.TIME);
        let dateEnde = CARWAY_Util_Date.getDateTimeFromKey(nDayKeyZiel,CARWAY_KEY_TYPE.TIME);
        let dateStartValue:number = dateStart.valueOf(); 
        let dateEndeValue:number = dateEnde.valueOf();

        let intervallMilliseconds:number = dateEndeValue - dateStartValue;

        let intervallSeconds:number = intervallMilliseconds/1000;
                
        let intervallMinutes:number = Math.floor(intervallSeconds/60);

		if(!intervallMinutes)
		{
			intervallMinutes = 0;
		}
		return intervallSeconds;
	}
	
}