/**
 * Fronteira com o app hospedeiro (DSpace Angular).
 *
 * Mesma convenção da pasta `pipeline-status`: ao copiar esta feature para outra
 * instalação, este é o **único** arquivo que pode precisar de ajuste — todos os
 * outros importam apenas de dentro da própria pasta.
 */

/** Token da configuração da aplicação; a feature o injeta como opcional. */
export { APP_CONFIG } from '@dspace/config/app-config.interface';

/**
 * Host da API RDAPP (`evidencia_pipe`). A síntese mora no mesmo serviço da busca
 * semântica e da ingestão, então reusa a fonte já existente em vez de repetir a
 * URL — trocar de host continua sendo uma alteração num lugar só.
 */
export { EVIDENCIA_API_BASE } from '../../health-page/evidencia-api';

/**
 * Serviços de dados do DSpace usados para achar o PDF de origem de uma citação.
 * A síntese devolve o UUID do item; o arquivo em si mora no bundle ORIGINAL.
 */
export { BitstreamDataService } from '../../core/data/bitstream-data.service';
export { ItemDataService } from '../../core/data/item-data.service';
export { PaginatedList } from '../../core/data/paginated-list.model';
export { RemoteData } from '../../core/data/remote-data';
export { Bitstream } from '../../core/shared/bitstream.model';
export { Item } from '../../core/shared/item.model';
export { getFirstCompletedRemoteData } from '../../core/shared/operators';
