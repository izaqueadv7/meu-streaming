import { afterEach, describe, it, expect, vi } from 'vitest';
import { createElement, act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from '../src/App';

let host: HTMLDivElement;
let root: Root;

afterEach(() => {
  act(() => root?.unmount());
  vi.restoreAllMocks();
  host?.remove();
});

const renderApp = async (catalog: unknown = { items: [] }, channels: unknown = { channels: [] }) => {
  vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => Promise.resolve({
    json: async () => url.includes('catalog') ? catalog : channels,
  })));
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  await act(async () => {
    root.render(createElement(App));
    await Promise.resolve();
  });
};

describe('interface', () => {
  it('abre navegação e estado vazio do catálogo', async () => {
    await renderApp();
    expect(host.textContent).toContain('Histórias que');
    await act(async () => [...host.querySelectorAll('nav button')].find(button => button.textContent?.includes('Filmes'))?.click());
    expect(host.textContent).toContain('CATÁLOGO PESSOAL');
    expect(host.textContent).toContain('Nada por aqui ainda');
  });

  it('navega para canais e mostra estado sem stream aprovado', async () => {
    await renderApp();
    await act(async () => [...host.querySelectorAll('nav button')].find(button => button.textContent?.includes('TV ao vivo'))?.click());
    expect(host.textContent).toContain('Nenhuma fonte cadastrada');
    expect(host.textContent).toContain('Copiar playlist M3U');
  });

  it('exibe capa, metadados e a fonte autorizada do título', async () => {
    const movie = {
      id: 'sintel', title: 'Sintel', type: 'movie', synopsis: 'Uma busca por um dragão.', poster: 'posters/sintel.svg', posterSource: 'Arte original',
      year: 2010, genres: ['Animação', 'Fantasia'], originalLanguage: 'Inglês', languageNotes: null, availableAudioLanguages: ['Inglês'], subtitleLanguages: ['Português'],
      subtitleSource: 'https://durian.blender.org/download/', sourceType: 'licensed', playbackUrl: null, officialUrl: 'https://archive.org/details/Sintel',
      playbackMode: 'licensed-page', embedUrl: null, reproductionCheck: 'page-http-200', reproductionCheckedAt: '2026-10-20', licenseLabel: 'CC BY 3.0', attribution: 'Blender Foundation',
      playbackProvider: 'Internet Archive', sourcePage: 'https://studio.blender.org/projects/sintel/', metadataSource: 'https://studio.blender.org/projects/sintel/',
      rightsPage: 'https://durian.blender.org/about/', authorizationBasis: 'CC BY 3.0', lastVerified: '2026-10-20', availabilityStatus: 'authorized-playback',
    };
    await renderApp({ items: [movie] });
    await act(async () => [...host.querySelectorAll('nav button')].find(button => button.textContent?.includes('Filmes'))?.click());
    expect(host.textContent).toContain('2010 · Animação / Fantasia');
    expect(host.textContent).toContain('Original: Inglês');
    await act(async () => host.querySelector<HTMLButtonElement>('.poster')?.click());
    expect(host.textContent).toContain('Abrir fonte licenciada');
    expect(host.querySelector<HTMLAnchorElement>('.modal a.secondary')?.href).toBe('https://archive.org/details/Sintel');
  });

  it('incorpora player oficial e mantém a saída para a fonte original', async () => {
    await renderApp({ items: [{
      id: 'spring', title: 'Spring', type: 'movie', synopsis: 'Uma pastora e seu cão.', poster: null, posterSource: 'Arte original', year: 2019,
      genres: ['Animação'], originalLanguage: null, languageNotes: 'Sem diálogos.', availableAudioLanguages: [], subtitleLanguages: [], subtitleSource: null,
      sourceType: 'official', playbackUrl: null, officialUrl: 'https://www.youtube.com/watch?v=WhWc3b3KhnY',
      playbackProvider: 'YouTube oficial', playbackMode: 'youtube-embed', embedUrl: 'https://www.youtube-nocookie.com/embed/WhWc3b3KhnY',
      reproductionCheck: 'page-http-200', reproductionCheckedAt: '2026-10-20', licenseLabel: 'CC BY 4.0', attribution: '© Blender Foundation',
      sourcePage: 'https://studio.blender.org/projects/spring/', metadataSource: 'https://studio.blender.org/projects/spring/',
      rightsPage: 'https://studio.blender.org/projects/spring/pages/about/', authorizationBasis: 'Licença e player oficiais.',
      lastVerified: '2026-10-20', availabilityStatus: 'authorized-playback',
    }] });
    await act(async () => [...host.querySelectorAll('nav button')].find(button => button.textContent?.includes('Filmes'))?.click());
    await act(async () => host.querySelector<HTMLButtonElement>('.poster')?.click());
    expect(host.querySelector<HTMLIFrameElement>('.official-player iframe')?.src).toBe('https://www.youtube-nocookie.com/embed/WhWc3b3KhnY');
    expect([...host.querySelectorAll<HTMLAnchorElement>('.modal a')].some(link => link.href === 'https://www.youtube.com/watch?v=WhWc3b3KhnY')).toBe(true);
    expect(host.textContent).toContain('isso não confirma que o vídeo foi reproduzido');
  });

  it('mantém um título de licença pendente apenas como fonte informativa', async () => {
    await renderApp({ items: [{
      id: 'hero', title: 'Hero', type: 'movie', synopsis: 'Uma animação sobre coragem.', poster: null, posterSource: 'Arte original', year: 2018,
      genres: ['Animação'], originalLanguage: null, languageNotes: 'Não confirmado.', availableAudioLanguages: [], subtitleLanguages: [], subtitleSource: null,
      sourceType: 'info-only', playbackUrl: null, officialUrl: 'https://studio.blender.org/projects/hero/', playbackProvider: 'Blender Studio',
      playbackMode: 'info-only', embedUrl: null, reproductionCheck: 'documentation-only', reproductionCheckedAt: null, licenseLabel: null, attribution: null,
      sourcePage: 'https://studio.blender.org/projects/hero/', metadataSource: 'https://studio.blender.org/projects/hero/', rightsPage: null,
      authorizationBasis: 'Licença pública da obra completa ainda não confirmada.', lastVerified: '2026-10-20', availabilityStatus: 'unverified',
    }] });
    await act(async () => [...host.querySelectorAll('nav button')].find(button => button.textContent?.includes('Filmes'))?.click());
    await act(async () => host.querySelector<HTMLButtonElement>('.poster')?.click());
    expect(host.textContent).toContain('Sem autorização de reprodução confirmada');
    expect(host.textContent).toContain('Abrir fonte informativa');
    expect(host.querySelector('.official-player')).toBeNull();
  });

  it('diferencia links oficiais de canais pendentes e exclui pendências da M3U', async () => {
    await renderApp(undefined, { channels: [{
      id: 'tv-justica', name: 'TV Justiça', country: 'BR', language: 'Português', category: 'Pública', logo: null,
      streamUrl: null, officialWebsite: 'https://radioetvjustica.jus.br/', sourcePage: 'https://radioetvjustica.jus.br/',
      authorizationBasis: 'Player ainda não confirmado.', playbackNotes: 'Pendente.', lastVerified: '2026-10-20', status: 'pending',
    }] });
    await act(async () => [...host.querySelectorAll('nav button')].find(button => button.textContent?.includes('TV ao vivo'))?.click());
    expect(host.textContent).toContain('Pendente de confirmação');
    expect(host.textContent).toContain('A playlist atual não contém canais');
    expect(host.querySelector<HTMLAnchorElement>('.channels a')?.href).toBe('https://radioetvjustica.jus.br/');
  });
});
