import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TimeStringPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'timeString',
})
export class TimeStringPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string,args) 
	{
		if(value)
		{
			let sHour:string = value.toString().substr(8,2);
			let sMinute:string = value.toString().substr(10,2);
			
			return sHour + ":" + sMinute;
		}
		else 
		{
			return "--:--";
		}
    }
}
