import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogPage } from './log';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    LogPage,
    
  ],
  imports: [
    IonicPageModule.forChild(LogPage),
    PipesModule
  ],
})
export class LogPageModule {}
