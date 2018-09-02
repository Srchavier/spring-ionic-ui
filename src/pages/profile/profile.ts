import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { StorageService } from '../../services/storage.service';
import { ClienteService } from './../../services/domain/cliente.service';
import { ClienteDTO } from './../../models/Cliente.dto';
import { API_CONFIG } from './../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clinteService: ClienteService) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clinteService.findByEmail(localUser.email)
        .subscribe(resp => {
          this.cliente = resp;
          this.getImageIfExists();
        },
          error => { 
            if(error.status === 403){
              this.navCtrl.setRoot('HomePage');
            }
          })
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  getImageIfExists() {
    this.clinteService.getImageFroBucket(this.cliente.id)
      .subscribe(resp => {
        this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`
      },
        error => { });
  }

}