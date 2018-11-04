import { PipesModule } from './../pipes/pipes.module';
import { Keyboard } from '@ionic-native/keyboard';
import { Clipboard } from '@ionic-native/clipboard';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { TooltipsModule } from 'ionic-tooltips';
import { IonPullupModule } from 'ionic-pullup';
import { Network } from '@ionic-native/network';
import { HomePageModule } from '../pages/home/home.module';
import { ParallaxService } from '../services/parallax-service';
import { ToastService } from '../services/toast-service';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicErrorHandler, IonicModule, IonicApp } from 'ionic-angular';
import { MyApp } from './app.component';
import { ListPage } from '../pages/list/list';
import { ImagePicker } from '@ionic-native/image-picker';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AppSettings } from '../services/app-settings';
import { LoadingService } from '../services/loading-service';
import { Camera } from '@ionic-native/camera';  

import { TabPage1Module } from '../pages/tab-page-1/tab-page-1.module';
import { TabPage2Module } from '../pages/tab-page-2/tab-page-2.module';
import { TabPage3Module } from '../pages/tab-page-3/tab-page-3.module';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { GlobalModelProvider } from '../providers/global-model-provider';
import { CARWAY_Picture_Provider } from '../providers/CARWAY-picture-provider';
import { CARWAY_Log_Provider } from '../providers/CARWAY-log-provider';
import { CARWAY_Model_Car_Provider } from '../providers/CARWAY-model-car-provider';
import { CARWAY_Model_Settings_Provider } from '../providers/CARWAY-model-settings-provider';
import { SelectSearchableModule } from '../components/select-searchable/select-searchable-module';
import { CARWAY_Date_Provider } from '../providers/CARWAY-date-provider';
import { CARWAY_DayTrack_Provider } from '../providers/CARWAY-model-daytrack-provider';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { RoutingPage } from '../pages/routing/routing';
import { CarwayLocationTrackerProvider } from '../providers/carway-location-tracker';
import { EmailComposer } from '@ionic-native/email-composer';
import { CARWAY_Track_Service } from '../services/CARWAY-track-service';
import { CarwayModelServiceStructProvider } from '../providers/CARWAY-model-service-struct-provider';
import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    MyApp,
    ListPage,
    RoutingPage
  ],
  imports: [
    BrowserModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(AppSettings.FIREBASE_CONFIG),
    TabPage1Module,
    TabPage2Module,
    TabPage3Module,
    HomePageModule,
    SettingsPageModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    SelectSearchableModule,
    TooltipsModule,
    IonPullupModule,
    PipesModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListPage,
    RoutingPage  
  ],
  providers: [
    Clipboard,
    StatusBar,
    SplashScreen,
    LoadingService,
    ParallaxService,
    ToastService,
    Keyboard,
    Camera,
    AndroidPermissions,
    Geolocation,
    BackgroundGeolocation,
    NativeGeocoder,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalModelProvider,
    CARWAY_Picture_Provider,
    EmailComposer,
    CARWAY_Log_Provider,
    CARWAY_Model_Settings_Provider,
    CARWAY_Model_Car_Provider,
    CARWAY_Date_Provider,
    CARWAY_DayTrack_Provider,
    CarwayLocationTrackerProvider,
    CARWAY_Track_Service,
    CarwayModelServiceStructProvider,
    ImagePicker,
    File
  ]
})
export class AppModule {}
