import { CARWAY_Model_Log } from '../../models/CARWAY-model-log';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'orderby',
})
export class OrderbyPipe implements PipeTransform 
{
  transform(array: Array<CARWAY_Model_Log>, args: string): Array<CARWAY_Model_Log> 
  {
    array.sort((a: CARWAY_Model_Log, b: CARWAY_Model_Log) => 
    {
      if (a.datetime > b.datetime) 
      {
        return -1;
      } 
      else if (a.datetime < b.datetime) 
      {
        return 1;
      } 
      else 
      {
        return 0;
      }
    });

    return array;
  }
}
