import { ClienteService } from './../../services/domain/cliente.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { PedidoDTO } from '../../models/pedido.dto';
import { CartItem } from './../../models/cart-item';
import { EnderecoDTO } from './../../models/enderenco.dto';
import { ClienteDTO } from './../../models/cliente.dto';
import { CartService } from '../../services/domain/cart.service';
import { PedidoService } from '../../services/domain/pedido.service';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cartItems: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  codigoPedido: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cartService: CartService,
    public clienteService: ClienteService,
    public pedidoService: PedidoService,
    public loadCtrl: LoadingController) {
    this.pedido = this.navParams.get('pedido');
  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items;
    let loader = this.presentLoading();
    this.clienteService.findById(this.pedido.cliente.id)
      .subscribe(resp => {
        this.cliente = resp as ClienteDTO;
        loader.dismiss();
        this.endereco = this.findEndereco(this.pedido.enderecoDeEntrega.id, resp['enderecos']);
      },
        error => {
          loader.dismiss();
          this.navCtrl.setRoot('homePage');
        })
  }

  private findEndereco(id: string, list: EnderecoDTO[]): EnderecoDTO {
    let position = list.findIndex(x => x.id == id);
    return list[position];
  }

  total() {
    return this.cartService.total();
  }

  back() {
    this.navCtrl.setRoot('CartPage');
  }

  home() {
    this.navCtrl.setRoot('CategoriasPage');
  }

  checkout() {
    let loader = this.presentLoading();
    this.pedidoService.insert(this.pedido)
      .subscribe(resp => {
        this.cartService.createOrClearCart();
        loader.dismiss();
        this.codigoPedido = this.extractId(resp.headers.get('location'));
      },
        error => {
          loader.dismiss();
          if (error.status == 403) {
            this.navCtrl.setRoot('HomePage')
          }
        })
  }

  private extractId(location: string): string {
    let position = location.lastIndexOf('/');
    return location.substring(position + 1, location.length);
  }

  private presentLoading() {
    let loader = this.loadCtrl.create({
      content: "Aguarde..."
    })
    loader.present();
    return loader;
  }
}
