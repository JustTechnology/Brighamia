import { GlobalConstants } from '../../providers/constants-provider';
import { CARWAY_Model_Car } from '../../models/CARWAY-model-car';
import { CARWAY_Model_Car_Provider } from '../../providers/CARWAY-model-car-provider';
import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ToastController, AlertController, ViewController } from 'ionic-angular';
import { LogPage } from '../log/log';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { CARWAY_Log_Provider } from '../../providers/CARWAY-log-provider';
import { CARWAY_Picture_Provider } from '../../providers/CARWAY-picture-provider';
import { Clipboard } from '@ionic-native/clipboard';
import { Platform } from 'ionic-angular';
import { Storage as IonicStorage } from '@ionic/storage';

@IonicPage()
@Component({
	selector: 'page-wizard',
  	templateUrl: 'wizard.html',
})

export class WizardPage
{
	@Input() data: any;
	@Input() events: any;
	@ViewChild('wizardSlider') slider: Slides;

	m_hideCopyClipboard:boolean = true;
	
	m_bindBackButton:string = "Zurück";
	
	// Passwort-Retry
	private static m_static_bMessageShown = false;
	private m_LoginTrys:number = 0;
	
	// Save-Blocker
	private static m_static_bind_bSaveBlocked = false;
	
	// Login Car
	private m_LoginCar: CARWAY_Model_Car;
	
	public m_fg_validateKFZ : FormGroup; 
	public m_fg_validatePassword : FormGroup; 
  	
	sliders = { pager: true };
	  
	m_bind_showLogin = false;
	m_bind_login_text = 'Auto registrieren';  
	m_bind_pending = false;
  	m_bind_CARWAY_ShowValidationHintKFZ  = false;
  	m_bind_CARWAY_ShowValidationHintPasswort = false;
  	m_bind_CARWAY_UserSaved = false;
  	m_bind_CARWAY_UserSavedColor = '';

  	// Hide Password
  	m_bind_CARWAY_showPasswort = "password";
	m_bind_CARWAY_Random_Password = '';
	  
	// Web-URL
	m_bind_CARWAY_INPUT_LoginUrl=GlobalConstants.CARWAY_loginBaseUrl+'KENNZEICHEN';
	m_CARWAY_INPUT_UserID = '';
	
	m_bind_CARWAY_INPUT_UserID_Button = 'KFZ registrieren';
	
	// KFZ Kennezichen
	m_bind_CARWAY_INPUT_KFZ1:string = '';
	m_bind_CARWAY_INPUT_KFZ2:string = '';
	m_bind_CARWAY_INPUT_KFZ3:any = '';
	
	// Passwort
	m_bind_CARWAY_INPUT_Password:string = '';
	m_bind_CARWAY_INPUT_PasswordBestaetigt:string = '';
	
	m_bind_CARWAY_INPUT_CarBezeichnung:string = '';
	m_CARWAY_Fabrikat_Name:string = '';
	m_CARWAY_Modell_Name:string = '';
	m_CARWAY_Generation_Name:string = '';
	m_CARWAY_Motor_Name:string = '';

	// Auwahl KFZ
	m_bindselectedFabrikat = '';
	m_bindselectedGeneration;
	m_bindselectedMotorisierung = '';
	m_selectedModell = '';
	m_CARWAY_KFZKennzeichen = '';
	
	kfz_fabrikat: any[];
	kfz_modell: any[];
	kfz_generation: any[];
	kfz_motorisierung: any[];
	m_bFlotte = false;

	constructor(
		public m_ViewController: ViewController,
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastController:ToastController,
		public alertController:AlertController,
		private m_CARWAY_Log_Provider:CARWAY_Log_Provider,
		public formBuilder: FormBuilder,
		private m_CARWAY_Picture_Provider:CARWAY_Picture_Provider,
		public m_CARWAY_Model_Car_Provider:CARWAY_Model_Car_Provider,
		private clipboard:Clipboard,
		private platform:Platform,
		private m_IonicStorage:IonicStorage) 
	{

		this.m_bFlotte = this.navParams.get('flotte'); 
		
		this.m_CARWAY_Log_Provider.add("WizardPage","construct WizardPage");
		console.log("construct WizardPage");

    	this.m_fg_validateKFZ = formBuilder.group(
		{
			KFZText1: ['',Validators.compose([Validators.required,Validators.pattern('[A-z ]*'),Validators.minLength(1),Validators.maxLength(3)])],
			KFZText2: ['',Validators.compose([Validators.required,Validators.pattern('[A-z ]*'),Validators.minLength(1),Validators.maxLength(2)])],
			KFZNumber: ['',Validators.compose([Validators.required,Validators.pattern('[0-9 ]*'),Validators.minLength(1),Validators.maxLength(4)])]
		});

		this.m_fg_validatePassword = formBuilder.group(
			{
			Passwort: ['',Validators.compose([Validators.pattern(GlobalConstants.CARWAY_REGEXP_PASSWORD)])]
		});
	}  

	checkInput()
  	{
		this.m_CARWAY_Log_Provider.add("WizardPage","checkInput(m_fg_validateKFZ=>)"+this.m_fg_validateKFZ.valid);
		this.m_CARWAY_Log_Provider.add("WizardPage","checkInput(m_fg_validatePassword=>)"+this.m_fg_validatePassword.valid);
		
		this.m_bind_CARWAY_ShowValidationHintKFZ = !this.m_fg_validateKFZ.valid;
		
		if(!this.m_fg_validateKFZ.valid)
		{
			return false;
		}
		
		this.m_bind_CARWAY_ShowValidationHintPasswort = !this.m_fg_validatePassword.valid;

		if(!this.m_fg_validatePassword.valid)
		{
			return false;
		}
		
		return true;
	}

	ionViewDidLoad() 
  	{

		this.m_hideCopyClipboard = !this.platform.is('cordova');

		this.m_CARWAY_Log_Provider.add("WizardPage","ionViewDidLoad");
		
		this.m_CARWAY_Model_Car_Provider.getKFZFabrikat().valueChanges().subscribe((fabrikdata) =>
		{
			this.kfz_fabrikat = fabrikdata;
		  });
	}

	ionViewWillLeave()
	{
		this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarName = this.m_bind_CARWAY_INPUT_CarBezeichnung;
		this.m_CARWAY_Model_Car_Provider.updateCarBezeichnung(0);
	}


  	changeSlide(index: number): void 
  	{
    	if (index > 0) 
    	{
        	this.slider.slideNext(300);
    	} 
    	else 
    	{
			if(this.m_bFlotte && this.slider.getActiveIndex()==0)
			{
				this.m_ViewController.dismiss(false);
			}
			else
			{
				if(this.m_bind_showLogin)
				{
					this.m_bind_CARWAY_INPUT_Password = '';
					
					this.m_bind_CARWAY_INPUT_KFZ1 = '';				
					this.m_bind_CARWAY_INPUT_KFZ2 = '';				
					this.m_bind_CARWAY_INPUT_KFZ3 = '';				
					
					this.switchToLogin(false);
				}
				else
				{
					this.slider.slidePrev(300);
				}
			}
    	}
  	}

	onEvent(event: string) 
	{
		if (this.events[event]) 
		{
			this.events[event]();
		}
	}

	onFinish()
	{
		if(this.m_bFlotte)
		{
			this.m_ViewController.dismiss(this.m_bind_CARWAY_UserSaved);
		}
		else
		{
			this.navCtrl.setRoot('HomePage');
		}
	}

  	public addFoto() 
  	{
		this.m_CARWAY_Picture_Provider.getImageFromCamera();
	}
	  
	copyToClipboard()
	{
		if(this.m_bind_CARWAY_INPUT_Password)
		{
			this.clipboard.copy(this.m_bind_CARWAY_INPUT_Password);

			this.clipboard.paste()
			.then(
				(resolve: string) => 
				{
					let toast = this.toastController.create(
						{ 
							  message: "Passwort wurde in die Zwischenablege kopiert!",
							  duration: 3000,
						});
						
					toast.present();			
				},
				(reject: string) => 
				{
					alert('Error: ' + reject);
				}
			);
		}
	}
	openDebugLog()
  	{
      	this.navCtrl.push(LogPage);
  	}

	nextSlide()
	{
		let index = this.slider.getActiveIndex()
		
		if(index==this.slider.length()-1)
		{
			if(!this.save())
			{
				setTimeout(() => 
				{
					this.slider.slidePrev();
				},
				200);
			}
		}
		return true;
	}

	update()
	{
		this.m_CARWAY_Model_Car_Provider.updateCarBezeichnung(0);
	}
	
	save() 
	{
		this.m_CARWAY_Log_Provider.add("WizardPage","save()--TRY");

		if(this.m_bind_CARWAY_UserSaved && this.m_bind_CARWAY_INPUT_Password != this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sPassword)
		{
			// Passwort aktualisieren
			this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sPassword = this.m_bind_CARWAY_INPUT_Password;
			this.m_CARWAY_Model_Car_Provider.save();
			
			let toast = this.toastController.create(
				{ 
					message: 'Das Passwort wurde erfolgreich gespeichert.',
					duration: 3000,
				});
				toast.present();

			return true;
		}

		if(this.m_bind_CARWAY_UserSaved)
		{
			return true;
		}

		let bSaveSuccess:boolean = false;
		
		if(!this.m_bind_showLogin)
		{
			if(!WizardPage.m_static_bind_bSaveBlocked)
			{
				WizardPage.m_static_bind_bSaveBlocked = true;	

				if(this.checkInput())
				{
					bSaveSuccess = true;
 
					if(!this.m_bind_CARWAY_INPUT_Password && !this.m_bind_CARWAY_UserSaved)
					{
						let alert = this.alertController.create({
							title: 'Login',
							message: 'Sie haben kein Passwort angegeben, daher ist ihr Zugang öffentlich. Wenn Sie das nicht wünschen, können Sie entweder eine Seite zurück swipen, oder später in den Einstellungen ein Passwort angeben.',
							buttons: ['OK'],
						});
						alert.present();
					}		
					
					this.m_CARWAY_Log_Provider.add("WizardPage","save()");
					
					this.m_bind_pending = true;		
				
					let promise = this.m_CARWAY_Model_Car_Provider.exists(this.m_CARWAY_INPUT_UserID)
					.subscribe((aCARWAY_Model_Car:CARWAY_Model_Car) => 
					{
						promise.unsubscribe();

						if(aCARWAY_Model_Car)
						{
							this.m_CARWAY_Log_Provider.add("WizardPage","save() KFZ exists:"+aCARWAY_Model_Car);
						
							let toast = this.toastController.create(
							{ 
								message: `Das KFZ '${this.m_CARWAY_Model_Car_Provider.getCarIDTextByIndex(0)}' ist bereits registriert.`,
								duration: 3000,
							});
							toast.present();
							
							this.m_LoginCar = aCARWAY_Model_Car;

							this.switchToLogin(true);
							
							this.m_bind_pending = false;	
						}
						else
						{
							this.m_LoginCar = null;

							this.m_CARWAY_Log_Provider.add("WizardPage","save() KFZ not exists() -> User erstellen");
							
							// SAVE SIGN
							this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarID  = this.m_CARWAY_INPUT_UserID;
							this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sPassword = this.m_bind_CARWAY_INPUT_Password;
							this.m_CARWAY_Model_Car_Provider.m_sSignFromStorage = this.m_CARWAY_INPUT_UserID;
							
							this.m_CARWAY_Model_Car_Provider.save()
							.then((data) =>
							{
								let toast = this.toastController.create(
									{ 
										message: 'Das KFZ  wurde erfolgreich gespeichert.',
										duration: 3000,
									});
									toast.present();
					
								// SAVE To Storage
								this.m_IonicStorage.set(GlobalConstants.CARWAY_STORAGE_ACT_SIGN,this.m_CARWAY_INPUT_UserID)
								.then((value) =>
								{
									this.m_CARWAY_Log_Provider.add("CARWAY_Model_User","User erfolgreich in IONIC Storage gespeichert! Key:"+this.m_CARWAY_INPUT_UserID);
								});

								this.m_CARWAY_Log_Provider.add("WizardPage","save() KFZ saved success");
								this.m_bind_CARWAY_UserSaved = true;
								this.m_bind_CARWAY_UserSavedColor = 'green';
								
								this.m_bind_CARWAY_INPUT_UserID_Button = 'Das KFZ < '+this.m_CARWAY_Model_Car_Provider.getCarIDTextByIndex(0) +' > wurde erfolgreich registriert';
								
								this.m_bind_pending = false;
							}).catch((error) =>
							{
								this.m_CARWAY_Log_Provider.add("WizardPage","save() KFZ saved failed:"+error);
								this.m_bind_pending = false;
							});

						}
						 
						promise.unsubscribe();
					});
				}
			}
			WizardPage.m_static_bind_bSaveBlocked = false;
		}
		else
		{
			this.m_CARWAY_Log_Provider.add("WizardPage","Login()");
			
			// Login
			if(this.m_LoginCar.m_sPassword == this.m_bind_CARWAY_INPUT_Password)
			{
				this.m_CARWAY_Log_Provider.add("this.m_LoginCar.m_sPassword==this.m_bind_CARWAY_INPUT_Password",this.m_LoginCar.m_sPassword + " == " + this.m_bind_CARWAY_INPUT_Password);
				this.m_LoginTrys = 0;

				this.onFinish();
			}
			else
			{
				console.log("WizardPage.m_LoginTrys:"+String(this.m_LoginTrys));
				this.m_LoginTrys = this.m_LoginTrys+1;
				
				console.log("m_LoginTrys>=5 && m_bind_showLogin:"+this.m_LoginTrys+" "+this.m_bind_showLogin);

				if(this.m_LoginTrys>=5)
				{
					setTimeout(() => 
					{
						this.m_LoginTrys = 0;
					},
					10000);
					
					let alert = this.alertController.create({
						title: 'Login',
						message: 'Sie haben das Passwort 5x falsch eingegeben. Ihr Zugang ist aus sicherheitsgründen temporär gesperrt. Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut.',
						buttons: ['OK'],
					});
					alert.present();
				}
				else
				{
					let alert = this.alertController.create({
						title: 'Login',
						message: 'Das Passwort ist nicht korrekt. ',
						buttons: ['OK'],
					});
					alert.present();
				}
				this.m_LoginCar.m_sPassword = '';
			}
		}

		return bSaveSuccess;
	}
	
	onSelectChangeFabrikat(selectedFabrikat: any) 
  	{
		this.m_CARWAY_Fabrikat_Name = selectedFabrikat.name;
		this.concatCarBezeichnung();

		this.m_CARWAY_Model_Car_Provider.getKFZModell(selectedFabrikat.id_car_make).valueChanges()
		.subscribe((snapshots) => 
		{
			if(snapshots)
			{
				this.kfz_modell = snapshots; 
			}
		});
  	}
	
  	onSelectChangeModell(selectedModell: any) 
  	{
    	this.m_selectedModell = selectedModell.id_car_model;
    
    	this.m_CARWAY_Modell_Name = selectedModell.name;
    
    	this.concatCarBezeichnung();

    	this.m_CARWAY_Model_Car_Provider.getKFZGeneration(selectedModell.id_car_model).valueChanges().subscribe((snapshots) => 
		{
			if(snapshots)
			{
				this.kfz_generation = snapshots.map((item: any) => 
				{
					return {"name":item.name+" ("+item.year_begin+"-"+item.year_end+")"};
				});	
				 
			}
		});
  	}

  	onSelectChangeGeneration(selectedGeneration: any) 
  	{
		this.m_CARWAY_Generation_Name = this.m_bindselectedGeneration.name;
		
		this.concatCarBezeichnung();

		this.m_CARWAY_Model_Car_Provider.getKFZMotorisierung(this.m_selectedModell).valueChanges()
		.subscribe((snapshots) => 
		{
			if(snapshots)
			{
				this.kfz_motorisierung = snapshots;
			}
				
		})
	}
	  
	
	onSelectChangeMotorisierung(selectedMotor: any) 
	{
		this.m_CARWAY_Motor_Name = selectedMotor.name;
		
		this.concatCarBezeichnung();
	}
	  
	concatCarBezeichnung()
  	{
    	this.m_bind_CARWAY_INPUT_CarBezeichnung = this.m_CARWAY_Fabrikat_Name;
    
		if(this.m_CARWAY_Modell_Name)
		{
			this.m_bind_CARWAY_INPUT_CarBezeichnung += " " + this.m_CARWAY_Modell_Name;
		}

		if(this.m_CARWAY_Generation_Name)
		{
			this.m_bind_CARWAY_INPUT_CarBezeichnung += " " + this.m_CARWAY_Generation_Name;
		}
		
		if(this.m_CARWAY_Motor_Name)
		{
			this.m_bind_CARWAY_INPUT_CarBezeichnung += " " + this.m_CARWAY_Motor_Name;
		}
		
		this.m_CARWAY_Model_Car_Provider.m_CARWAY_Model_Car.m_sCarName = this.m_bind_CARWAY_INPUT_CarBezeichnung;

		this.m_CARWAY_Model_Car_Provider.updateCarBezeichnung(0);
	}

  	onKeyUpNumber(keycode)
  	{
		this.m_bind_CARWAY_INPUT_Password = '';
		this.m_bind_CARWAY_INPUT_PasswordBestaetigt = '';

		try
		{
			let character = String.fromCharCode(keycode);
	
			let inputValueFull : string = (<HTMLInputElement>document.getElementById("CARWAY_input_KFZ3")).value+character;
			let inputValueTemp : string = (<HTMLInputElement>document.getElementById("CARWAY_input_KFZ3")).value;
		
			let inputValueFullNumber : number = parseInt(inputValueFull); 
		
			console.log("inputValueFull:"+inputValueFull);
			console.log("inputValueTemp:"+inputValueTemp);
	
			if(inputValueFullNumber<1)
			{
				this.m_bind_CARWAY_INPUT_KFZ3 = "";
		
			return false;
			}
			
			if(inputValueFullNumber>9999)
			{
				(<HTMLInputElement>document.getElementById("CARWAY_input_KFZ3")).value = inputValueTemp; 
				this.m_bind_CARWAY_INPUT_KFZ3 = inputValueTemp;
		
				return false;
			}
			
			this.concatUserID();
		}
		catch(error)
		{

		}
		
  	}
 
	onKeyDownText1(keycode)
	{
		this.m_bind_CARWAY_INPUT_KFZ1 = this.m_bind_CARWAY_INPUT_KFZ1.trim();
		(<HTMLInputElement>document.getElementById("CARWAY_input_KFZ1")).innerHTML =this.m_bind_CARWAY_INPUT_KFZ1; 
		
		// Space
		if(keycode == 32)
		{
			(<HTMLInputElement>document.getElementById("CARWAY_input_KFZ2")).focus();
		}
		else
		{
			return this.onKeyDownText(keycode,(<HTMLInputElement>document.getElementById("CARWAY_input_KFZ1")).value,this.m_bind_CARWAY_INPUT_KFZ1);
		}
	}

	onKeyDownText2(keycode)
	{
		this.m_bind_CARWAY_INPUT_KFZ2 = this.m_bind_CARWAY_INPUT_KFZ2.trim();
		(<HTMLInputElement>document.getElementById("CARWAY_input_KFZ2")).innerHTML =this.m_bind_CARWAY_INPUT_KFZ2; 
		
		// Space
		if(keycode == 32)
		{
			(<HTMLInputElement>document.getElementById("CARWAY_input_KFZ2")).focus();
		}
		else
		{
			return this.onKeyDownText(keycode,(<HTMLInputElement>document.getElementById("CARWAY_input_KFZ2")).value,this.m_bind_CARWAY_INPUT_KFZ2);
		}
	}
	
	onKeyDownText(keycode,temp,bindVar)
	{
		let character = String.fromCharCode(keycode);
		
		// keycode:48 => delete 
		// keycode:8 => backspace 
		// Tab:9 => Tab
		if(keycode!=48 && keycode!=8 && keycode!=9)
		{
			// Buchstaben
			var regexBuchstaben = /^[A-z]+$/;   
		
			if (!regexBuchstaben.test(character)) 
			{
				// Zahl => Event unterbinden und Wert zurücksetzen
				bindVar = temp;
			
				return false;
			}
		}
		
		return true;
	}
	
	onKeyUp1(keycode)
	{
		if(this.m_bind_CARWAY_INPUT_KFZ1.length==3)
		{
			(<HTMLInputElement>document.getElementById("CARWAY_input_KFZ2")).focus();
		}
		
		this.m_bind_CARWAY_INPUT_KFZ1 = this.m_bind_CARWAY_INPUT_KFZ1.trim();
		(<HTMLInputElement>document.getElementById("CARWAY_input_KFZ1")).innerText =this.m_bind_CARWAY_INPUT_KFZ1; 
		
		this.onKeyUp();
	}
	
	onKeyUp2(keycode)
	{
		if(this.m_bind_CARWAY_INPUT_KFZ2.length==2)
		{
			(<HTMLInputElement>document.getElementById("CARWAY_input_KFZ3")).focus();
		}

		this.m_bind_CARWAY_INPUT_KFZ2 = this.m_bind_CARWAY_INPUT_KFZ2.trim();
		(<HTMLInputElement>document.getElementById("CARWAY_input_KFZ2")).innerText =this.m_bind_CARWAY_INPUT_KFZ2; 

		this.onKeyUp();
	}
  
	onKeyUp3(keycode)
	{
		this.onKeyUp();
	}

  	onKeyUp() 
  	{
		this.concatUserID();
		
		if(!WizardPage.m_static_bind_bSaveBlocked && !this.m_bind_CARWAY_UserSaved && this.m_bind_CARWAY_INPUT_KFZ1 && this.m_bind_CARWAY_INPUT_KFZ2 && this.m_bind_CARWAY_INPUT_KFZ3)
		{
			let promise = this.m_CARWAY_Model_Car_Provider.exists(this.m_CARWAY_INPUT_UserID).subscribe((aCARWAY_Model_Car:CARWAY_Model_Car) =>
			{
				promise.unsubscribe();

				this.m_CARWAY_Log_Provider.add("WizardPage onKeyUp","exists=>)"+aCARWAY_Model_Car);
				
				this.m_LoginCar = aCARWAY_Model_Car;

				if(aCARWAY_Model_Car && !WizardPage.m_static_bMessageShown)
				{
					WizardPage.m_static_bMessageShown = true;

					let alert = this.alertController.create({
						title: 'Login',
						message: `Das Kennzeichen ${this.m_CARWAY_Model_Car_Provider.getCarIDTextByString(this.m_CARWAY_INPUT_UserID)} wurde bereits registriert. Bitte geben Sie das Passwort ein.`,
						buttons: [
							{
							text:'OK',
							handler: data => 
							{
								WizardPage.m_static_bMessageShown = false;		
							}
						}]
						});
						alert.present();
				}
				this.switchToLogin(aCARWAY_Model_Car!=null);
			});
		}
	}  	
	
	switchToLogin(state:boolean)
	{
		this.m_bind_showLogin = state;

		if(state)
		{
			this.m_bind_login_text = 'Anmelden';  
			this.m_bindBackButton = "Abbrechen";
		}
		else
		{
			this.m_bind_login_text = 'Auto registrieren';
	
			if(this.m_bFlotte)
			{
				this.m_bindBackButton = "Abbrechen";
			}
			else
			{
				this.m_bindBackButton = "Zurück";
			}
		}

		
		if(state)
		{ 	
			this.slider.lockSwipes(true);
		}
		else
		{
			this.slider.lockSwipes(false);
		}
	}

  	takePasswort()
  	{
		this.m_bind_CARWAY_ShowValidationHintPasswort = false;
    	this.m_bind_CARWAY_Random_Password = this.generatePassword(2,3,3);

    	this.m_bind_CARWAY_INPUT_Password = this.m_bind_CARWAY_Random_Password;
    	this.m_bind_CARWAY_INPUT_PasswordBestaetigt = this.m_bind_CARWAY_Random_Password;
    
    	this.touchstart();
    
		setTimeout(() => 
		{
			this.touchend();
		},
		3000);
  	}

  	concatUserID()
  	{
		let userid:string = '';

		if(!this.m_bind_CARWAY_INPUT_KFZ1 && !this.m_bind_CARWAY_INPUT_KFZ2 && this.m_bind_CARWAY_INPUT_KFZ3<1)
		{
			this.m_bind_CARWAY_INPUT_LoginUrl = GlobalConstants.CARWAY_loginBaseUrl+'KENNZEICHEN';
			this.m_CARWAY_INPUT_UserID = '';
		}
		else 
		{
			if(this.m_bind_CARWAY_INPUT_KFZ1)
			{
				userid = this.m_bind_CARWAY_INPUT_KFZ1
			
				if(this.m_bind_CARWAY_INPUT_KFZ2)
				{
					userid += '-' + this.m_bind_CARWAY_INPUT_KFZ2;
					
					if(this.m_bind_CARWAY_INPUT_KFZ3>0)
					{
						userid += '_' + this.m_bind_CARWAY_INPUT_KFZ3;
					}
				}
			}

			userid = userid.toLowerCase();
			this.m_CARWAY_INPUT_UserID = userid;

			this.m_bind_CARWAY_INPUT_LoginUrl = GlobalConstants.CARWAY_loginBaseUrl + userid;
		}
	}

	onKeyUpPassword()
	{
		this.concatUserID();
	}
 
	touchstart()
	{
		this.m_bind_CARWAY_showPasswort = "text";    
	}
	
	touchend()
	{
		this.m_bind_CARWAY_showPasswort = "password";    
	}

  	generatePassword = function(numLc, numUc, numDigits) //numSpecial 
  	{
		numLc = numLc || 4;
		numUc = numUc || 4;
		numDigits = numDigits || 4;
		//numSpecial = numSpecial || 2;
	
	
		var lcLetters = 'abcdefghijklmnopqrstuvwxyz';
		var ucLetters = lcLetters.toUpperCase();
		var numbers = '0123456789';
		//var special = '!?=#*$@+-.';
	
		var getRand = function(values) {
		return values.charAt(Math.floor(Math.random() * values.length));
		}
	
		//+ Jonas Raoni Soares Silva
		//@ http://jsfromhell.com/array/shuffle [v1.0]
		function shuffle(o){ //v1.0
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
		};
	
		var pass = [];
		for(var i = 0; i < numLc; ++i) { pass.push(getRand(lcLetters)) }
		for( i = 0; i < numUc; ++i) { pass.push(getRand(ucLetters)) }
		for( i = 0; i < numDigits; ++i) { pass.push(getRand(numbers)) }
		//for( i = 0; i < numSpecial; ++i) { pass.push(getRand(special)) }
	
		return shuffle(pass).join('');
	}
}