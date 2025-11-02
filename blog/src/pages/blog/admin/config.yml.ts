// Exemplo: se seu config ficou em <raiz do repo>/blog/admin/config.yml
// ajuste o caminho relativo conforme a sua árvore:
import raw from '../../../../blog/admin/config.yml?raw';

export const GET = async () => {
  return new Response(raw, {
    headers: { 'Content-Type': 'text/yaml; charset=utf-8' },
  });
};
