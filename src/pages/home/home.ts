import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';

import { CredenciasDTO } from '../../models/credencias.dto';
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

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }
  
  ionViewDidEnter() {
    this.auth.refreshToken()
      .subscribe(resp => {
        this.auth.successfulLogin(resp.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage')
      },
        error => { })
  }

  login() {
    this.auth.authenticate(this.creds)
      .subscribe(resp => {
        this.auth.successfulLogin(resp.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage')
      },
        error => { })
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

}
