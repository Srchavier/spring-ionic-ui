import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';

import { CredenciasDTO } from './../../models/Credencias.dto';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredenciasDTO = {
    email: '',
    senha: ''
  };

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public auth: AuthService) {
  }

  login() {
    this.auth.authenticate(this.creds)
      .subscribe(resp => {
        console.log(resp.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage')
      },
        error => { })
  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

}
