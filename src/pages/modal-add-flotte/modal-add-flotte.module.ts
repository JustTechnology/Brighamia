import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddFlottePage } from './modal-add-flotte';
import { SelectSearchableModule } from '../../components/select-searchable/select-searchable-module';

@NgModule({
  declarations: [
    ModalAddFlottePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddFlottePage),
    SelectSearchableModule
  ],
})
export class ModalAddFlottePageModule {}
