import { API_CONFIG } from './../../config/api.config';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ProdutoService } from './../../services/domain/produto.service';
import { ProdutoDTO } from './../../models/produto.dto';


@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService) {
  }


  ionViewDidLoad() {
    let categoria = this.navParams.get('categoria_id')
    this.produtoService.findByCategoria(categoria)
      .subscribe(resp => {
        this.items = resp['content'];
        this.loadImageUrls();
      },
        error => { });
  }

  loadImageUrls() {
    for (var i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(resp => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}.jpg`
        },
          error => { });
    }
  }

  showDetail(produto_id: string) {
    this.navCtrl.push('ProdutoDetailPage', { produto_id: produto_id })
  }
}
