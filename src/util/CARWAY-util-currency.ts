import { CARWAY_Model_Service_Item_Costs } from "../models/CARWAY-model-service-item-costs";
import { CARWAY_Model_Currency } from "../models/CARWAY-model-currency";
import { CARWAY_Model_Service_Item_Array_Costs } from "../models/CARWAY-model-service-item-array-costs";
import { CARWAY_Model_Day } from '../models/CARWAY-model-day';
import { CARWAY_Model } from '../models/CARWAY-model';
import { CARWAY_Util_Date } from './CARWAY-util-date';
import { CARWAY_KEY_TYPE } from '../providers/constants-provider';

export class CARWAY_Util_Currency
{
    public static calculateTotal(aCARWAY_Model_Service_Item_Array_Costs:CARWAY_Model_Service_Item_Array_Costs) : CARWAY_Model_Currency
    {
        let nValue:number = 0;

        aCARWAY_Model_Service_Item_Array_Costs.m_Array_CARWAY_Model_Service_Item_Costs.forEach(costs => 
        {
            nValue += (CARWAY_Util_Currency.getValue(costs.m_oPrice) * Number(costs.m_nAmount));
        });

        nValue = Math.round(nValue * 100) / 100;
        
        return this.finishCurrencyString(nValue);
    }

    public static calculateTotalArray(aArrayCARWAY_Model_Service_Item_Array_Costs:Array<CARWAY_Model_Service_Item_Array_Costs>) : CARWAY_Model_Currency
    {
        let nValue:number = 0;

        aArrayCARWAY_Model_Service_Item_Array_Costs.forEach(aCARWAY_Model_Service_Item_Array_Costs => 
        {
            nValue += CARWAY_Util_Currency.getValue(aCARWAY_Model_Service_Item_Array_Costs.m_oTotal);
        });

        nValue = Math.round(nValue * 100) / 100;
        
        return this.finishCurrencyString(nValue);
    }

    private static finishCurrencyString(nValue:number) : CARWAY_Model_Currency
    {
        let aCARWAY_Model_Currency:CARWAY_Model_Currency = new CARWAY_Model_Currency();
        let nTotaloArray:Array<string>;

        if(nValue==0)
        {
            aCARWAY_Model_Currency.m_sEuro = "0";
            aCARWAY_Model_Currency.m_sCent = "00";
        }
        else
        {
            nTotaloArray = String(nValue).split(".");
            
            if(nTotaloArray[0])
            aCARWAY_Model_Currency.m_sEuro = nTotaloArray[0];

            if(nTotaloArray[1])
            {
                aCARWAY_Model_Currency.m_sCent = nTotaloArray[1];

                if(aCARWAY_Model_Currency.m_sCent.length==1)
                {
                    aCARWAY_Model_Currency.m_sCent = aCARWAY_Model_Currency.m_sCent+"0"; 
                }   
            }
            else
            {
                aCARWAY_Model_Currency.m_sCent = "00";
            }
        }
        
        return aCARWAY_Model_Currency;
    }

    public static getValue(aCARWAY_Model_Currency:CARWAY_Model_Currency) : number
    {
        let nEuro:number = 0;
        let nCent:number = 0;
        
        if(!aCARWAY_Model_Currency.m_sEuro)
        {
            nEuro = 0;
        }
        else
        {
            nEuro = Number(aCARWAY_Model_Currency.m_sEuro);
        }
        
        if(!aCARWAY_Model_Currency.m_sCent)
        {
            nCent = 0;
        }
        else
        {
            nCent = Number(aCARWAY_Model_Currency.m_sCent);
        }
        
        return nEuro+(nCent/100);
    }

	public static async sumPriceAllAsync(aCARWAY_Model:CARWAY_Model)
    {
		return await CARWAY_Util_Currency.convertPriceToTitleTime(this.sumPriceAll(aCARWAY_Model));
	}
      
	public static sumPriceAll(aCARWAY_Model:CARWAY_Model) : number
	{ 
		let nSumPriceAll:number = 0;
		
		if(aCARWAY_Model.m_arrayCARWAY_Model_Day)
		{
			aCARWAY_Model.m_arrayCARWAY_Model_Day.forEach(day => 
			{
				if(day)
				{
					nSumPriceAll += this.sumPriceDay(day);
				}
			});
		}

        console.log("sumPriceAll ENDE:"+nSumPriceAll);
        
        return nSumPriceAll;
	}
 
	public static async sumPriceWeekAsync(aCARWAY_Model:CARWAY_Model,aDate:Date)
	{
		return await CARWAY_Util_Currency.convertPriceToTitleTime(this.sumPriceWeek(aCARWAY_Model,aDate));
	}
  
	public static sumPriceWeek(aCARWAY_Model:CARWAY_Model,aDate:Date) : number
	{ 
		let nSumDurationWeek:number = 0;
		
		let aMondayDate:Date =  CARWAY_Util_Date.getMonday(aDate);

		for(let i=0 ; i<6 ; i++)
		{
			let aDayKey = CARWAY_Util_Date.getKeyFromDate(CARWAY_Util_Date.addDaysToDate(aMondayDate,i),CARWAY_KEY_TYPE.DATE);
			let aDayIndex = aCARWAY_Model.m_arrayCARWAY_Model_Day.findIndex(item=> item && item.m_nTrackDayKey==aDayKey);
		
			if(aCARWAY_Model.m_arrayCARWAY_Model_Day[aDayIndex])
			{
				nSumDurationWeek = nSumDurationWeek + this.sumPriceDay(aCARWAY_Model.m_arrayCARWAY_Model_Day[aDayIndex]);
			}
		}
		
		console.log("sumPriceWeek ENDE:"+nSumDurationWeek);
		
		return nSumDurationWeek;
	}

	public static async sumPriceDayAsync(aCARWAY_Model_Day:CARWAY_Model_Day)
	{
		return await CARWAY_Util_Currency.convertPriceToTitleTime(this.sumPriceDay(aCARWAY_Model_Day));
	}
	
	public static sumPriceDay(aCARWAY_Model_Day:CARWAY_Model_Day) : number
	{
		let nSumPriceDay:number = 0;
    
        if(aCARWAY_Model_Day.m_arrayCARWAY_Model_Service)
		{
			aCARWAY_Model_Day.m_arrayCARWAY_Model_Service.forEach(service => 
			{
				if(service && service.m_oPrice)
				{
					nSumPriceDay = nSumPriceDay + CARWAY_Util_Currency.getValue(service.m_oPrice);
				}
			});
        }
        
        console.log("nSumPriceDay ENDE:"+nSumPriceDay);
    
        return nSumPriceDay;
    }
    
    private static convertPriceToTitleTime(nPrice:number) : string
    {
        let sPrice:string = "";

        sPrice = nPrice.toFixed(2);
        sPrice = sPrice.replace(".",",");
        
        return sPrice +" €";
    }

    public static convertDotToComma(nNumber:number) : string
    {
        let sNumber:string = String(nNumber);
        
        sNumber = sNumber.replace(".",",");

        return sNumber+" km";
    }
}