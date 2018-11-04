import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WizardPage } from './wizard';
import { WizardLayout1Module } from '../../components/wizard/layout-1/wizard-layout-1.module';
import { SelectSearchableModule } from '../../components/select-searchable/select-searchable-module';

@NgModule({
  declarations: [
    WizardPage,
  ],
  imports: [
    IonicPageModule.forChild(WizardPage),
    WizardLayout1Module,
    SelectSearchableModule
  ] 
})
export class WizardPageModule {}
