import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CARWAY_Log_Provider } from '../providers/CARWAY-log-provider';
import { CARWAY_Model_Car_Provider } from '../providers/CARWAY-model-car-provider';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Keyboard } from '@ionic-native/keyboard';
import { GlobalConstants } from '../providers/constants-provider';
import { CARWAY_Model_Car } from '../models/CARWAY-model-car';

declare var google: any;

@Component({
  templateUrl: 'app.html'
})

export class MyApp 
{
	@ViewChild(Nav) nav: Nav;
	
	constructor(
		public platform: Platform, 
		public statusBar: StatusBar,
		public splashScreen: SplashScreen,
		public menuController: MenuController,
		public backgroundGeolocation:BackgroundGeolocation,
		public keyboard:Keyboard,		
		public m_CARWAY_Log_Provider:CARWAY_Log_Provider,
		public m_CARWAY_Model_Car_Provider:CARWAY_Model_Car_Provider)
	{
		this.initializeApp();
	}

	initializeApp() 
	{
		this.platform.ready().then(() => 
		{
			this.keyboard.onKeyboardShow().subscribe(() =>
			{
				document.body.classList.add('keyboard-is-open');
			});
		
			this.keyboard.onKeyboardHide().subscribe(() =>
			{
				document.body.classList.remove('keyboard-is-open');
			});

			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.menuController.enable(false);
		});
	}
	private openPageFlotte()
	{
        this.nav.push("FlottePage");        
	}
}
