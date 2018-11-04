import { LoadingController, Loading } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()

export class LoadingService 
{
	private static m_Loading:Loading = null;
	private static m_sMessage:string = "";
  
	constructor(private loadingCtrl: LoadingController) 
	{

	}

	public show(message?:string) 
	{
		LoadingService.m_sMessage = message;

		LoadingService.m_Loading = this.loadingCtrl.create
		({
			content: message
		});

		LoadingService.m_Loading.present();
  	}

	public hide() 
	{
		LoadingService.m_Loading.dismiss();
	}

	public setMessage(sMessage:string)
	{
		LoadingService.m_sMessage = sMessage;
		LoadingService.m_Loading.setContent(LoadingService.m_sMessage)
	}

	public addMessage(sMessage:string)
	{
		LoadingService.m_sMessage = LoadingService.m_sMessage + sMessage;
		LoadingService.m_Loading.setContent(LoadingService.m_sMessage);
	}
}