import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the DurationStringMapPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'durationStringMap',
})
export class DurationStringMapPipe implements PipeTransform 
{
  transform(value:number, string,args) 
	{
		if(value<1)
			value = 1;
		let nMinutes:number =value%60;
		let nHours:number = Math.round(value/60);	
		
		let sHours = String(nHours);
		let sMinutes = "";
		
		if(nMinutes<10)
		{
			sMinutes = "0"+String(nMinutes);
		}
		else
		{
			sMinutes = String(nMinutes);
		}		

		return "~"+sHours + ":" + sMinutes;
	}
}
