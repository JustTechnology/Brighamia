import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceWizardPage } from './service-wizard';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ServiceWizardPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceWizardPage),
    PipesModule
  ],
})
export class ServiceWizardPageModule {}
