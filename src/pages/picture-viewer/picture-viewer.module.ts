import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PictureViewerPage } from './picture-viewer';

@NgModule({
  declarations: [
    PictureViewerPage,
  ],
  imports: [
    IonicPageModule.forChild(PictureViewerPage),
  ],
})
export class PictureViewerPageModule {}
