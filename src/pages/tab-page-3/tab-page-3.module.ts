import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabPage3 } from './tab-page-3';
import { ExpandableLayout1Module } from '../../components/list-view/expandable/layout-1/expandable-layout-1.module';
import { LongPressModule } from 'ionic-long-press';

@NgModule({
    declarations: [
        TabPage3,
    ],
    imports: [
        ExpandableLayout1Module,
        IonicPageModule.forChild(TabPage3),
        LongPressModule
    ],
    exports:[
        TabPage3,
    ]
})

export class TabPage3Module { }



      