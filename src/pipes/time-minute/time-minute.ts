import { Pipe, PipeTransform } from '@angular/core';

@Pipe
({
  name: 'timeMinute',
})

export class TimeMinutePipe implements PipeTransform 
{
	transform(value: string,args) 
	{
		if(value)
		{
			return value.toString().substr(10,2);
		}
		else 
		{
			return "";
		}
    }
}
