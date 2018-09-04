import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ClienteService } from '../../services/domain/cliente.service';
import { EnderecoDTO } from './../../models/enderenco.dto';
import { StorageService } from '../../services/storage.service';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  pedido: PedidoDTO;
  items: EnderecoDTO[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public clienteService: ClienteService,
    public storage: StorageService,
    public cartService: CartService) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(resp => {
          this.items = resp['enderecos'];

          let cart = this.cartService.getCart();

          this.pedido = {
            cliente: { id: resp['id'] },
            enderecoDeEntrega: null,
            pagamento: null,
            itens: cart.items.map(x => { return { quantidade: x.quantidade, produto: { id: x.produto.id } } })
          }
        },
          error => {
            if (error.status === 403) {
              this.navCtrl.setRoot('HomePage');
            }
          })
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  nextPage(item: EnderecoDTO) {
    this.pedido.enderecoDeEntrega = { id: item.id };
    console.log(this.pedido);
  }

}
