# Meu Streaming

Aplicação estática responsiva em português para organizar filmes e séries, guardar favoritos no navegador e reunir canais gratuitos cuja autorização de transmissão foi documentada. Metadados não concedem direitos de reprodução. Os catálogos começam vazios: nenhuma fonte de transmissão é presumida ou inventada.

## Recursos

- Busca, filtros por gênero, idioma e tipo, ordenação e favoritos locais.
- Detalhes diferenciam reprodução direta autorizada, serviço oficial e ausência de fonte confirmada.
- A playlist M3U é gerada somente com canais aprovados e documentados.
- Layout para desktop e celular, com estados vazios e capa substituta original.

## Requisitos e comandos

Requisitos: Node.js 22 e pnpm 10 ou compatível com o lockfile v9. Na primeira instalação, execute `pnpm install`; depois, `pnpm install --frozen-lockfile`. Use `pnpm dev` para desenvolvimento e `pnpm lint`, `pnpm test`, `pnpm validate:data` e `pnpm build` para verificações.

## Estrutura

- `src/`: interface, estilos, tipos e utilitários.
- `public/data/catalog.json`: títulos; `public/data/channels.json`: canais.
- `public/iptv/index.m3u`: playlist gerada; `public/poster.svg`: capa substituta.
- `scripts/validate-data.mjs`: valida os dados e regenera a playlist.
- `tests/`: testes; `.github/workflows/pages.yml`: build e publicação.

## Cadastrar canais e títulos

Para um canal, adicione um registro em `channels` com `id`, `name`, `country`, `language`, `category`, `logo`, `streamUrl`, `officialWebsite`, `sourcePage`, `authorizationBasis`, `lastVerified` e `status`. Use `null` para valores opcionais desconhecidos e comece com `pending`. Só marque `approved` quando a fonte documentar a autorização pertinente à transmissão e à reprodução externa pretendida. Uma resposta HTTP não prova autorização nem funcionamento. Rode `pnpm validate:data` para validar e gerar `public/iptv/index.m3u`.

Para filmes/séries, use `items` em `catalog.json` e os campos tipados na interface: `id`, `title`, `type`, `synopsis`, `poster`, `backdrop`, `year`, `genres`, `originalLanguage`, `availableAudioLanguages`, `subtitleLanguages`, `sourceType`, `playbackUrl`, `officialUrl`, `sourcePage`, `authorizationBasis`, `lastVerified` e `availabilityStatus`. Confirme áudio dublado por uma fonte confiável. Só cadastre reprodução direta autorizada com uma URL de mídia, nunca uma página de detalhes. Verifique licenças de metadados e imagens e registre atribuição quando exigida. Não coloque credenciais ou chaves privadas no frontend.

## Conectar a um repositório GitHub existente

A pasta atual ainda não é um repositório Git. Para conectá-la a um repositório, primeiro crie ou escolha um repositório no GitHub e copie a URL HTTPS ou SSH exibida pelo próprio GitHub. Na pasta raiz deste projeto:

1. Inicialize o histórico local: `git init -b main`.
2. Adicione e confirme os arquivos: `git add .` e `git commit -m "Preparar Meu Streaming"`.
3. Configure o remote usando a URL copiada: `git remote add origin <URL-COPIADA-DO-GITHUB>`.
4. Antes de enviar, consulte o conteúdo remoto: `git fetch origin` e `git ls-remote --heads origin`.
5. Se o remote já tiver uma branch, descubra a branch principal na página do GitHub, confira `git log --oneline --all` e liste os arquivos remotos com `git ls-tree -r --name-only origin/<BRANCH-REMOTA>`. Inspecione os arquivos que coincidirem com os locais. Para integrar um histórico remoto independente, faça `git merge origin/<BRANCH-REMOTA> --allow-unrelated-histories`, resolva conflitos preservando o conteúdo que deve continuar existindo e confirme o merge. Não use `--force` para substituir conteúdo remoto.
6. Envie a branch: `git push -u origin main`.

Se o GitHub oferecer a opção, criar o repositório remoto vazio (sem README, licença ou `.gitignore` gerados pelo site) evita históricos paralelos. Ainda assim, confira o estado remoto antes do primeiro push. Nunca cole aqui tokens de acesso.

## GitHub Pages

O workflow `.github/workflows/pages.yml` executa ao enviar para `main` ou manualmente. Ele instala pelo lockfile com pnpm, roda lint, testes, validação e build, e só então publica o artefato. O Vite usa `/<nome-do-repositório>/` quando o Actions fornece `GITHUB_REPOSITORY=proprietário/repositório`; no desenvolvimento local usa `/`.

Depois de enviar o código:

1. Abra o repositório no GitHub e vá a **Settings → Pages**.
2. Em **Build and deployment → Source**, selecione **GitHub Actions**.
3. Em **Actions**, abra o workflow “Publicar GitHub Pages” e acompanhe a execução. Ela precisa concluir com sucesso para confirmar publicação.
4. A URL real do site aparece no deployment do ambiente `github-pages` e em **Settings → Pages**. Não considere o site publicado antes de confirmar essa URL.

As permissões do workflow são limitadas a `contents: read`, `pages: write` e `id-token: write`, necessárias para ler o checkout, enviar o artefato ao Pages e autenticar o deployment.

## VLC e limitações

No VLC para Windows, escolha **Mídia → Abrir fluxo de rede**, cole a URL publicada de `iptv/index.m3u` e reproduza. Compatibilidade e disponibilidade dependem da fonte e não são garantidas. O projeto não converte links de serviços comerciais. Sem backend, os dados são estáticos e os favoritos ficam no armazenamento local do navegador.

Se a playlist estiver vazia, não há canais aprovados. Se os dados não carregarem, confira os JSON e o console do navegador. Links temporários, formatos incompatíveis, bloqueios e mudanças do provedor podem impedir a reprodução.

## Licença

O código está sob MIT (ver `LICENSE`). A licença do código não se estende a dados, marcas, imagens ou obras de terceiros.
