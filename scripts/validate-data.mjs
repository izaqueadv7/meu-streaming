import fs from 'node:fs';
import path from 'node:path';

const errors = [];
const warnings = [];
const readList = (file, key) => {
  try {
    const value = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
    if (!Array.isArray(value[key])) throw new Error(`${key} deve ser uma lista`);
    return value[key];
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
    return [];
  }
};
const isHttpUrl = value => {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password;
  }
  catch { return false; }
};
const checkDate = (value, label) => {
  if (value === null) return;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    errors.push(`${label}: data deve usar AAAA-MM-DD ou null`);
  }
};
const duplicateIds = (entries, label) => {
  const ids = new Set();
  entries.forEach((entry, index) => {
    if (typeof entry?.id !== 'string' || !entry.id.trim()) errors.push(`${label}[${index}]: ID ausente`);
    else if (ids.has(entry.id)) errors.push(`${label}: ID duplicado ${entry.id}`);
    else ids.add(entry.id);
  });
};

const channels = readList('public/data/channels.json', 'channels');
const items = readList('public/data/catalog.json', 'items');
duplicateIds(channels, 'channels');
duplicateIds(items, 'items');

const channelRequired = ['id', 'name', 'country', 'language', 'category', 'logo', 'streamUrl', 'officialWebsite', 'sourcePage', 'authorizationBasis', 'playbackNotes', 'lastVerified', 'status'];
channels.forEach((channel, index) => {
  const label = `channels[${index}]`;
  for (const field of channelRequired) if (!(field in channel)) errors.push(`${label}: campo obrigatório ausente: ${field}`);
  for (const field of ['streamUrl', 'officialWebsite', 'sourcePage']) {
    if (channel[field] !== null && !isHttpUrl(channel[field])) errors.push(`${label}: ${field} deve ser URL HTTP(S) ou null`);
  }
  checkDate(channel.lastVerified, `${label}.lastVerified`);
  if (!['approved', 'official-only', 'pending', 'unavailable'].includes(channel.status)) errors.push(`${label}: status inválido`);
  if (channel.status === 'approved' && (!isHttpUrl(channel.streamUrl) || !channel.sourcePage || !channel.authorizationBasis)) {
    errors.push(`${label}: canal aprovado exige URL direta, fonte documental e base de autorização`);
  }
  if (channel.status !== 'approved' && channel.streamUrl !== null) errors.push(`${label}: somente canais aprovados podem ter streamUrl`);
  if (channel.status === 'official-only' && !isHttpUrl(channel.officialWebsite)) errors.push(`${label}: canal official-only exige link oficial`);
});

const itemRequired = ['id', 'title', 'type', 'synopsis', 'poster', 'posterSource', 'year', 'genres', 'originalLanguage', 'languageNotes', 'availableAudioLanguages', 'subtitleLanguages', 'subtitleSource', 'sourceType', 'playbackUrl', 'officialUrl', 'playbackProvider', 'playbackMode', 'embedUrl', 'reproductionCheck', 'reproductionCheckedAt', 'licenseLabel', 'attribution', 'sourcePage', 'metadataSource', 'rightsPage', 'authorizationBasis', 'lastVerified', 'availabilityStatus'];
items.forEach((item, index) => {
  const label = `items[${index}]`;
  for (const field of itemRequired) if (!(field in item)) errors.push(`${label}: campo obrigatório ausente: ${field}`);
  if (!['movie', 'series'].includes(item.type)) errors.push(`${label}: type inválido`);
  if (!['direct', 'licensed', 'official', 'info-only'].includes(item.sourceType)) errors.push(`${label}: sourceType inválido`);
  if (!['youtube-embed', 'official-page', 'licensed-page', 'direct-html5', 'info-only'].includes(item.playbackMode)) errors.push(`${label}: playbackMode inválido`);
  if (!['page-http-200', 'documentation-only', 'not-tested'].includes(item.reproductionCheck)) errors.push(`${label}: reproductionCheck inválido`);
  if (!['authorized-playback', 'official-service', 'unverified', 'unavailable'].includes(item.availabilityStatus)) errors.push(`${label}: availabilityStatus inválido`);
  for (const field of ['playbackUrl', 'officialUrl', 'embedUrl', 'sourcePage', 'metadataSource', 'rightsPage', 'subtitleSource']) {
    if (item[field] !== null && !isHttpUrl(item[field])) errors.push(`${label}: ${field} deve ser URL HTTP(S) ou null`);
  }
  if (!Array.isArray(item.genres) || !Array.isArray(item.availableAudioLanguages) || !Array.isArray(item.subtitleLanguages)) errors.push(`${label}: gêneros, idiomas de áudio e legendas devem ser listas`);
  if (item.poster !== null) {
    if (typeof item.poster !== 'string' || item.poster.includes('..')) errors.push(`${label}: poster deve ser caminho local seguro ou URL`);
    else if (isHttpUrl(item.poster)) {
      if (!item.posterSource) errors.push(`${label}: poster externo exige fonte de uso`);
    } else {
      const posterPath = path.resolve('public', item.poster.replace(/^\/+/, ''));
      if (!posterPath.startsWith(path.resolve('public') + path.sep) || !fs.existsSync(posterPath)) errors.push(`${label}: arquivo de capa não encontrado em public: ${item.poster}`);
      if (!item.posterSource) errors.push(`${label}: capa local exige descrição de origem`);
    }
  }
  checkDate(item.lastVerified, `${label}.lastVerified`);
  checkDate(item.reproductionCheckedAt, `${label}.reproductionCheckedAt`);
  if (item.reproductionCheck === 'page-http-200' && !item.reproductionCheckedAt) errors.push(`${label}: verificação HTTP exige data`);
  if (item.availabilityStatus === 'authorized-playback' && !item.playbackUrl && !item.officialUrl) errors.push(`${label}: reprodução autorizada exige link de reprodução`);
  if (item.sourceType === 'direct' && (!isHttpUrl(item.playbackUrl) || !item.sourcePage || !item.rightsPage || !item.authorizationBasis)) errors.push(`${label}: reprodução direta exige mídia HTTP(S), fontes e base de autorização`);
  if (item.sourceType === 'licensed' && (!isHttpUrl(item.officialUrl) || !item.rightsPage || !item.authorizationBasis)) errors.push(`${label}: fonte licenciada exige página de reprodução, página de direitos e fundamento`);
  if (item.sourceType === 'official' && (!isHttpUrl(item.officialUrl) || !item.rightsPage || !item.authorizationBasis)) errors.push(`${label}: serviço oficial exige link oficial, página de direitos e fundamento`);
  if (item.sourceType === 'info-only' && item.availabilityStatus === 'authorized-playback') errors.push(`${label}: item apenas informativo não pode indicar reprodução autorizada`);
  if (item.sourceType === 'info-only' && item.playbackMode !== 'info-only') errors.push(`${label}: item informativo deve usar playbackMode info-only`);
  if (item.playbackMode === 'direct-html5' && (item.sourceType !== 'direct' || !isHttpUrl(item.playbackUrl))) errors.push(`${label}: player HTML5 exige mídia direta documentada`);
  if (item.playbackMode === 'licensed-page' && item.sourceType !== 'licensed') errors.push(`${label}: licensed-page exige fonte licenciada`);
  if (item.playbackMode === 'youtube-embed') {
    let host = '';
    try { host = new URL(item.embedUrl).hostname; } catch { /* URL error reported above */ }
    if (!isHttpUrl(item.embedUrl) || host !== 'www.youtube-nocookie.com' || !/^\/embed\/[A-Za-z0-9_-]+$/.test(new URL(item.embedUrl).pathname)) errors.push(`${label}: youtube-embed exige URL pública no formato YouTube Privacy Enhanced`);
    if (!isHttpUrl(item.officialUrl) || !new URL(item.officialUrl).hostname.endsWith('youtube.com')) errors.push(`${label}: youtube-embed exige página oficial do YouTube`);
  } else if (item.embedUrl !== null) errors.push(`${label}: somente youtube-embed pode definir embedUrl`);
  if (item.licenseLabel !== null && (!String(item.licenseLabel).trim() || !String(item.attribution || '').trim())) errors.push(`${label}: licença exige atribuição indicada`);
  if (item.subtitleLanguages.length > 0 && !item.subtitleSource) errors.push(`${label}: legendas listadas exigem fonte de verificação`);
});

if (!channels.some(channel => channel.status === 'approved')) warnings.push('Nenhum stream direto tem autorização de redistribuição confirmada; a M3U conterá apenas o cabeçalho.');
if (!items.some(item => item.type === 'series')) warnings.push('Nenhuma série foi cadastrada com reprodução autorizada confirmada.');

if (errors.length === 0) {
  const approved = channels.filter(channel => channel.status === 'approved' && isHttpUrl(channel.streamUrl) && channel.sourcePage && channel.authorizationBasis);
  const playlist = ['#EXTM3U', ...approved.flatMap(channel => [
    `#EXTINF:-1 tvg-id="${channel.id}" group-title="${channel.category}",${channel.name}`,
    channel.streamUrl,
  ])].join('\n') + '\n';
  fs.writeFileSync('public/iptv/index.m3u', playlist, 'utf8');
}

console.log(`Erros: ${errors.length}\nAvisos: ${warnings.length}\n${[...errors, ...warnings].join('\n') || 'Validação concluída.'}`);
if (errors.length) process.exitCode = 1;
