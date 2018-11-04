import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeHour',
})

export class TimeHourPipe implements PipeTransform 
{
	transform(value: string,args) 
	{
		if(value)
		{
			return value.toString().substr(8,2);
		}
		else 
		{
			return "";
		}
	}
}
