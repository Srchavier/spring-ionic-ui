import { PagamentoDTO } from "./pagamento.dto";
import { RefDTO } from "./refs.dto";
import { ItemPedidoDTO } from "./itempedido.dto";

export interface PedidoDTO {
    cliente: RefDTO;
    enderecoDeEntrega: RefDTO;
    pagamento: PagamentoDTO;
    itens: ItemPedidoDTO[];
}