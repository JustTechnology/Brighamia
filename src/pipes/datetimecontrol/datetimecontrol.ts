import { Pipe, PipeTransform } from '@angular/core';

@Pipe
({
  name: 'datetimecontrol',
})

export class DatetimecontrolPipe implements PipeTransform 
{
  	transform(sDayKey: string, ...args) 
  	{
		if(!sDayKey || sDayKey.length==0)
    	{
        	return "";
      	}

      	let sDateTimeString:string = "";

      	console.log("DatetimecontrolPipe:"+sDayKey);
      	sDateTimeString = String(sDayKey).substr(0,4)+"-"+String(sDayKey).substr(4,2)+"-"+String(sDayKey).substr(6,2);
      	console.log("DatetimecontrolPipe:"+sDateTimeString)
      
      	return sDateTimeString;
    }
}
