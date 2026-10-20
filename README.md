# Meu Streaming

Aplicação estática em português para explorar filmes e séries gratuitos de fontes oficiais, guardar favoritos no navegador e abrir páginas oficiais de canais. O catálogo não hospeda nem extrai streams. O player incorporado usa o player público oficial do YouTube; outras fontes abrem sua página original.

## Recursos

- Busca, filtros por gênero e idioma, ordenação e favoritos locais.
- Cartões mostram capas vetoriais originais do projeto, título, ano, gêneros e idiomas confirmados.
- A ficha de cada título mostra sinopse, fonte de reprodução, licença, atribuição exigida, origem dos metadados, observações de idioma e data de verificação.
- A reprodução incorporada tem um link de saída para o player original e uma mensagem de contingência. Fontes sem permissão pública confirmada aparecem apenas como informativas.
- A playlist M3U é gerada somente com canais que tenham URL direta, permissão documentada para redistribuição e compatibilidade verificável.

## Filmes e fontes

Pesquisa documental e checagem de links: **2026-10-20**. As páginas de reprodução listadas abaixo responderam HTTP 200, inclusive os endereços padrão do player incorporado do YouTube. Isso confirma a resposta da página, não que o vídeo tenha sido decodificado ou assistido. Nenhum vídeo foi reproduzido visualmente no navegador nem testado no VLC nesta verificação. O navegador de teste não pôde ser controlado nesta sessão. A aplicação, portanto, sempre mantém um botão para abrir a fonte original.

As capas são desenhos vetoriais originais em `public/posters/`; não são pôsteres promocionais nem imagens de terceiros. Os campos de áudio e legendas permanecem vazios quando a fonte não confirma a informação. Nenhuma dublagem em português foi presumida.

| Título | Fonte oficial/licenciada | Direitos e atribuição | Idioma e reprodução |
| --- | --- | --- | --- |
| Elephants Dream (2006) | [Projeto](https://orange.blender.org/background/) · [Internet Archive](https://archive.org/details/ElephantsDream) | [CC BY 2.5](https://orange.blender.org/page/2/); Blender Foundation, com créditos finais na exibição integral. | Áudio em inglês; página respondeu HTTP 200; reprodução real não testada. |
| Sintel (2010) | [Blender Studio](https://studio.blender.org/projects/sintel/) · [Internet Archive](https://archive.org/details/Sintel) | [CC BY 3.0](https://durian.blender.org/about/); Blender Foundation e créditos finais. | Áudio em inglês; legenda Português confirmada, sem variante brasileira confirmada; página respondeu HTTP 200; reprodução real não testada. |
| Tears of Steel (2012) | [Projeto](https://mango.blender.org/about/) · [YouTube oficial](https://www.youtube.com/watch?v=OHOpb2fS-cM) | [CC BY 3.0](https://mango.blender.org/about/); Blender Foundation e créditos finais. | Áudio em inglês; arquivos de legendas PT-BR e PT-PT na [pasta oficial](https://download.blender.org/demo/movies/ToS/subtitles/); páginas do player responderam HTTP 200; reprodução real não testada. |
| Big Buck Bunny (2008) | [Projeto](https://studio.blender.org/projects/big-buck-bunny/) · [YouTube oficial](https://www.youtube.com/watch?v=aqz-KE-bpKQ) | [CC BY 3.0](https://peach.blender.org/about/); Blender Foundation. Na exibição integral, preservar o rolo completo de créditos finais. | A documentação inicial menciona a intenção de história sem falas, mas não confirma a mixagem final. YouTube e página de incorporação responderam HTTP 200; reprodução real não testada. Os downloads diretos listados pela Blender estão em ZIP, não são streams HTML5/VLC. |
| Spring (2019) | [Projeto](https://studio.blender.org/projects/spring/) · [YouTube oficial](https://www.youtube.com/watch?v=WhWc3b3KhnY) | [CC BY 4.0](https://studio.blender.org/projects/spring/pages/about/); © Blender Foundation | cloud.blender.org/spring. | A página oficial confirma que não há diálogos falados. YouTube e página de incorporação responderam HTTP 200; reprodução real não testada. |
| Caminandes: Llamigos (2016) | [Projeto](https://studio.blender.org/projects/caminandes-3/) · [YouTube oficial](https://www.youtube.com/watch?v=SkVqJ1SGeL0) | A página do filme informa Creative Commons; os [termos do Blender Studio](https://studio.blender.org/terms-and-conditions/) definem CC BY 4.0 como padrão de conteúdo digital, salvo exceção indicada. Atribuição: Blender Foundation | studio.blender.org. | Áudio/idioma falado não confirmado. Páginas YouTube e de incorporação responderam HTTP 200; reprodução real não testada. |
| Caminandes: Gran Dillama (2013) | [Projeto](https://studio.blender.org/projects/caminandes-2/) · [Blender Open Movies no PeerTube](https://video.blender.org/w/x3QKwgFXGZQ7yvCTD2wHJA) | [Termos do Blender Studio](https://studio.blender.org/terms-and-conditions/): CC BY 4.0 salvo exceção indicada. Atribuição: Blender Foundation | studio.blender.org. | Áudio/idioma falado não confirmado. Página oficial PeerTube respondeu HTTP 200; reprodução real não testada. |
| Glass Half (2015) | [Projeto](https://studio.blender.org/projects/glass-half/) · [YouTube oficial](https://www.youtube.com/watch?v=lqiN98z6Dak) | [CC BY 3.0](https://studio.blender.org/projects/glass-half/pages/licensing/); (CC) Blender Foundation | studio.blender.org. | Os créditos confirmam atores de voz, mas não identificam o idioma da faixa. YouTube e página de incorporação responderam HTTP 200; reprodução real não testada. |
| Cosmos Laundromat: First Cycle (2015) | [Projeto](https://studio.blender.org/projects/cosmos-laundromat/) · [YouTube oficial](https://www.youtube.com/watch?v=Y-rmzh0PI3c) | O projeto declara licença permissiva; [termos do Blender Studio](https://studio.blender.org/terms-and-conditions/) definem CC BY 4.0 como padrão, salvo exceção indicada. Atribuição: Blender Foundation | studio.blender.org. | Idioma e legendas do filme não confirmados. YouTube e página de incorporação responderam HTTP 200; reprodução real não testada. |
| Coffee Run (2020) | [Projeto](https://studio.blender.org/projects/coffee-run/) · [YouTube oficial](https://www.youtube.com/watch?v=PVGeM40dABA) | [CC BY 4.0](https://studio.blender.org/projects/coffee-run/pages/licensing/); (CC) Blender Foundation | studio.blender.org. | Idioma/diálogos e legendas não confirmados. YouTube e página de incorporação responderam HTTP 200; reprodução real não testada. |
| Charge (2022) | [Projeto](https://studio.blender.org/projects/charge/) · [YouTube oficial](https://www.youtube.com/watch?v=UXqq0ZvbOnk) | O projeto é apresentado como Open Movie; [termos do Blender Studio](https://studio.blender.org/terms-and-conditions/) definem CC BY 4.0 como padrão, salvo exceção indicada. Atribuição: Blender Foundation | studio.blender.org. | Idioma e legendas não confirmados. YouTube e página de incorporação responderam HTTP 200; reprodução real não testada. |
| Sprite Fright (2021) | [Projeto/licença](https://studio.blender.org/projects/sprite-fright/pages/about/) · [YouTube oficial](https://www.youtube.com/watch?v=_cMxraX_5RE) | A página oficial declara literalmente **Creative Commons Attribution 1.0** para o projeto e ressalva itens marcados como copyrighted. Atribuição: Blender Foundation | studio.blender.org. | Idioma não confirmado. YouTube e página de incorporação responderam HTTP 200; reprodução real não testada. O catálogo usa apenas a publicação final do canal oficial, não ativos de produção. |
| Wing It! (2023) | [Projeto](https://studio.blender.org/projects/wing-it/) · [YouTube oficial](https://www.youtube.com/watch?v=u9lj-c29dxI) | [CC BY 4.0](https://studio.blender.org/projects/wing-it/pages/licensing/); (CC) Blender Foundation | studio.blender.org. | Idioma e legendas não confirmados. YouTube e página de incorporação responderam HTTP 200; reprodução real não testada. |
| Singularity (2026) | [Projeto](https://studio.blender.org/projects/singularity/) · [YouTube oficial](https://www.youtube.com/watch?v=l5OZu-IrXpw) | [CC BY 4.0](https://studio.blender.org/projects/singularity/pages/licensing/); (CC) Blender Foundation | studio.blender.org. | A página oficial confirma que não há diálogos falados. YouTube e página de incorporação responderam HTTP 200; reprodução real não testada. |
| Agent 327: Operation Barbershop (2017) | [Página oficial com opção de assistir](https://studio.blender.org/projects/agent-327/) | [CC BY-ND](https://studio.blender.org/blog/agent-327-film-file-released-as-cc-by-nd/) — a página não informa a versão. Atribua Blender Foundation, indique a licença e não distribua adaptações. | Idioma não confirmado. Página do projeto respondeu HTTP 200; reprodução real não testada. |
| Hero (2018) — **pendente** | [Projeto](https://studio.blender.org/projects/hero/) · [vídeo publicado pelo canal Blender](https://www.youtube.com/watch?v=pKmSdY56VtY) | A descrição do vídeo refere Creative Commons para assinantes do Blender Cloud. Não foi confirmada autorização pública clara para a obra completa; por isso aparece apenas como fonte informativa, sem player incorporado ou alegação de reprodução autorizada. | Página YouTube respondeu HTTP 200. Idioma e reprodução não confirmados. |

Não foi cadastrada uma série sem uma fonte autorizada confirmada. Não foram usados filmes comerciais conhecidos só para aumentar a lista. A mera presença de uma obra no Internet Archive não foi tratada como prova de domínio público.

## TV ao vivo e M3U

| Canal | Tipo de fonte | O que foi confirmado | Situação |
| --- | --- | --- | --- |
| TV Brasil | [WebTV oficial](https://tvbrasil.ebc.com.br/webtv/) com player na página | A EBC diz que só parte da programação vai à web por restrições de direitos; documentação da ouvidoria informa restrições a retransmissão externa sem contrato. | Abrir fonte oficial; sem URL M3U. |
| TV Câmara | [Página oficial de incorporação](https://www.camara.leg.br/tv/aovivo/embed) | Os [termos oficiais](https://www.camara.leg.br/tv/termos-de-uso/) autorizam retransmissão independente **das atividades legislativas ao vivo** sob CC BY 4.0, com marca d'água preservada. A página/iframe não é endereço direto de mídia. | Abrir player oficial; sem URL direta compatível com VLC documentada. |
| TV Senado | [Página oficial Ao Vivo](https://www12.senado.leg.br/tv/programas/ao-vivo) com transmissões/players incorporados | O Senado informa transmissões pela internet de até oito eventos simultâneos, mas não foi localizada autorização geral de redistribuição do sinal. | Abrir fonte oficial; sem URL M3U. |
| TV Justiça | [Site institucional](https://radioetvjustica.jus.br/) | Não foi confirmada página estável de player nem autorização de reprodução externa. | Pendente; sem M3U. |

`public/iptv/index.m3u` contém apenas o cabeçalho `#EXTM3U`. A interface avisa explicitamente que a playlist atual não tem canais. Nenhuma URL de canal está aprovada para VLC; um site, iframe ou vídeo do YouTube não é automaticamente um stream M3U.

## Dados e validação

- `public/data/catalog.json`: metadados, idiomas, licenças, atribuições, links, modo e checagem das fontes.
- `public/data/channels.json`: páginas oficiais, situação de autorização e observações técnicas dos canais.
- `public/posters/`: capas vetoriais originais para os títulos cadastrados.
- `public/iptv/index.m3u`: gerada pelo validador; somente canais aprovados com URL direta e autorização.
- `scripts/validate-data.mjs`: verifica schema, links, licenças/atribuições, capas, modos de reprodução e gera a M3U.
- `tests/`: filtros, navegação, reprodução incorporada/fonte original, estado informativo pendente e playlist.

Requisitos: Node.js 22 e pnpm 10 ou compatível com o lockfile. Depois da primeira instalação, use `pnpm install --frozen-lockfile`. Para desenvolver e validar:

```sh
pnpm dev
pnpm lint
pnpm test
pnpm validate:data
pnpm build
```

## Regras para adicionar fontes

Para filmes/séries, registre a fonte oficial de metadados, a página de direitos, a licença, o texto de atribuição, a origem da capa e os idiomas apenas quando confirmados. Use o player oficial em embed somente com URL pública oficial; mantenha link para a página original. Nunca transforme um link de página em URL direta, não extraia mídia privada e não contorne DRM/login. Se a licença pública ou o player não forem confirmados, use `info-only` e `unverified`.

Para canais, use `official-only` quando houver apenas página/player e `pending` quando faltarem evidências. Só use `approved` se a URL direta oficial, a permissão de redistribuição para a finalidade pretendida e a compatibilidade estiverem verificadas. Não inclua página/iframe/YouTube na M3U.

## GitHub Pages

O repositório é [izaqueadv7/meu-streaming](https://github.com/izaqueadv7/meu-streaming). O workflow `.github/workflows/pages.yml` publica após push em `main` ou execução manual. O workflow roda lint, testes, validação de dados e build antes do deploy. O Vite usa `/<nome-do-repositório>/` em GitHub Actions e `/` no desenvolvimento local. As permissões são mínimas: `contents: read`, `pages: write` e `id-token: write`.

## Licença do código

O código está sob MIT (ver `LICENSE`). Essa licença não se estende às obras, marcas ou filmes de terceiros. Cada título mantém sua própria licença e atribuição na ficha e nesta lista.