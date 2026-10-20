import { useEffect, useMemo, useState } from 'react';
import { Copy, ExternalLink, Film, Heart, Info, Menu, MonitorPlay, Play, Search, Tv, X } from 'lucide-react';
import { CatalogItem, Channel, matches } from './data';
import './style.css';

type View = 'Início' | 'TV ao vivo' | 'Filmes' | 'Séries' | 'Minha lista' | 'Ajuda';
const fallback = `${import.meta.env.BASE_URL}poster.svg`;
const assetUrl = (asset: string | null) => {
  if (!asset) return fallback;
  if (/^https?:\/\//i.test(asset)) return asset;
  return `${import.meta.env.BASE_URL}${asset.replace(/^\/+/, '')}`;
};
const channelStatusLabel = (status: Channel['status']) => ({
  approved: 'Stream direto aprovado',
  'official-only': 'Somente página oficial',
  pending: 'Pendente de confirmação',
  unavailable: 'Indisponível',
}[status]);

export default function App() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [view, setView] = useState<View>('Início');
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [sort, setSort] = useState('year');
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const [playerError, setPlayerError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/catalog.json`).then(response => response.json()),
      fetch(`${import.meta.env.BASE_URL}data/channels.json`).then(response => response.json()),
    ]).then(([catalog, channelData]) => {
      setItems(catalog.items || []);
      setChannels(channelData.channels || []);
    }).catch(() => setError(true));
  }, []);

  useEffect(() => localStorage.setItem('favorites', JSON.stringify(favorites)), [favorites]);
  useEffect(() => setPlayerError(false), [selected?.id]);

  const list = useMemo(() => items
    .filter(item => matches(
      item,
      query,
      genre,
      language,
      view === 'Filmes' ? 'movie' : view === 'Séries' ? 'series' : '',
    ) && (view !== 'Minha lista' || favorites.includes(item.id)))
    .sort((a, b) => sort === 'az' ? a.title.localeCompare(b.title, 'pt-BR') : (b.year || 0) - (a.year || 0)),
  [items, query, genre, language, view, favorites, sort]);

  const genres = [...new Set(items.flatMap(item => item.genres))];
  const languages = [...new Set(items.flatMap(item => [item.originalLanguage, ...item.availableAudioLanguages]).filter((value): value is string => Boolean(value)))];
  const visibleChannels = channels.filter(channel => channel.status !== 'unavailable');
  const nav: View[] = ['Início', 'TV ao vivo', 'Filmes', 'Séries', 'Minha lista', 'Ajuda'];

  const changeView = (nextView: View) => {
    setView(nextView);
    setSelected(null);
    setMenuOpen(false);
  };
  const toggleFavorite = (id: string) => setFavorites(current => current.includes(id)
    ? current.filter(favoriteId => favoriteId !== id)
    : [...current, id]);
  const copyPlaylistUrl = async () => {
    try {
      await navigator.clipboard.writeText(location.origin + import.meta.env.BASE_URL + 'iptv/index.m3u');
      alert('URL copiada.');
    } catch {
      alert('Copie a URL da playlist na barra do navegador e acrescente iptv/index.m3u.');
    }
  };

  return <>
    <header>
      <a className="brand" onClick={() => changeView('Início')}><span>▶</span>Meu <b>Streaming</b></a>
      <button className="hamb" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? <X /> : '☰'}</button>
      <nav className={menuOpen ? 'open' : ''}>
        {nav.map((name, index) => <button className={view === name ? 'active' : ''} key={name} onClick={() => changeView(name)}>
          {[<MonitorPlay />, <Tv />, <Film />, <Film />, <Heart />, <Info />][index]}{name}
        </button>)}
      </nav>
      <small className="motto">Seu espaço, suas histórias</small>
    </header>

    <main>
      {error && <p className="notice">Dados indisponíveis. Atualize a página para tentar novamente.</p>}

      {view === 'Início' && <>
        <section className="hero">
          <div className="hero-text"><small>✳　SEU ESPAÇO DE ENTRETENIMENTO</small><h1>Histórias que<br /><em>moram com você.</em></h1><p>Explore títulos, descubra canais abertos e organize seus favoritos em um só lugar.</p><button className="primary" onClick={() => changeView('Filmes')}><Play size={15} /> Explorar catálogo</button></div>
          <div className="art"><span>UMA NOVA<br /><b>JORNADA</b></span><span>SEU PRÓXIMO<br /><b>CAPÍTULO</b></span></div>
          <small className="hero-foot">01 / DESCOBRIR <i>CATÁLOGO PESSOAL · BRASIL</i></small>
        </section>
        <div className="quick">{[['TV ao vivo', 'Canais públicos e autorizados'], ['Filmes', 'Descubra algo novo'], ['Minha lista', 'O que guardou pra depois']].map(([title, subtitle]) => <button key={title} onClick={() => changeView(title as View)}><span>✳</span><b>{title}<small>{subtitle}</small></b>↗</button>)}</div>
        <section className="catalog"><h2>Para sua próxima sessão</h2><Cards items={list.slice(0, 6)} favorites={favorites} toggle={toggleFavorite} select={setSelected} /></section>
      </>}

      {['Filmes', 'Séries', 'Minha lista'].includes(view) && <section className="page">
        <small>CATÁLOGO PESSOAL</small><h1>{view}</h1><p>Pesquise e filtre títulos por gênero e idioma.</p>
        <div className="filters">
          <label><Search /><input placeholder="Buscar títulos..." aria-label="Buscar títulos" value={query} onChange={event => setQuery(event.target.value)} /></label>
          <select value={genre} onChange={event => setGenre(event.target.value)}><option value="">Todos os gêneros</option>{genres.map(value => <option key={value}>{value}</option>)}</select>
          <select value={language} onChange={event => setLanguage(event.target.value)}><option value="">Todos os idiomas</option>{languages.map(value => <option key={value}>{value}</option>)}</select>
          <select value={sort} onChange={event => setSort(event.target.value)}><option value="year">Mais recentes</option><option value="az">A–Z</option></select>
        </div>
        <Cards items={list} favorites={favorites} toggle={toggleFavorite} select={setSelected} />
      </section>}

      {view === 'TV ao vivo' && <section className="page">
        <small>TRANSMISSÕES E PÁGINAS OFICIAIS</small><h1>TV <em>ao vivo</em></h1><p>Links levam às fontes oficiais. Só streams com autorização documentada entram na playlist M3U.</p>
        <button className="secondary" onClick={copyPlaylistUrl}><Copy size={15} /> Copiar playlist M3U</button>
        <p className="notice"><Info size={16} /> A playlist atual não contém canais: não há URL direta com autorização de redistribuição e compatibilidade com VLC confirmadas. Os cartões abrem as páginas oficiais.</p>
        {visibleChannels.length === 0
          ? <Empty title="Nenhuma fonte cadastrada" text="Os canais aparecem aqui quando há uma fonte oficial ou documentação suficiente para registrar a pendência." />
          : <div className="channels">{visibleChannels.map(channel => <article key={channel.id}>
            <span aria-hidden="true">📺</span><div className="channel-copy"><b>{channel.name}</b><small>{channel.category} · {channel.language}</small><small className={`channel-status ${channel.status}`}>{channelStatusLabel(channel.status)}</small><p>{channel.authorizationBasis}</p><small>{channel.playbackNotes}</small></div>
            {channel.status === 'approved' && channel.streamUrl
              ? <a className="secondary" href={channel.streamUrl} target="_blank" rel="noreferrer">Assistir <ExternalLink size={14} /></a>
              : channel.officialWebsite
                ? <a className="secondary" href={channel.officialWebsite} target="_blank" rel="noreferrer">{channel.status === 'pending' ? 'Site oficial' : 'Abrir fonte oficial'} <ExternalLink size={14} /></a>
                : <span className="channel-status">Sem link confirmado</span>}
          </article>)}</div>}
      </section>}

      {view === 'Ajuda' && <section className="page"><small>GUIA RÁPIDO</small><h1>Ajuda & <em>fontes</em></h1><article className="help">
        <h3>Como abrir uma playlist aprovada no VLC para Windows</h3><ol><li>Abra o VLC.</li><li>Selecione Mídia → Abrir fluxo de rede.</li><li>Cole a URL publicada da playlist M3U e reproduza.</li></ol><button className="secondary" onClick={copyPlaylistUrl}><Copy size={15} /> Copiar URL da playlist</button>
        <p>A playlist inclui somente streams diretos aprovados e documentados. Um link para a página oficial pode funcionar apenas no navegador.</p><h3>Direitos e disponibilidade</h3><p>Metadados não concedem direitos de reprodução. O catálogo diferencia reprodução autorizada, serviço oficial e registro informativo. Canais pendentes e links externos não são transformados em streams M3U.</p><p>Consulte o README para as fontes, licenças e datas de verificação.</p>
      </article></section>}
    </main>

    <footer>MEU STREAMING · SEU ESPAÇO, SUAS HISTÓRIAS <span>FONTES AUTORIZADAS · CATÁLOGO PESSOAL</span></footer>

    {selected && <div className="backdrop" onClick={() => setSelected(null)}><article className="modal" onClick={event => event.stopPropagation()}>
      <button className="x" onClick={() => setSelected(null)} aria-label="Fechar">×</button>
      <img src={assetUrl(selected.poster)} alt={`Capa original de ${selected.title}`} onError={event => { event.currentTarget.src = fallback; }} />
      <div>
        <small>{selected.type === 'movie' ? 'FILME' : 'SÉRIE'} · {selected.year || 'Ano indisponível'}</small><h2>{selected.title}</h2><p>{selected.synopsis || 'Sinopse indisponível.'}</p>
        <p><b>Gêneros:</b> {selected.genres.join(', ') || 'Não informados'}</p>
        <p><b>Idioma original:</b> {selected.originalLanguage || 'Não confirmado'}</p>
        <p><b>Áudio confirmado:</b> {selected.availableAudioLanguages.join(', ') || 'Não confirmado'}</p>
        <p><b>Legendas confirmadas:</b> {selected.subtitleLanguages.join(', ') || 'Não confirmadas'}</p>
        <p><b>Disponibilidade:</b> {selected.availabilityStatus === 'authorized-playback' ? 'Fonte oficial ou licenciada identificada' : selected.availabilityStatus === 'official-service' ? 'Página de serviço oficial' : selected.availabilityStatus === 'unavailable' ? 'Fonte marcada como indisponível' : 'Sem autorização de reprodução confirmada'}</p>
        {selected.availabilityStatus === 'unavailable'
          ? <p className="notice">Esta fonte está marcada como indisponível. Nenhum player será iniciado.</p>
          : selected.playbackMode === 'youtube-embed' && selected.embedUrl && selected.availabilityStatus === 'authorized-playback'
            ? <section className="official-player" aria-label={`Player oficial de ${selected.title}`}>
                <iframe title={`Player oficial de ${selected.title}`} src={selected.embedUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen onError={() => setPlayerError(true)} />
                <p className="player-note">Player oficial incorporado. A disponibilidade pode variar por região ou configuração do YouTube. {playerError ? 'O player não carregou; abra a fonte original.' : 'Se o vídeo não iniciar, abra a fonte original.'}</p>
              </section>
            : selected.playbackMode === 'direct-html5' && selected.playbackUrl && selected.availabilityStatus === 'authorized-playback'
              ? <section className="official-player" aria-label={`Player direto de ${selected.title}`}>
                  <video controls preload="metadata" src={selected.playbackUrl} onError={() => setPlayerError(true)}>Seu navegador não oferece suporte a este vídeo.</video>
                  {playerError && <p className="notice">Não foi possível reproduzir este arquivo aqui. Use a página oficial da fonte.</p>}
                </section>
              : null}
        {selected.availabilityStatus !== 'unavailable' && selected.playbackUrl && selected.sourceType === 'direct'
          ? <a className="primary" href={selected.playbackUrl} target="_blank" rel="noreferrer">Abrir mídia oficial <ExternalLink size={15} /></a>
          : selected.officialUrl && selected.availabilityStatus === 'authorized-playback'
            ? <a className="secondary" href={selected.officialUrl} target="_blank" rel="noreferrer">{selected.sourceType === 'licensed' ? 'Abrir fonte licenciada' : 'Abrir player oficial'} <ExternalLink size={15} /></a>
            : selected.officialUrl && selected.availabilityStatus !== 'unavailable'
              ? <a className="secondary" href={selected.officialUrl} target="_blank" rel="noreferrer">Abrir fonte informativa <ExternalLink size={15} /></a>
              : null}
        {selected.sourcePage && selected.sourcePage !== selected.officialUrl && <p><b>Projeto / fonte original:</b> <a href={selected.sourcePage} target="_blank" rel="noreferrer">abrir página oficial <ExternalLink size={12} /></a></p>}
        {selected.playbackProvider && <p><b>Fonte de reprodução:</b> {selected.playbackProvider}</p>}
        {selected.licenseLabel && <p><b>Licença:</b> {selected.licenseLabel}</p>}
        {selected.attribution && <p><b>Atribuição:</b> {selected.attribution}</p>}
        {selected.languageNotes && <p><b>Nota de idioma:</b> {selected.languageNotes}</p>}
        <p><b>Checagem da reprodução:</b> {selected.reproductionCheck === 'page-http-200' ? `A página da fonte respondeu HTTP 200 em ${selected.reproductionCheckedAt}; isso não confirma que o vídeo foi reproduzido.` : selected.reproductionCheck === 'documentation-only' ? 'Somente documentação consultada; player não testado.' : 'Player não testado.'}</p>
        {selected.metadataSource && <p><b>Metadados:</b> <a href={selected.metadataSource} target="_blank" rel="noreferrer">consultar fonte <ExternalLink size={12} /></a></p>}
        {selected.rightsPage && <p><b>Licença e direitos:</b> <a href={selected.rightsPage} target="_blank" rel="noreferrer">consultar fundamento <ExternalLink size={12} /></a></p>}
        {selected.subtitleSource && selected.subtitleLanguages.length > 0 && <p><b>Fonte das legendas:</b> <a href={selected.subtitleSource} target="_blank" rel="noreferrer">consultar fonte <ExternalLink size={12} /></a></p>}
        {selected.posterSource && <p><b>Capa:</b> {selected.posterSource}</p>}
        <p className="verified-date">Verificação documental: {selected.lastVerified || 'data não registrada'}</p>
      </div>
    </article></div>}
  </>;
}

function Cards({ items, favorites, toggle, select }: { items: CatalogItem[]; favorites: string[]; toggle: (id: string) => void; select: (item: CatalogItem) => void }) {
  return items.length
    ? <div className="grid">{items.map((item, index) => <article className="card" key={item.id}>
      <button className="poster" onClick={() => select(item)} aria-label={`Detalhes de ${item.title}`}><img src={assetUrl(item.poster)} alt={`Capa original de ${item.title}`} onError={event => { event.currentTarget.src = fallback; }} /><span>{String(index + 1).padStart(2, '0')}</span></button>
      <button className="heart" aria-label={favorites.includes(item.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} onClick={() => toggle(item.id)}>{favorites.includes(item.id) ? '♥' : '♡'}</button>
      <b>{item.title}</b>
      <small>{item.year || 'Ano indisponível'} · {item.genres.join(' / ') || (item.type === 'movie' ? 'Filme' : 'Série')}</small>
      <small className="card-language">Original: {item.originalLanguage || 'não confirmado'} · áudio: {item.availableAudioLanguages.join(', ') || 'não confirmado'}</small>
    </article>)}</div>
    : <Empty title="Nada por aqui ainda" text="Quando houver títulos cadastrados, eles aparecem nesta seção." />;
}

function Empty({ title, text }: { title: string; text: string }) {
  return <div className="empty"><span>✳</span><b>{title}</b><p>{text}</p></div>;
}
