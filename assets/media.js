const MEDIA_CACHE_VERSION = '20261119c';
const mediaDraftMode = document.body.dataset.mediaMode === 'drafts';
const MEDIA_INDEX_URL = mediaDraftMode
  ? `data/media-drafts-index.json?v=${MEDIA_CACHE_VERSION}`
  : `data/media-index.json?v=${MEDIA_CACHE_VERSION}`;
const mediaItemUrl = id => `${mediaDraftMode ? 'data/media-draft-shards' : 'data/media-shards'}/${encodeURIComponent(String(id).slice(0,1).toLowerCase())}.json?v=${MEDIA_CACHE_VERSION}`;
const mediaDetailPage = mediaDraftMode ? 'media-draft-detail.html' : 'media-detail.html';
const mediaVerificationLabel = item => mediaDraftMode ? '待逐条核验草稿' : item.editorialStatus === 'approved' ? '已逐项核验' : item.evidenceCount ? '有原话记录' : '节目资料';
const MEDIA_LABELS = {all:'全部',book:'书籍',video:'影视 / 视频',stage:'舞台剧',game:'游戏',article:'文章',audio:'播客 / 音乐',link:'其他'};
const mediaInitialCount = () => window.matchMedia('(max-width:760px)').matches ? 12 : 18;
const mediaPageSize = () => window.matchMedia('(max-width:760px)').matches ? 12 : 18;
const mediaState = {items:[],type:'all',query:'',sort:'recommended',visible:mediaInitialCount(),loading:false,observer:null};

const mediaEsc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const mediaSafeUrl = value => /^https?:\/\//i.test(value || '') ? value : '#';
const mediaAssetUrl = value => /^(?:https?:\/\/|assets\/media-covers\/)/i.test(value || '') ? value : '#';
const mediaHash = value => { let hash=0; for(const char of value || '') hash=(hash*31+char.charCodeAt(0))>>>0; return hash; };
const mediaTypeLabel = value => MEDIA_LABELS[value] || MEDIA_LABELS.link;
const mediaTitle = item => item.titleZh && !/高效能人士的七个习惯/.test(item.titleZh) ? item.titleZh.replace(/[《》]/g,'') : item.title;

function showMediaLoading(){
  const grid=document.getElementById('mediaGrid');
  if(!grid) return;
  document.getElementById('mediaResultCount').innerHTML='<span class="loading-copy"><i></i>正在整理书架</span>';
  grid.setAttribute('aria-busy','true');
  grid.innerHTML=Array.from({length:mediaInitialCount()},(_,index)=>`<div class="skeleton-media-card" style="--delay:${index*35}ms" aria-hidden="true"><div class="skeleton-book"></div><div class="skeleton-media-copy"><i></i><b></b><b></b><span></span></div></div>`).join('');
}

function showMediaDetailLoading(){
  const hero=document.getElementById('mediaDetailHero');
  if(!hero) return;
  hero.setAttribute('aria-busy','true');
  hero.innerHTML='<div class="skeleton-book skeleton-book-large"></div><div class="episode-loading-copy"><span class="loading-copy"><i></i>正在取出这项推荐</span><b></b><b></b><b></b></div>';
}

function initMediaBackToTop(){
  const button=document.getElementById('backToTop'); if(!button) return;
  const sync=()=>button.classList.toggle('show',window.scrollY>520);
  button.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
  window.addEventListener('scroll',sync,{passive:true}); sync();
}

function scoreMarks(score){
  const rounded=Math.round(Number(score)||0);
  return `<span class="score-marks" aria-label="推荐指数 ${mediaEsc(score)} 分">${[1,2,3,4,5].map(value=>`<i class="${value<=rounded?'filled':''}"></i>`).join('')}</span>`;
}

function coverMarkup(item,large=false,priority=false){
  const palettes=[['#244c42','#e6d8a5'],['#9f3b29','#f4e7d0'],['#243c60','#d8d7bd'],['#6b492d','#f0d9b2'],['#354238','#e8c7bb'],['#752d37','#ecd7b5']];
  const palette=palettes[mediaHash(item.id)%palettes.length];
  const title=mediaTitle(item);
  const fallback=`<span class="media-cover-fallback" style="--cover-bg:${palette[0]};--cover-ink:${palette[1]}"><small>${mediaEsc(mediaTypeLabel(item.type))}</small><strong>${mediaEsc(title)}</strong><em>Lenny's Podcast Picks</em></span>`;
  const chineseCover=item.douban?.editions?.zh?.coverUrl||item.douban?.coverUrl||'';
  const coverUrl=item.coverUrl||chineseCover;
  if(!coverUrl) return `<div class="media-cover ${large?'media-cover-large':''}">${fallback}</div>`;
  return `<div class="media-cover ${large?'media-cover-large':''}">${fallback}<img src="${mediaEsc(mediaAssetUrl(coverUrl))}" alt="${mediaEsc(title)}封面" width="320" height="480" loading="${large||priority?'eager':'lazy'}" fetchpriority="${large||priority?'high':'low'}" decoding="async" referrerpolicy="no-referrer" onload="this.parentElement.classList.add('is-loaded')" onerror="this.remove()"></div>`;
}

function cardMarkup(item,index){
  const guests=item.recommenders||[...new Set((item.recommendations||[]).map(row=>row.guest))];
  const guestLine=guests.slice(0,2).join('、')+(guests.length>2?` 等 ${guests.length} 人`:'');
  return `<a class="media-card" href="${mediaDetailPage}#id=${encodeURIComponent(item.id)}" style="--delay:${Math.min(index,10)*38}ms">
    ${coverMarkup(item,false,index<6)}
    <div class="media-card-copy">
      <div class="media-card-meta"><span>${mediaEsc(mediaTypeLabel(item.type))}</span><span>${mediaVerificationLabel(item)}</span></div>
      <h2>${mediaEsc(mediaTitle(item))}</h2>
      ${item.titleZh && mediaTitle(item)!==item.title?`<p class="media-original-title">${mediaEsc(item.title)}</p>`:''}
      <p class="media-recommenders">${mediaEsc(guestLine)}</p>
      <div class="media-card-score">${scoreMarks(item.recommendationScore)}<strong>${mediaEsc(item.recommendationScore)}</strong><span>${item.recommenderCount} 位嘉宾</span></div>
    </div>
  </a>`;
}

function searchableMedia(item){
  const guests=item.recommenders||(item.recommendations||[]).map(row=>row.guest);
  return [item.title,item.titleZh,item.creator,item.typeZh,...guests].filter(Boolean).join(' ').toLowerCase();
}

function filteredMedia(){
  const query=mediaState.query.toLowerCase();
  const list=mediaState.items.filter(item=>(mediaState.type==='all'||item.type===mediaState.type)&&(!query||searchableMedia(item).includes(query)));
  const sorters={
    recommended:(a,b)=>b.recommenderCount-a.recommenderCount||b.recommendationScore-a.recommendationScore||b.evidenceCount-a.evidenceCount,
    score:(a,b)=>b.recommendationScore-a.recommendationScore||b.recommenderCount-a.recommenderCount,
    people:(a,b)=>b.recommenderCount-a.recommenderCount||b.recommendationCount-a.recommendationCount,
    title:(a,b)=>a.title.localeCompare(b.title,'en')
  };
  return list.sort(sorters[mediaState.sort]||sorters.recommended);
}

function renderMediaGrid(append=false){
  const list=filteredMedia();
  const visible=list.slice(0,mediaState.visible);
  const grid=document.getElementById('mediaGrid');
  document.getElementById('mediaResultCount').innerHTML=`找到 <strong>${list.length}</strong> 项内容`;
  const start=append?grid.children.length:0;
  if(!append) grid.innerHTML='';
  const additions=visible.slice(start);
  if(additions.length) grid.insertAdjacentHTML('beforeend',additions.map((item,index)=>cardMarkup(item,start+index)).join(''));
  document.getElementById('mediaEmpty').hidden=!!list.length;
  const more=document.getElementById('mediaLoadMore');
  more.hidden=visible.length>=list.length;
  more.textContent=`继续浏览（还有 ${list.length-visible.length} 项）`;
}

function renderMediaControls(stats){
  const counts={all:stats.uniqueItems,...stats.types};
  document.getElementById('mediaTypes').innerHTML=Object.entries(MEDIA_LABELS).map(([key,label])=>`<button class="media-type ${key==='all'?'active':''}" data-type="${key}">${label}<span>${counts[key]||0}</span></button>`).join('');
  document.querySelectorAll('.media-type').forEach(button=>button.onclick=()=>{
    mediaState.type=button.dataset.type; mediaState.visible=mediaInitialCount();
    document.querySelectorAll('.media-type').forEach(node=>node.classList.toggle('active',node===button)); renderMediaGrid();
  });
  let searchTimer;
  const search=document.getElementById('mediaSearch');
  mediaState.query=search.value.trim();
  search.oninput=event=>{
    clearTimeout(searchTimer);
    const value=event.target.value.trim();
    searchTimer=setTimeout(()=>{mediaState.query=value;mediaState.visible=mediaInitialCount();renderMediaGrid();},120);
  };
  document.getElementById('mediaSort').onchange=event=>{mediaState.sort=event.target.value;mediaState.visible=mediaInitialCount();renderMediaGrid();};
  document.getElementById('mediaLoadMore').onclick=()=>appendMediaPage();
}

function appendMediaPage(){
  if(mediaState.loading) return;
  mediaState.loading=true;
  mediaState.visible+=mediaPageSize();
  requestAnimationFrame(()=>{
    renderMediaGrid(true);
    mediaState.loading=false;
  });
}

function initMediaInfinite(){
  const more=document.getElementById('mediaLoadMore');
  if(!more||!('IntersectionObserver' in window)) return;
  mediaState.observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)&&!more.hidden) appendMediaPage();
  },{rootMargin:'420px 0px'});
  mediaState.observer.observe(more);
}

function renderMediaStats(stats){
  const visibleBooks=mediaState.items.filter(item=>item.type==='book').length;
  document.getElementById('mediaStats').innerHTML=`
    <div><strong>${stats.uniqueItems}</strong><span>项独立推荐</span></div>
    <div><strong>${visibleBooks}</strong><span>本书</span></div>
    <div><strong>${stats.episodesWithRecommendations}</strong><span>期节目有推荐</span></div>
    <div><strong>${stats.itemsWithTranscriptEvidence}</strong><span>项匹配到原话</span></div>`;
}

async function initMediaIndex(){
  showMediaLoading();
  try{
    const response=await fetch(MEDIA_INDEX_URL);
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload=await response.json();
    mediaState.items=payload.items||[]; document.getElementById('mediaGrid').removeAttribute('aria-busy'); renderMediaStats(payload.stats); renderMediaControls(payload.stats); renderMediaGrid(); initMediaInfinite();
  }catch(error){
    const grid=document.getElementById('mediaGrid');
    grid.innerHTML='';
    grid.removeAttribute('aria-busy');
    document.getElementById('mediaResultCount').innerHTML='书架内容正在整理中。 <button class="retry-link" type="button">刷新看看</button>';
    document.querySelector('#mediaResultCount button').onclick=()=>location.reload();
    document.getElementById('mediaEmpty').hidden=false;
    document.getElementById('mediaEmpty').textContent='更多书籍与影音内容正在陆续归档。';
    console.error(error);
  }
}

function detailId(){return new URLSearchParams(location.hash.slice(1)).get('id')||new URLSearchParams(location.search).get('id');}

function mediaInfoMarkup(item){
  const hasDoubanSummary=Boolean(item.douban?.editions?.zh?.summary||item.douban?.editions?.en?.summary||item.douban?.summary);
  const description=hasDoubanSummary?'':(item.description||'');
  // 豆瓣入口统一由 doubanMarkup 渲染，避免在侧栏出现第二个、无版本说明的重复链接。
  const links=(item.referenceLinks||[]).filter(link=>link&&link.url&&!/^https?:\/\/(?:www\.)?book\.douban\.com\//i.test(link.url));
  if(!description&&!links) return '';
  const linkMarkup=links.map(link=>`<a href="${mediaEsc(mediaSafeUrl(link.url))}" target="_blank" rel="noopener">${mediaEsc(link.label||'\u76f8\u5173\u94fe\u63a5')} <b>\u2197</b></a>`).join('');
  return `${description?`<span class="section-kicker">EDITORIAL NOTE</span><h2>\u4f5c\u54c1\u4ecb\u7ecd</h2><p>${mediaEsc(description)}</p>`:''}${linkMarkup?`<div class="media-links">${linkMarkup}</div>`:''}`;
}

function doubanMarkup(item){
  const douban=item.douban||{};
  const editions=douban.editions||{};
  const preferredEdition=editions.zh||editions.en||douban;
  const rating=preferredEdition.rating?`<strong>${mediaEsc(preferredEdition.rating)}</strong><span>/ 10 · ${preferredEdition.ratingCount?Number(preferredEdition.ratingCount).toLocaleString()+' 人评价':'豆瓣评分'}</span>`:`<strong class="douban-pending">${mediaEsc(preferredEdition.ratingStatus || '待补充')}</strong><span>豆瓣评分</span>`;
  const summary=preferredEdition.summary||douban.summary||'';
  const verification=mediaDraftMode ? '本地草稿信息，尚未逐条核验' : douban.status==='verified-manually'?'已逐项核对豆瓣条目':douban.status==='verified-work'?'中文版与英文原作已对应核验':douban.status==='verified-title'?'豆瓣同作品版本匹配':douban.status==='verified'?'ISBN 对应版本已核验':'豆瓣信息待核验';
  const editionLinks=[
    editions.zh?.url?`<a class="primary" href="${mediaEsc(mediaSafeUrl(editions.zh.url))}" target="_blank" rel="noopener">中文版豆瓣 <b>↗</b></a>`:'',
    editions.en?.url?`<a href="${mediaEsc(mediaSafeUrl(editions.en.url))}" target="_blank" rel="noopener">英文版豆瓣 <b>↗</b></a>`:'',
    douban.otherChineseEdition?`<a href="${mediaEsc(mediaSafeUrl(douban.otherChineseEdition))}" target="_blank" rel="noopener">其他中文版本 <b>↗</b></a>`:'',
  ].filter(Boolean).join('');
  const fallbackLink=!editionLinks&&preferredEdition.url?`<a class="primary" href="${mediaEsc(mediaSafeUrl(preferredEdition.url))}" target="_blank" rel="noopener">前往豆瓣${item.type==='book'?'书页':'条目'} <b>↗</b></a>`:'';
  return `<span class="section-kicker">DOUBAN</span><h2>豆瓣信息</h2><div class="douban-score">${rating}</div><small class="douban-verification">${verification}</small><p>${mediaEsc(summary||'暂未找到可核验的豆瓣介绍。')}</p><small>${mediaEsc(douban.editionNote||'')}</small><div class="douban-edition-links">${editionLinks||fallbackLink}</div>`;
}

function recommendationMarkup(row){
  const quote=row.quoteZh||row.quoteEn;
  const verified=!mediaDraftMode&&row.status==='transcript-matched';
  const episodeHref=`episode.html#id=${encodeURIComponent(row.episodeId)}`;
  return `<article class="recommendation-entry">
    <header><div class="recommendation-person"><div><span class="recommendation-guest">${mediaEsc(row.guest)}</span><span class="evidence-status ${verified?'verified':''}">${mediaDraftMode?'节目引用待核验':verified?'逐字稿原话已核验':'节目推荐资料'}</span></div>${row.guestBlurb?`<p class="recommendation-guest-bio" title="${mediaEsc(row.guestBlurb)}">${mediaEsc(row.guestBlurb)}</p>`:''}</div><div class="recommendation-score">${scoreMarks(row.score)}<strong>${row.score}.0</strong></div></header>
    <div class="recommendation-reason"><span>推荐指数说明</span><p>${mediaEsc(row.scoreReason)}</p></div>
    <blockquote><span>嘉宾在节目中说</span><p>${mediaEsc(quote)}</p>${row.quoteZh&&row.quoteEn?`<details><summary>查看英文原话</summary><p lang="en">${mediaEsc(row.quoteEn)}</p></details>`:''}</blockquote>
    <footer>${row.timestamp?`<span>出现时间 ${mediaEsc(row.timestamp)}</span>`:'<span>节目推荐资料</span>'}<div><a href="${episodeHref}">阅读完整访谈 →</a>${row.episodeUrl?`<a href="${mediaEsc(mediaSafeUrl(row.episodeUrl))}" target="_blank" rel="noopener">收听原节目 ↗</a>`:''}</div></footer>
  </article>`;
}

function renderMediaDetail(item){
  const title=mediaTitle(item);
  const guests=[...new Set(item.recommendations.map(row=>row.guest))];
  document.title=`${title} · Lenny 书影音库`;
  document.getElementById('mediaDetailHero').innerHTML=`${coverMarkup(item,true)}<div class="media-detail-copy"><span class="hero-kicker">${mediaEsc(mediaTypeLabel(item.type))} · ${mediaVerificationLabel(item)}</span><h1>${mediaEsc(title)}</h1>${title!==item.title?`<p class="media-detail-original">${mediaEsc(item.title)}</p>`:''}${item.creator?`<p class="media-creator">${mediaEsc(item.creator)}</p>`:''}<div class="media-detail-score"><div>${scoreMarks(item.recommendationScore)}<strong>${mediaEsc(item.recommendationScore)}</strong><span>/ 5 推荐指数</span></div><p><strong>${guests.length}</strong> 位嘉宾推荐 · <strong>${item.evidenceCount}</strong> 条${mediaDraftMode?'待核验的原话线索':'原话证据'}</p></div></div>`;
  document.getElementById('mediaRecommendations').innerHTML=item.recommendations.map(recommendationMarkup).join('');
  const infoPanel=document.getElementById('mediaInfoPanel');
  const infoMarkup=mediaInfoMarkup(item);
  infoPanel.hidden=!infoMarkup;
  infoPanel.innerHTML=infoMarkup;
  document.getElementById('doubanPanel').innerHTML=doubanMarkup(item);
  document.getElementById('mediaDetailLayout').hidden=false;
}

async function initMediaDetail(){
  const id=detailId();
  if(!id){document.getElementById('mediaDetailHero').innerHTML='<div class="media-not-found"><h1>没有指定内容</h1><a href="media.html">返回书影音库</a></div>';return;}
  showMediaDetailLoading();
  try{
    const response=await fetch(mediaItemUrl(id));
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload=await response.json();
    const item=payload[id];
    if(!item) throw new Error('media item missing from shard');
    if(item.canonicalId){
      history.replaceState(null, '', '#id=' + encodeURIComponent(item.canonicalId));
      return initMediaDetail();
    }
    document.getElementById('mediaDetailHero').removeAttribute('aria-busy');
    renderMediaDetail(item);
  }catch(error){document.getElementById('mediaDetailHero').innerHTML='<div class="media-not-found"><h1>这项内容正在整理中</h1><a href="media.html">返回书影音库</a></div>';}
}

if(location.protocol !== 'file:'){
  initMediaBackToTop();
  if(document.getElementById('mediaGrid')) initMediaIndex();
  if(document.getElementById('mediaDetailHero')) initMediaDetail();
}
