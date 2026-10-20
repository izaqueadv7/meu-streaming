export type PlaybackMode='youtube-embed'|'official-page'|'licensed-page'|'direct-html5'|'info-only';
export type ReproductionCheck='page-http-200'|'documentation-only'|'not-tested';
export interface CatalogItem{
  id:string;
  title:string;
  type:'movie'|'series';
  synopsis:string;
  poster:string|null;
  posterSource:string|null;
  year:number|null;
  genres:string[];
  originalLanguage:string|null;
  languageNotes:string|null;
  availableAudioLanguages:string[];
  subtitleLanguages:string[];
  subtitleSource:string|null;
  sourceType:'direct'|'licensed'|'official'|'info-only';
  playbackUrl:string|null;
  officialUrl:string|null;
  playbackProvider:string|null;
  playbackMode:PlaybackMode;
  embedUrl:string|null;
  reproductionCheck:ReproductionCheck;
  reproductionCheckedAt:string|null;
  licenseLabel:string|null;
  attribution:string|null;
  sourcePage:string|null;
  metadataSource:string|null;
  rightsPage:string|null;
  authorizationBasis:string|null;
  lastVerified:string|null;
  availabilityStatus:'authorized-playback'|'official-service'|'unverified'|'unavailable'
}
export type ChannelStatus='approved'|'official-only'|'pending'|'unavailable';
export interface Channel{id:string;name:string;country:string;language:string;category:string;logo:string|null;streamUrl:string|null;officialWebsite:string|null;sourcePage:string|null;authorizationBasis:string|null;playbackNotes:string|null;lastVerified:string|null;status:ChannelStatus}
export const matches=(i:CatalogItem,q:string,g:string,l:string,t:string)=>(!q||i.title.toLocaleLowerCase('pt-BR').includes(q.toLocaleLowerCase('pt-BR')))&&(!g||i.genres.includes(g))&&(!l||i.availableAudioLanguages.includes(l)||i.originalLanguage===l)&&(!t||i.type===t);
export const approvedChannels=(a:Channel[])=>a.filter(c=>c.status==='approved'&&!!c.streamUrl&&!!c.authorizationBasis&&!!c.sourcePage);
export const makeM3U=(a:Channel[])=>['#EXTM3U',...approvedChannels(a).flatMap(c=>[`#EXTINF:-1 tvg-id="${c.id}" group-title="${c.category}",${c.name}`,c.streamUrl!])].join('\n')+'\n';
export const validHttpUrl=(s:string|null)=>{if(!s)return false;try{const url=new URL(s);return['http:','https:'].includes(url.protocol)&&!url.username&&!url.password}catch{return false}};
