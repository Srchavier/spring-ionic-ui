import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';
import { BrMaskerModule } from 'brmasker-ionic-3';

import { CidadeService } from './../../services/domain/cidade.service';
import { EstadoService } from './../../services/domain/estado.service';

@NgModule({
  declarations: [
    SignupPage,

  ],
  imports: [
    IonicPageModule.forChild(SignupPage),
    BrMaskerModule
  ],
  providers: [
    EstadoService,
    CidadeService
  ]
})
export class SignupPageModule { }
