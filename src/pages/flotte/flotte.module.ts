import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FlottePage } from './flotte';

@NgModule({
  declarations: [
    FlottePage,
  ],
  imports: [
    IonicPageModule.forChild(FlottePage),
  ],
})
export class FlottePageModule {}
