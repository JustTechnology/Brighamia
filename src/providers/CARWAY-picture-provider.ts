import { CARWAY_Util_Text } from './../util/CARWAY-util-text';
import { CARWAY_Model_Car_Provider } from './CARWAY-model-car-provider';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertController, ToastController } from 'ionic-angular';
import { CARWAY_Log_Provider } from './CARWAY-log-provider';
import { storage } from 'firebase';
import { GlobalConstants } from './constants-provider';
import { UrlResolverCtor } from '@angular/compiler';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';

@Injectable()
export class CARWAY_Picture_Provider 
{
	constructor(
		private camera:Camera,
		private alertController:AlertController,
		private m_CARWAY_Log_Provider:CARWAY_Log_Provider,
		private m_CARWAY_Model_Car_Provider:CARWAY_Model_Car_Provider,
		private m_ImagePicker: ImagePicker,
		private m_ToastController:ToastController,
		private m_File:File)
	{
		console.log('construct CARWAY_Picture_Provider');
		this.m_CARWAY_Log_Provider.add("CARWAY_Picture_Provider","construct CARWAY_Picture_Provider");}

	public getImageFromCamera() : Promise<string>
	{
		this.m_CARWAY_Log_Provider.add("CARWAY_Picture_Provider","cameraFoto()");
		
		return new Promise((resolve,reject) =>
		{
			const s: CameraOptions = 
			{
				quality: 100,
				targetHeight: 400,
				targetWidth: 600,
				destinationType: this.camera.DestinationType.DATA_URL,
				encodingType: this.camera.EncodingType.JPEG,
				mediaType: this.camera.MediaType.PICTURE
			}
			
			this.camera.getPicture(s).then((imageData) => 
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_Picture_Provider","cameraFoto(=>) Success:"+imageData);
				
				const image = 'data:image/jpeg;base64,' + imageData;
				
				resolve(image);
			}, 
			(err) => 
			{
				this.m_CARWAY_Log_Provider.add("CARWAY_Picture_Provider","cameraFoto(=>) Error:"+err);
				reject();
			});
		});
	
		/*
		let prompt = this.alertController.create(
			{
				title: 'Foto hinzufügen',
				cssClass: 'myalert',
				inputs : [
				{
					type:'radio',
					label:'Foto auswählen',
					value:'Select'
				}
				,
				{
					type:'radio',
					label:'Neues Foto aufnehmen',
					value:'Camera'
				}
				]
				,
				buttons : [
				{
					text: "Abbrechen",
					handler: data => 
					{

					}
				}
				,
				{
					text: "OK",
					handler: data => 
					{
						if(data=="Select")
						{
							this.m_CARWAY_Log_Provider.add("CARWAY_Picture_Provider","Select");
							return this.galleryFoto();
						}
						else if(data="Camera")
						{
							this.m_CARWAY_Log_Provider.add("CARWAY_Picture_Provider","camera");
							return this.cameraFoto()
						}
					}
				}
			]
			});
			prompt.present()*/;
	}

	public getImageFromGallery() : Promise<string>
	{
		this.m_CARWAY_Log_Provider.add("CARWAY_Picture_Provider","galleryFoto");
		
		return new Promise((resolve,reject) =>
		{
			const aImagePickerOptions:ImagePickerOptions = {
			
				maximumImagesCount: 1,
				width:600,
				height:400
			};
			CARWAY_Util_Text.showMessage(this.m_ToastController,"getImageFromGallery");

			this.m_ImagePicker.getPictures(aImagePickerOptions)
			.then((result) => 
			{
				CARWAY_Util_Text.showMessage(this.m_ToastController,"getImageFromGallery SUCCESS");
				this.m_CARWAY_Log_Provider.add("CARWAY_Picture_Provider","getPictures");
				for (var i = 0; i < result.length; i++) 
				{
					this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`URI(${result[i]})`);
					resolve(result[i]);
				}
			}, 
			(err) => {

				CARWAY_Util_Text.showMessage(this.m_ToastController,"getImageFromGallery ERROR:"+err);

			 });
		});
	}

	public saveUserServicePictureFile(uriUserPicture:string,sCarID:string,nDayIndex:number,nServiceIndex:number,nServiceItemIndex:number,nPictureIndex:number)
    {
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`saveUserServicePictureFile(${uriUserPicture})`);
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`saveUserServicePictureFile(${GlobalConstants.CARWAY_baseURL_Route}/${sCarID}/Service/${nDayIndex}/${nServiceIndex}/${nServiceItemIndex}/ServicePicture_${nPictureIndex}/)`);

        const pictures = storage().ref(`${GlobalConstants.CARWAY_baseURL_Route}/${sCarID}/Service/${nDayIndex}/${nServiceIndex}/${nServiceItemIndex}/ServicePicture_${nPictureIndex}`);

		this.makeFileIntoBlob(uriUserPicture)
		.then(resolve=>
			{
				let a:any = resolve;
				a.imgBlob;

				this.m_CARWAY_Log_Provider.add("makeFileIntoBlob ",`resolve!!!!!!!!!!!(${JSON.stringify(resolve)})`);
				pictures.put(resolve)
			.then(success=>
				{
					this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`savePicture(OK:${success})`);
				})
				.catch(error=>
				{
					this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`savePicture(Error:${error})`);
				}
				);
	
		});
    } 

	public saveUserServicePictureCamera(sUserPicture:string,sCarID:string,nDayIndex:number,nServiceIndex:number,nServiceItemIndex:number,nPictureIndex:number)
    {
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`saveUserServicePictureCamera(${sUserPicture})`);
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`saveUserServicePictureCamera(${GlobalConstants.CARWAY_baseURL_Route}/${sCarID}/Service/${nDayIndex}/${nServiceIndex}/${nServiceItemIndex}/ServicePicture_${nPictureIndex}/)`);

		this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`setUserPicture(${sUserPicture})`);

        const pictures = storage().ref(`${GlobalConstants.CARWAY_baseURL_Route}/${sCarID}/Service/${nDayIndex}/${nServiceIndex}/${nServiceItemIndex}/ServicePicture_${nPictureIndex}`);
		pictures.putString(sUserPicture,'data_url')
		.then(success=>
		{
			this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`savePicture(OK:${success})`);
			
		})
		.catch(error=>
		{
			this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`savePicture(Error:${error})`);
		}
		);
    } 

	public saveUserCarPicture(sUserPicture:string,sCarID:string)
    {
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`setUserPicture(${sUserPicture})`);

        const pictures = storage().ref(`${GlobalConstants.CARWAY_baseURL_Route}/${sCarID}/`);
        pictures.putString(sUserPicture, 'data_url'); 
	}

	public getDownloadPictureUrl(sCarID:string,nDayIndex:number,nServiceIndex:number,nServiceItemIndex:number,nPictureIndex:number) : Promise<any>
	{
        const pictures = storage().ref(`${GlobalConstants.CARWAY_baseURL_Route}/${sCarID}/Service/${nDayIndex}/${nServiceIndex}/${nServiceItemIndex}/ServicePicture_${nPictureIndex}`);
		return pictures.getDownloadURL();
	}

	makeFileIntoBlob(_imagePath) {
		// INSTALL PLUGIN - cordova plugin add cordova-plugin-file
		return new Promise((resolve, reject) => {
		  let fileName = "";
		  this.m_File
			.resolveLocalFilesystemUrl(_imagePath)
			.then(fileEntry => {
			  let { name, nativeURL } = fileEntry;
	
			  // get the path..
			  let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
	
			  fileName = name;
	
			  // we are provided the name, so now read the file into a buffer
			  return this.m_File.readAsArrayBuffer(path, name);
			})
			.then(buffer => {
			  // get the buffer and make a blob to be saved
			  let imgBlob = new Blob([buffer], {
				type: "image/jpeg"
			  });
			  

			  // pass back blob and the name of the file for saving
			  // into fire base
			  resolve(
				imgBlob
			);
			})
			.catch(e => reject(e));
		});
	  }
	  
	public deletePicture(sCarID:string,nDayIndex:number,nServiceIndex:number,nServiceItemIndex:number,nPictureIndex:number) 
	{
        this.m_CARWAY_Log_Provider.add("CARWAY_Model_Car_Provider",`deletePicture(${nPictureIndex})`);
		const pictures = storage().ref(`${GlobalConstants.CARWAY_baseURL_Route}/${sCarID}/Service/${nDayIndex}/${nServiceIndex}/${nServiceItemIndex}/ServicePicture_${nPictureIndex}`);
		pictures.delete();
	}
}

