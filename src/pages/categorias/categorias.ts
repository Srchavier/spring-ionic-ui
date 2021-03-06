import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { API_CONFIG } from './../../config/api.config';
import { CategoriaDTO } from '../../models/categoria.dto';
import { CategoriaService } from './../../services/domain/categoria.service';

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {

  items: CategoriaDTO[];
  bucketUrl = API_CONFIG.bucketBaseUrl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public categoriaService: CategoriaService) {
  }

  ionViewDidLoad() {
    this.categoriaService.findAll()
      .pipe()
      .subscribe(resp => {
        this.items = resp;
      },
        error => {
        });
  }

  showProdutos(categoria_id: string) {

    this.navCtrl.push('ProdutosPage', { categoria_id: categoria_id });
  }

}
