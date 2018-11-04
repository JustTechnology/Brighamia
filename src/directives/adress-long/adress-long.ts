import { CARWAY_Util_Date } from '../../util/CARWAY-util-date';
import { Directive, ElementRef, Renderer } from '@angular/core';
import { CARWAY_Util_Text } from '../../util/CARWAY-util-text';


@Directive({
  selector: '[adress-long]' // Attribute selector
})
export class AdressLongDirective {
  
  constructor(el: ElementRef, renderer: Renderer) 
  {
    el.nativeElement.innerText = CARWAY_Util_Text.addLineBreak(el.nativeElement.innerText);
   }
  
}
