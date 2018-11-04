import { ToastController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
export class CARWAY_Util_Text
{
    public static addLineBreak(sFormattedText:string) : string
	{	
		let sFormatedAdressLineBreak:string = "";
		let nIndexOfComa:number = 0;

		while(1)
		{
            nIndexOfComa = sFormattedText.indexOf(",");
			
			if(nIndexOfComa<0)
			{
				sFormatedAdressLineBreak += sFormattedText;
				break;
			}
			
			sFormatedAdressLineBreak += sFormattedText.substring(0,nIndexOfComa)+"\n";
			sFormattedText = sFormattedText.substring(nIndexOfComa+2);
        } 
		
		return sFormatedAdressLineBreak;
	}
	
	public static showMessage(aToastController:ToastController,sMessage:string)
	{
		let toast = aToastController.create(
			{
				message: sMessage,
				duration: 3000,
			});

		toast.present();
	}

	public static sendEMail(aEmailComposer:EmailComposer,aToastController:ToastController,sText:string)
	{
		let eMail = 
		{
			to:'OliverFiebig@web.de',
			cc:[],
			bcc:[],
			attachment:[],
			subject:'Route 66 - Neue Fahrt ',
			body:sText,
			isHtml:false
		}

		if(!aEmailComposer.hasPermission())
		{
			aEmailComposer.requestPermission()
			.then(requestPermission =>
			{
				if(requestPermission)
				{
					let toast = aToastController.create(
						{
							message: "EMail Request OK",
							duration: 3000,
						});
					
					toast.present();  				
					
					aEmailComposer.open(eMail);
				}
				else
				{
					let toast = aToastController.create(
						{
						message: "EMail Request failed",
						duration: 3000,
						});
					
						toast.present();  				
					}
			});
		}
		else
		{
			let toast = aToastController.create(
				{
				message: "EMail Permission already OK",
				duration: 3000,
				});
			
				toast.present();
				
			aEmailComposer.open(eMail);
		}
	}
}