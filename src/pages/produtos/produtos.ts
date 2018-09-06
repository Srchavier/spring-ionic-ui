import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { ProdutoService } from './../../services/domain/produto.service';
import { ProdutoDTO } from './../../models/produto.dto';
import { API_CONFIG } from './../../config/api.config';


@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[] = [];

  page: number = 0;
  linesPerPage: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadCtrl: LoadingController) {
  }


  ionViewDidLoad() {
    this.loadData();
  }

  private loadData() {
    let categoria = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(categoria, this.page, 10)
      .subscribe(resp => {
        let start = this.items.length;
        this.items = this.items.concat(resp['content']);
        console.log(this.items);
        console.log(this.page);
        loader.dismiss();
        this.loadImageUrls(start, this.items.length - 1);
      }, error => {
        loader.dismiss();
      });
  }

  loadImageUrls(start: number, end: number) {
    for (var i = start; i < end; i++) {
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

  presentLoading() {
    let loader = this.loadCtrl.create({
      content: "Aguarde..."
    })
    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }
}
