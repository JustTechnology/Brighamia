import { CARWAY_Util_Date } from './../../util/CARWAY-util-date';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe
({
	name: 'durationString',
})

export class DurationStringPipe implements PipeTransform 
{
	transform(nDurationSeconds:number, string,args) 
	{	
		console.log("DurationStringPipe VALUE"+nDurationSeconds);
	
		//let nMinutes:number = CARWAY_Util_Date.round((nDurationSeconds/60),0);
		let nDurationMinutes:number = (nDurationSeconds/60);
		console.log("DurationStringPipe Minutes All"+nDurationMinutes);
		let nHours:number = Math.floor((nDurationMinutes/60));
		let nMinutes:number = nDurationMinutes%60;
		console.log("DurationStringPipe nMinutes"+nMinutes);
			
		let sHours = String(nHours);
		let sMinutes = "";
		
		if(nMinutes<10)
		{
			sMinutes = "0"+Math.floor(nMinutes);
		}
		else
		{
			sMinutes = String(Math.floor(nMinutes));
		}	

		console.log("DurationStringPipe sHours"+sHours);
		console.log("DurationStringPipe sMinutes"+sMinutes);
		
		return sHours + ":" + sMinutes + " Std.";
	}
}
