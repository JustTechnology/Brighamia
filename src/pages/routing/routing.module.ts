import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoutingPage } from './routing';

@NgModule({
  declarations: 
  [
    RoutingPage,
  ],
  imports: 
  [
    IonicPageModule.forChild(RoutingPage),
  ],
})
export class RoutingPageModule {}
