import { describe, it, expect } from 'vitest';
import { approvedChannels, makeM3U, validHttpUrl, matches, type CatalogItem, type Channel } from '../src/data';

const item = {
  id: 'a', title: 'Filme Árvore', type: 'movie', synopsis: '', poster: null, posterSource: null, year: 2020,
  genres: ['Drama'], originalLanguage: 'Inglês', availableAudioLanguages: ['Português'], subtitleLanguages: [], subtitleSource: null,
  sourceType: 'info-only', playbackUrl: null, officialUrl: null, playbackProvider: null, sourcePage: null, metadataSource: null,
  rightsPage: null, authorizationBasis: null, lastVerified: null, availabilityStatus: 'unverified',
} as CatalogItem;

const channel: Channel = {
  id: 'ok', name: 'Canal', country: 'BR', language: 'Português', category: 'Notícias', logo: null,
  streamUrl: 'https://valid.example/live.m3u8', officialWebsite: null, sourcePage: 'https://valid.example',
  authorizationBasis: 'Permissão explícita', playbackNotes: null, lastVerified: null, status: 'approved',
};

describe('dados e playlist', () => {
  it('pesquisa e filtra gênero, idioma, idioma original e tipo', () => {
    expect(matches(item, 'árvore', 'Drama', 'Português', 'movie')).toBe(true);
    expect(matches(item, '', '', 'Inglês', '')).toBe(true);
    expect(matches(item, 'xx', '', '', '')).toBe(false);
    expect(matches(item, '', '', 'Espanhol', '')).toBe(false);
  });

  it('aprova somente canais com status aprovado e documentação', () => {
    expect(approvedChannels([channel, { ...channel, id: 'no', status: 'pending' }, { ...channel, id: 'unproven', authorizationBasis: null }])).toHaveLength(1);
  });

  it('gera M3U somente para stream direto aprovado', () => {
    const externalOnly: Channel = { ...channel, id: 'official', status: 'official-only', streamUrl: null, officialWebsite: 'https://official.example' };
    const pending: Channel = { ...channel, id: 'pending', status: 'pending', streamUrl: null };
    const playlist = makeM3U([channel, externalOnly, pending]);
    expect(playlist).toContain('Canal');
    expect(playlist).not.toContain('official');
    expect(playlist).not.toContain('pending');
  });

  it('retorna cabeçalho M3U quando não há stream externo aprovado', () => {
    expect(makeM3U([{ ...channel, status: 'official-only', streamUrl: null }])).toBe('#EXTM3U\n');
  });

  it('valida URL HTTP(S)', () => {
    expect(validHttpUrl('https://example.org')).toBe(true);
    expect(validHttpUrl('javascript:alert(1)')).toBe(false);
    expect(validHttpUrl('https://user:secret@example.org/live.m3u8')).toBe(false);
    expect(validHttpUrl(null)).toBe(false);
  });

  it('aceita itens sem campos opcionais de fonte', () => {
    expect(item.poster).toBeNull();
    expect(item.playbackUrl).toBeNull();
  });
});
