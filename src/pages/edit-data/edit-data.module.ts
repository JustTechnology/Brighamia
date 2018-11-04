
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditDataPage } from './edit-data';
import { LongPressModule } from 'ionic-long-press';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    EditDataPage

  ],
  imports: [
    IonicPageModule.forChild(EditDataPage),
    LongPressModule,
    PipesModule
  ],
})
export class EditDataPageModule {}
