import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  loading:any;
  constructor(private loadingCtrl: LoadingController) {}

  show() {
    this.loading = this.loadingCtrl.create({
        content: 'Lade Daten...'
    });
    this.loading.present();
  }

  hide() {
    this.loading.dismiss();
  }
}
