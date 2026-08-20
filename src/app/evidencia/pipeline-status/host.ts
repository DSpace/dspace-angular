/**
 * Fronteira com o app hospedeiro (DSpace Angular).
 *
 * Ao copiar esta pasta para outra instalação, este é o **único** arquivo que pode
 * precisar de ajuste — todos os outros importam apenas de dentro da própria pasta.
 * Ver `CONTRACT.md`, seção "Host seam", para onde cada símbolo vive em DSpace 8/9/10
 * e para o plano B quando a instalação não tiver a diretiva de botão desabilitado.
 */

/** Forma acessível de desabilitar botão no DSpace (mantém o elemento focável). */
export { BtnDisabledDirective } from '../../shared/btn-disabled.directive';

/** Token da configuração da aplicação; a feature o injeta como opcional. */
export { APP_CONFIG } from '@dspace/config/app-config.interface';
