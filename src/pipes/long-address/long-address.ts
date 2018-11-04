import { CARWAY_Util_Text } from './../../util/CARWAY-util-text';
import { Pipe, PipeTransform } from '@angular/core';
import { CARWAY_Util_Date } from '../../util/CARWAY-util-date';

/**
 * Generated class for the LongAddressPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'longAddress',
})
export class LongAddressPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) 
  {
    if(value)
    {
      return  CARWAY_Util_Text.addLineBreak(value);
    }
    else 
      return "";
    }
}
