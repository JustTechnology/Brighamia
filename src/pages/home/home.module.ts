import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { IonPullupModule } from 'ionic-pullup';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        IonPullupModule,
        PipesModule
        ],
    exports:[
        HomePage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HomePageModule { }
