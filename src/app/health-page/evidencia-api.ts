/**
 * Base da API do pipeline evidencIA/RDAPP (`evidencia_pipe`), usada pelas telas de
 * saúde da plataforma. Fonte única para a health page: a aba de Ingestão e o painel
 * de infraestrutura derivam os endpoints daqui.
 *
 * O CORS da API já libera esta origem. Trocar de host é uma alteração só aqui.
 */
export const EVIDENCIA_API_BASE = 'https://api.rdapp.comais.uft.edu.br';
