import { CARWAY_Model_Track_Single } from '../models/CARWAY-model-track-single';
import { CARWAY_Model_Day } from '../models/CARWAY-model-day';
import { CARWAY_Geoposition } from '../models/CARWAY-model-geoposition';
import { CARWAY_TIME_PARTS, CARWAY_KEY_TYPE } from '../providers/constants-provider';
import { CARWAY_Model } from '../models/CARWAY-model';

declare var google: any;

export class CARWAY_Util_Date
{
    public static getKeyFromDate(dDate:Date,aCARWAY_KEY_TYPE:CARWAY_KEY_TYPE) :number
    {
        if(!dDate)
        {
            console.log("ERROR (CARWAY_Util_Date.getKeyFromDate):Kein Datum übergeben!");
        }
        //

        let sDayKey:string = "";
        
        sDayKey = String(dDate.getFullYear())+CARWAY_Util_Date.convertMonthToKey(dDate.getMonth()+1)+CARWAY_Util_Date.convertDayToKey(dDate.getDate());
        
        if(aCARWAY_KEY_TYPE == CARWAY_KEY_TYPE.TIME)
        {
            sDayKey = sDayKey + String(this.convertHourToKey(dDate.getHours()) + CARWAY_Util_Date.convertMinutesToKey(dDate.getMinutes())+CARWAY_Util_Date.convertMinutesToKey(dDate.getSeconds()));
        }
        
        return Number(sDayKey);
    }

    public static getDateTimeFromKey(nKey:number,aCARWAY_KEY_TYPE:CARWAY_KEY_TYPE) : Date
    {
        let sKey:string = nKey.toString();
        let aDate = null;
        
        // YYYYMMDD -> DayKey
        if(aCARWAY_KEY_TYPE == CARWAY_KEY_TYPE.DATE)
        {
            aDate =  new Date(Number.parseInt(sKey.substr(0,4)), Number.parseInt(sKey.substr(4,2))-1, Number.parseInt(sKey.substr(6,2)));
        }
        // YYYYMMDD HHMMSS -> TimeKey
        else if(aCARWAY_KEY_TYPE == CARWAY_KEY_TYPE.TIME)
        {
            // Date-Time Key            
            aDate =  new Date(Number.parseInt(sKey.substr(0,4)), Number.parseInt(sKey.substr(4,2))-1, Number.parseInt(sKey.substr(6,2)),Number.parseInt(sKey.substr(8,2)),Number.parseInt(sKey.substr(10,2)),Number.parseInt(sKey.substr(12,2)));
        }
        else
        {
            aDate =  new Date();
        }

         return aDate;
    }

    public static replaceHourInKey(nTimeKey:number,nHour:number) : number
    {
        return this.replaceValueInKey(nTimeKey,nHour,8,10);
    }

    public static replaceMinuteInKey(nTimeKey:number,nMinute:number): number
    {
        return this.replaceValueInKey(nTimeKey,nMinute,10,12);
    }

    private static replaceValueInKey(nKey:number,nValue:number,nStart:number,nEnde:number) : number
    {
        let sTimeKey:string = String(nKey);
        
        let sFirst = sTimeKey.substring(0,nStart);
        let sLast  = sTimeKey.substring(nEnde);
        let sValue:string = String(nValue);
        
        while(sValue.length<2)
        {
            sValue = "0" + sValue;
        }
        
        let sNewKey = sFirst + sValue + sLast; 
        
        return Number(sNewKey);
    }

    public static getDayKeyAddDay(nDayKey:number,aCARWAY_KEY_TYPE:CARWAY_KEY_TYPE,nAddDays?:number) : number
    {
        let aDate = this.getDateTimeFromKey(nDayKey,aCARWAY_KEY_TYPE)
        aDate = this.addDaysToDate(aDate,nAddDays);
        let a = this.getKeyFromDate(aDate,aCARWAY_KEY_TYPE) 
        return a;
    }

    public static addDaysToDate(date:Date,nAddDays:number) : Date
    {
        let dateToAdd:Date = new Date();

		dateToAdd.setTime(date.getTime() + (24*60*60*1000) * nAddDays);
        
        return dateToAdd;
    }

    public static addSecondsToDate(date:Date,nAddSeconds:number) : Date
    {
        let dateToAdd:Date = new Date();

		dateToAdd.setTime(date.getTime() + (1000) * nAddSeconds);
        
        return dateToAdd;
    }

    
    public static getNowTrackKey() :number
	{
		let aDate:Date = new Date()
		let sNowTrackKey:string = '';

		sNowTrackKey = String(aDate.getFullYear())+this.convertMonthToKey(aDate.getMonth()+1)+this.convertDayToKey(aDate.getDate())+String(aDate.getHours()+String(aDate.getMinutes())+String(aDate.getHours()+String(aDate.getSeconds())));
		
		return Number.parseInt(sNowTrackKey); 
    }

    public static getActTimeKey(bAddMillicseconds:boolean=false) :string
	{
        let sKey:string = "";
		let aDate:Date = new Date()
        let aHours:string = String(aDate.getHours());
        let aMinutes:string = String(aDate.getMinutes());
        let aSeconds:string = String(aDate.getSeconds());
        let aMilliseconds:string = String(aDate.getMilliseconds());

        while(aHours.length<2)
            aHours = "0" + aHours;

        while(aMinutes.length<2)
            aMinutes = "0" + aMinutes;

        while(aSeconds.length<2)
            aSeconds = "0" + aSeconds;

        while(aMilliseconds.length<4)
         aMilliseconds = "0" + aMilliseconds;

        sKey = aHours+aMinutes+aSeconds 
        
        if(bAddMillicseconds)
        {
            sKey = sKey + aMilliseconds;
        }
        
        return sKey;
    } 

    public static getActDateTimeKey() :string
	{
		let aDate:Date = new Date()
        let aYear:string = String(aDate.getFullYear());
        let aMonth:string = String(aDate.getMonth()+1);
        let aDay:string = String(aDate.getDate());
        let aHours:string = String(aDate.getHours());
        let aMinutes:string = String(aDate.getMinutes());
        let aSeconds:string = String(aDate.getSeconds());
        let aMilliseconds:string = String(aDate.getMilliseconds());
        
        while(aDay.length<2)
            aDay = "0" + aDay;
        
        while(aMonth.length<2)
            aMonth = "0" + aMonth;

        while(aHours.length<2)
            aHours = "0" + aHours;

        while(aMinutes.length<2)
            aMinutes = "0" + aMinutes;

        while(aSeconds.length<2)
            aSeconds = "0" + aSeconds;

        while(aMilliseconds.length<4)
         aMilliseconds = "0" + aMilliseconds;

        return aYear+aMonth+aDay+aHours+aMinutes+aSeconds;
    } 

    public static getTextFromDate(date:Date,bMonthAsNumber:boolean=false) : string
    {
        let sDate:string = '';

        if(bMonthAsNumber)
        {
            sDate = date.getDate()+"."+String(date.getMonth()+1)+"."+date.getFullYear();            
        }
        else
        {
            sDate = this.convertWeekdayToText(date.getDay()) +', '+ date.getDate()+"."+this.convertMonthToText(date.getMonth()+1)+" "+date.getFullYear();            
        }

        return sDate;
    }

    public static getTextFromTime(date:Date) : string
    {
        let sTime:string = '';

        sTime = date.getHours()+":"+date.getMinutes();            

        return sTime;
    }

    public static getDate(dDate:Date,addDays:number)
    {
        dDate.setDate(dDate.getDate()+addDays);

        return dDate;
    }


    
    public static convertMinutesToKey(nMinutes:number) :string
    {
        if(nMinutes==0)
            return '00';
        else if(nMinutes==1)
            return '01';
        else if(nMinutes==2)
            return '02';
        else if(nMinutes==3)
            return '03';
        else if(nMinutes==4)
            return '04';
        else if(nMinutes==5)
            return '05'
        else if(nMinutes==6)
            return '06';
        else if(nMinutes==7)
            return '07';
        else if(nMinutes==8)
            return '08';
        else if(nMinutes==9)
            return '09';
        else if(nMinutes>=10 && nMinutes<60)
            return String(nMinutes);
        else 
            return '0';
    }
    
    public static convertHourToKey(nHour:number) :string
    {
        if(nHour==0)
            return '00';
        else if(nHour==1)
            return '01';
        else if(nHour==2)
            return '02';
        else if(nHour==3)
            return '03';
        else if(nHour==4)
            return '04';
        else if(nHour==5)
            return '05';
        else if(nHour==6)
            return '06';
        else if(nHour==7)
            return '07';
        else if(nHour==8)
            return '08';
        else if(nHour==9)
            return '09';
        else if(nHour>=10 && nHour<24)
            return String(nHour);
        else 
            return '0';
    }
    public static convertMonthToKey(month:number) :string
    { 
        if(month==1)
            return '01';
        else if(month==2)
            return '02';
        else if(month==3)
            return '03';
        else if(month==4)
            return '04';
        else if(month==5)
            return '05';
        else if(month==6)
            return '06';
        else if(month==7)
            return '07';
        else if(month==8)
            return '08';
        else if(month==9)
            return '09';
        else if(month==10)
            return '10';
        else if(month==11)
            return '11';
        else 
            return '12';
    }

    public static convertDayToKey(day:number) :string
    {
        if(day==1)
            return '01'; 
        if(day==2)
            return '02'; 
        if(day==3)
            return '03'; 
        if(day==4)
            return '04'; 
        if(day==5)
            return '05'; 
        if(day==6)
            return '06'; 
        if(day==7)
            return '07'; 
        if(day==8)
            return '08'; 
        if(day==9)
            return '09'; 
        else
            return String(day);
    }

    public static convertWeekdayToText(day:number)
    { 
        if(day==1)
            return 'Montag';
        else if(day==2)
            return 'Dienstag';
        else if(day==3)
            return 'Mittwoch';
        else if(day==4)
            return 'Donnerstag';
        else if(day==5)
            return 'Freitag';
        else if(day==6)
            return 'Samstag';
        else 
            return 'Sonntag';
    }

    public static convertMonthToText(month:number)
    { 
        if(month==1)
            return 'Januar';
        else if(month==2)
            return 'Februar';
        else if(month==3)
            return 'März';
        else if(month==4)
            return 'April';
        else if(month==5)
            return 'Mai';
        else if(month==6)
            return 'Juni';
        else if(month==7)
            return 'Juli';
        else if(month==8)
            return 'August';
        else if(month==9)
            return 'September';
        else if(month==10)
            return 'Oktober';
        else if(month==11)
            return 'November';
        else 
            return 'Dezember';
    }

    public static getNow() : string
    {
        let now = new Date();

        return String(now.getHours()) + ":" + String(now.getMinutes());
    }

   
   
    public static getTimePart(time:string,part:CARWAY_TIME_PARTS) : string
    {
        let arrayTime:string[];
        let sTimePart:string = "";

        if(!time || time.length<1)
        {
            time = this.getNow();
        }

        arrayTime = time.split(":");
        
        if(arrayTime.length>=1)
        {
            sTimePart = arrayTime[part];

            if(part == CARWAY_TIME_PARTS.MINUTE && sTimePart.length==1)
            {
                sTimePart = "0"+sTimePart;
            }
        }

        return sTimePart;
    }


    public static getValidTimeString(sTime:string) : string
    {
        let sValidTimeString:string = "";
        let arrayTime:string[];
        
        arrayTime = sTime.split(":");

        if(arrayTime[0].length == 1)
        {
            sValidTimeString = "0"+arrayTime[0]+":"+arrayTime[1];
        }
        else
        {
            sValidTimeString = sTime;
        }

        return sValidTimeString;
    }


    public static round(aNumber:number,aCommaFixed:number)
    {
        let aExponent:number = 1;

        for(let i=0 ; i<aCommaFixed-1; i++)
        {
            aExponent = aExponent * 10;
        }

        return (Math.round(aNumber) * aExponent)/aExponent;
    }

    public static getMonday(d)  : Date
    {
        let dDate:Date = new Date(d);
        let day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        return new Date(d.setDate(diff));
     }

    public static getTimeKeyAddTime(nStartTimeKey:number,nAddTimeSeconds:number) : number
    {
        let nTimeKeyAddTime :number = 0;

        let aDateStart:Date = CARWAY_Util_Date.getDateTimeFromKey(nStartTimeKey,CARWAY_KEY_TYPE.TIME);

        let aDateZiel:Date = CARWAY_Util_Date.addSecondsToDate(aDateStart,nAddTimeSeconds);

        nTimeKeyAddTime = CARWAY_Util_Date.getKeyFromDate(aDateZiel,CARWAY_KEY_TYPE.TIME);
        
        return nTimeKeyAddTime;
    }
    
    public static getTimeTextFromTimeKey(nTimeKey:number) : string
    {
        let sTimeText:string = String(nTimeKey);

        sTimeText = sTimeText.substr(8,2) + ":" + sTimeText.substr(10,2);

        return sTimeText;
    }

    public static getDateTextFromDateKey(nTimeKey:number) : string
    {
        let sDateText:string = String(nTimeKey);

        sDateText = sDateText.substr(6,2) + "." + sDateText.substr(4,2)+ "." + sDateText.substr(0,4);

        return sDateText;
    }
    
    public static getTitleFromDate(date:Date) : string
    {
        let sTitle:string = '';

        sTitle = this.convertWeekdayToText(date.getDay());

        return sTitle;
    }

    public static getSubtitleFromDate(date:Date) : string
    {
        let sSubtitle:string = '';

        sSubtitle = date.getDate()+"."+this.convertMonthToText(date.getMonth()+1)+" "+date.getFullYear();            

        return sSubtitle;
    }

    public static convertSecondsToTitleTime(nSecondsTotal:number) : string
    {
        let sTitleTime:string = '';
        let nMinutesTotal = Math.round(nSecondsTotal/60);
        let nMinutes:number = CARWAY_Util_Date.round((nMinutesTotal%60),0);

		let nHours:number = Math.floor(nMinutesTotal/60);	
		
		let sMinutes = String(nMinutes);
		let sHours = String(nHours);
		
		if(nMinutes<10)
		{
			sMinutes = "0"+String(nMinutes);
		}
		
		if(nHours<10)
		{
			//sHours = "0"+String(nHours);
		}		
		
		return sHours + ":" + sMinutes + " Std.";
    }


}