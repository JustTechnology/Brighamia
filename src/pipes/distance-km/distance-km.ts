import { Pipe, PipeTransform } from '@angular/core';

@Pipe
({
	name: 'distanceKm',
})

export class DistanceKmPipe implements PipeTransform 
{
	transform(sMeter: string, ...args) 
  	{
		console.log("DistanceKmPipe nMeter"+sMeter);
		let sDistanceInKmText:string = "";
		
		let nKM:number =  Number(sMeter) / 1000;
		
		nKM = Math.round(nKM*100)/100;

		if(nKM<=0)
		{
			sDistanceInKmText = "0.0 km"; 
		}
		else
		{
			sDistanceInKmText = String(nKM)+" km"; 
		}
		
		return sDistanceInKmText;
    }
}
