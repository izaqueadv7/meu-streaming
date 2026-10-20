# Meu Streaming

> Aplicação estática em português para navegar por filmes e séries, guardar favoritos no navegador e abrir páginas oficiais de canais. Streams só entram na playlist M3U quando a URL direta e a autorização para redistribuição estão documentadas. Um link público ou uma página oficial não são, por si só, licença para retransmitir.

## Recursos

- Busca, filtros por gênero e idioma, ordenação e favoritos locais.
- Cartões mostram capas próprias, título, ano, gênero e idiomas confirmados.
- Detalhes diferenciam mídia direta autorizada, reprodução em fonte licenciada, serviço oficial e conteúdo sem fonte de reprodução confirmada.
- A playlist é gerada pelo validador e inclui apenas canais `approved` com URL de stream e fundamento documentado.
- Datas de verificação documental são registradas em cada título/canal. Verificação documental não garante que o provedor esteja disponível naquele momento.

## Fontes cadastradas

Pesquisa e verificação documental realizadas em **2026-10-20**. Nenhum stream de canal foi testado em VLC e nenhum vídeo foi reproduzido automaticamente durante a checagem; os links abaixo foram conferidos nas páginas/fontes indicadas. As capas em `public/posters/` são arte SVG original do projeto, não imagens oficiais.

### TV ao vivo

| Canal | Situação no app | Destino oficial e base consultada | Compatibilidade e limite |
| --- | --- | --- | --- |
| TV Brasil | Somente página oficial | [WebTV da TV Brasil](https://tvbrasil.ebc.com.br/webtv/) e [termos da EBC](https://www.ebc.com.br/termos-de-uso-e-condicoes-gerais-do-portal-da-ebc). A emissora informa que direitos limitam a programação transmitida na web; o catálogo não república o player. | A página tem player web. Nenhuma URL de mídia para VLC/M3U foi confirmada. |
| TV Câmara | Somente página oficial | [Página ao vivo/incorporação](https://www.camara.leg.br/tv/aovivo/embed) e [termos de uso](https://www.camara.leg.br/tv/termos-de-uso/). A Câmara permite retransmissão independente das transmissões legislativas ao vivo sob CC BY 4.0, com atribuição e marca d'água preservada. A página de incorporação não é endereço de stream. | Página/iframe para navegador; a Câmara documenta H.264. Não foi verificada compatibilidade com VLC. |
| TV Senado | Somente página oficial | [Página oficial “Ao vivo”](https://www12.senado.leg.br/tv/programas/ao-vivo). Não foi encontrada licença geral para redistribuir o sinal. | Página web oficial; URL direta e compatibilidade VLC não confirmadas. |
| TV Justiça | Pendente | [Site institucional oficial](https://radioetvjustica.jus.br/). Não foi confirmada uma página estável de transmissão nem autorização para reprodução externa. | O registro não oferece um player confirmado. Não incluir na M3U. |

Nenhum destes canais tem `streamUrl` aprovado. Portanto `public/iptv/index.m3u` contém somente `#EXTM3U` até que uma fonte direta e a autorização correspondente sejam verificadas. Os links de canal na aplicação abrem os sites oficiais; eles não prometem reprodução em VLC.

### Filmes

| Título | Metadados | Reprodução | Direitos/idiomas |
| --- | --- | --- | --- |
| Elephants Dream (2006) | [Projeto oficial](https://orange.blender.org/background/) | [Registro específico no Internet Archive](https://archive.org/details/ElephantsDream) | A página oficial publica a obra sob CC BY 2.5 e permite reutilização/distribuição com atribuição ([direitos](https://orange.blender.org/page/2/)). Áudio original em inglês; legendas não confirmadas. |
| Sintel (2010) | [Blender Studio](https://studio.blender.org/projects/sintel/) | [Registro específico no Internet Archive](https://archive.org/details/Sintel) | Blender Foundation documenta CC BY 3.0 e exibição com créditos finais ([direitos](https://durian.blender.org/about/)). Áudio original em inglês; legenda em Português confirmada pela página oficial, sem confirmação de variante brasileira. |
| Tears of Steel (2012) | [Sobre o filme](https://mango.blender.org/about/) | [Publicação oficial do canal verificado Blender no YouTube](https://www.youtube.com/watch?v=OHOpb2fS-cM) | Blender Foundation documenta CC BY 3.0, com créditos finais mantidos. Áudio em inglês confirmado; arquivos `TOS-PT-BR.srt` e `TOS-PT-PT.srt` listados na [pasta oficial de legendas](https://download.blender.org/demo/movies/ToS/subtitles/). |

Os registros do Internet Archive acima são específicos de cada obra e foram cruzados com os sites oficiais da Blender Foundation. A mera presença de outro vídeo no Internet Archive não será tratada como prova de domínio público ou licença. Os três filmes abrem páginas que oferecem a reprodução licenciada/oficial; o catálogo não hospeda nem copia os arquivos de vídeo. Não foi confirmada dublagem em português para esses títulos. Nenhuma série com reprodução autorizada foi encontrada para este primeiro preenchimento.

## Dados e validação

- `public/data/catalog.json`: itens, metadados, idiomas, direitos e fontes.
- `public/data/channels.json`: canais, destino oficial, status, base de autorização, observações de compatibilidade e data.
- `public/posters/`: capas SVG originais do projeto.
- `public/iptv/index.m3u`: playlist gerada pelo validador; somente streams aprovados.
- `scripts/validate-data.mjs`: verifica campos, URLs, direitos mínimos, status e capas locais antes de gerar M3U.
- `tests/`: testes de filtros, links na interface e exclusão de canais pendentes da playlist.

Requisitos: Node.js 22 e pnpm 10 ou compatível com o lockfile. Na primeira instalação execute `pnpm install`; depois `pnpm install --frozen-lockfile`. Para desenvolver, use `pnpm dev`. Para validar, execute:

```sh
pnpm lint
pnpm test
pnpm validate:data
pnpm build
```

## Adicionar novos canais e títulos

Para cadastrar um canal, registre a página oficial e a fonte dos termos. Use `official-only` se o usuário deve seguir para o player oficial e não houver URL de mídia direta autorizada; use `pending` enquanto faltarem evidências. Somente use `approved` quando a transmissão externa pretendida estiver claramente permitida e o stream direto tiver sido documentado. Rode `pnpm validate:data`; o script gera a M3U a partir dos canais aprovados.

Para cadastrar um título, forneça fonte de metadados, página de direitos, origem da capa, idioma original, áudio e legendas apenas quando confirmados, destino oficial/licenciado e fundamento de autorização. `licensed` representa reprodução numa página de terceiro cuja licença da obra foi verificada; `official` representa o canal/serviço da fonte oficial; `direct` exige URL direta de mídia e fundamento; `info-only` não pode dizer que há reprodução autorizada. Não coloque credenciais ou chaves privadas no frontend.

## GitHub Pages

O repositório de código é [izaqueadv7/meu-streaming](https://github.com/izaqueadv7/meu-streaming). O workflow `.github/workflows/pages.yml` publica após push para `main` ou execução manual. Ele roda lint, testes, validação de dados e build antes do deploy. O Vite usa `/<nome-do-repositório>/` quando o GitHub Actions define `GITHUB_REPOSITORY=proprietário/repositório`, e `/` no desenvolvimento local. O workflow usa permissões mínimas `contents: read`, `pages: write` e `id-token: write`.

Para conferir a publicação, abra **Settings → Pages**, selecione **GitHub Actions** como fonte e verifique a última execução de **Publicar GitHub Pages**. Só considere o site publicado depois do workflow terminar com sucesso e da URL real aparecer no ambiente `github-pages` ou em Settings → Pages.

## VLC e limitações

No VLC para Windows, selecione **Mídia → Abrir fluxo de rede** e cole a URL publicada de `iptv/index.m3u`. No estado atual não há stream de canal aprovado, então a M3U contém apenas o cabeçalho. Compatibilidade e disponibilidade dependem da fonte; um destino web/iframe/YouTube não é uma URL M3U e não tem compatibilidade VLC presumida. Sem backend, os dados são estáticos e os favoritos ficam no armazenamento local do navegador.

## Licença

O código está sob MIT (ver `LICENSE`). A licença do código não se estende a dados, marcas, filmes ou outros conteúdos de terceiros. Respeite a licença e os créditos exigidos por cada obra.
