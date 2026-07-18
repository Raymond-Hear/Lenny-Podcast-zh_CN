/* Lenny Podcast Library */
if(location.protocol==='file:'){
  location.replace(`http://127.0.0.1:8011/${location.pathname.split('/').pop()}${location.search}${location.hash}`);
}
const I18N = {
  zh:{
    siteTitle:'Lenny 播客知识库', libraryNav:'访谈录', knowledgeNav:'知识地图', mediaNav:'书影音库', projectNav:'项目', aboutNav:'关于网站作者', heroKicker:'人物 · 观点 · 方法',
    heroTitle:'从 329 场对话里，找到能解决问题的方法',
    siteSub:'按嘉宾、问题和主题进入访谈，再沿着观点与方法之间的联系继续探索。',
    episodes:'期完整访谈', searchPH:'搜索嘉宾、访谈主题、公司或关键词…',
    topicLabel:'内容主题', idLabel:'嘉宾身份', all:'全部', clear:'清除筛选',
    results:'场访谈', summaryKicker:'ABOUT THIS EPISODE', summaryTitle:'这期聊什么',
    bioKicker:'ABOUT THE GUEST', bioTitle:'嘉宾档案', transcriptKicker:'FULL TRANSCRIPT', transcriptTitle:'访谈正文',
    recommendationKicker:'GUEST PICKS', recommendationTitle:'嘉宾推荐',
    recommendationNote:'节目中提到的书、文章、视频和其他灵感来源。',
    insightKicker:'KEY INSIGHTS', insightTitle:'这期值得带走的观点', insightNote:'先看观点，再决定是否深入阅读完整访谈。每条内容都可追溯到本期原文。',
    relatedKicker:'CONNECTED IDEAS', relatedTitle:'继续沿着这个问题探索', sourceEpisode:'来源：本期访谈',
    referenceKicker:'REFERENCED', referenceTitle:'相关资料', back:'返回访谈目录',
    watchYT:'观看 YouTube 原片', openOfficial:'打开官方节目页', empty:'没有找到匹配的访谈，试试换一个关键词。',
    zhPending:'这部分中文正在生成，暂时显示英文原文。', officialTopic:'YouTube 官方主题',
    published:'发布于', resources:'份相关资料', picks:'项嘉宾推荐', showAll:'查看全部资料', showLess:'收起',
    book:'书籍', video:'影视 / 视频', audio:'播客 / 音乐', article:'文章', link:'链接', sourceLink:'原始链接', douban:'豆瓣',
  },
  en:{
    siteTitle:"Lenny's Podcast Library", libraryNav:'Episodes', knowledgeNav:'Knowledge map', mediaNav:'Books & media', projectNav:'This project', aboutNav:'About', heroKicker:'PEOPLE · TOPICS · PLAYBOOKS',
    heroTitle:'Find the conversation you need right now',
    siteSub:"Browse 329 deep-dive interviews by guest, official episode title, or topic.",
    episodes:'full episodes', searchPH:'Search guests, episode titles, companies, or keywords…',
    topicLabel:'Topic', idLabel:'Guest type', all:'All', clear:'Clear filters',
    results:'episodes', summaryKicker:'ABOUT THIS EPISODE', summaryTitle:'What this episode covers',
    bioKicker:'ABOUT THE GUEST', bioTitle:'Guest profile', transcriptKicker:'FULL TRANSCRIPT', transcriptTitle:'Full transcript',
    recommendationKicker:'GUEST PICKS', recommendationTitle:'Guest recommendations',
    recommendationNote:'Books, articles, videos, and other sources of inspiration mentioned in the episode.',
    insightKicker:'KEY INSIGHTS', insightTitle:'Ideas worth taking away', insightNote:'Review the ideas first, then decide whether to read the full interview. Every item traces back to this episode.',
    relatedKicker:'CONNECTED IDEAS', relatedTitle:'Keep exploring this question', sourceEpisode:'Source: this episode',
    referenceKicker:'REFERENCED', referenceTitle:'Referenced resources', back:'Back to episode library',
    watchYT:'Watch on YouTube', openOfficial:'Open official episode', empty:'No matching episodes. Try a different keyword.',
    zhPending:'Chinese translation is being generated; showing the English original for now.', officialTopic:'Official YouTube topic',
    published:'Published', resources:'references', picks:'guest picks', showAll:'Show all resources', showLess:'Show less',
    book:'Book', video:'Video', audio:'Audio', article:'Article', link:'Link', sourceLink:'Source', douban:'Douban',
  }
};

const ID = {
  '创始人/CEO':{en:'Founder / CEO',zh:'创始人 / CEO'}, '工程/AI':{en:'Engineering / AI',zh:'工程 / AI'},
  '营销/增长':{en:'Marketing / Growth',zh:'营销 / 增长'}, '投资':{en:'Investor',zh:'投资人'},
  '产品':{en:'Product',zh:'产品'}, '设计':{en:'Design',zh:'设计'},
  '作者/思想者':{en:'Author / Thinker',zh:'作者 / 思想者'}, '其他':{en:'Other',zh:'其他'}
};

let LANG = localStorage.getItem('lenny_lang') || 'zh';
const t = key => I18N[LANG]?.[key] || key;
const idLabel = value => ID[value]?.[LANG] || value;
const pick = field => LANG === 'zh' && field?.zh ? field.zh : field?.en || '';
const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const hasUrl = value => /^https?:\/\//i.test(value || '');
const safeUrl = value => /^https?:\/\//i.test(value || '') ? value : '#';
const formatDate = value => value ? new Intl.DateTimeFormat(LANG === 'zh' ? 'zh-CN' : 'en-US', {year:'numeric',month:'short',day:'numeric'}).format(new Date(value)) : '';
const setLang = value => { LANG = value; localStorage.setItem('lenny_lang', value); location.reload(); };

function avatarSVG(name, isHost){
  const words = name.trim().split(/\s+/);
  let initials = isHost ? 'L' : words.slice(0,2).map(word => word[0] || '').join('').toUpperCase();
  const palette = ['#ba3f24','#176b5b','#315a82','#8a5529','#6f4d85','#98612d'];
  let hash = 0; for(const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const bg = isHost ? '#1c2521' : palette[hash % palette.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="40" fill="${bg}"/><text x="40" y="52" font-size="30" fill="#fff" text-anchor="middle" font-family="Georgia,serif" font-weight="700">${esc(initials)}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function applyStatic(){
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  const search = document.getElementById('search'); if(search) search.placeholder = t('searchPH');
  const toggle = document.getElementById('langToggle'); if(toggle) toggle.textContent = LANG === 'zh' ? 'EN' : '中文';
}

/* Index */
let INDEX = [];
let indexObserver = null;
const indexInitialCount = () => window.matchMedia('(max-width:640px)').matches ? 12 : 24;
const indexPageSize = () => window.matchMedia('(max-width:640px)').matches ? 12 : 18;
const state = {topic:null, ident:null, q:'', visible:indexInitialCount(), loading:false};

function showIndexLoading(){
  const grid=document.getElementById('grid');
  document.getElementById('resultCount').innerHTML='<span class="loading-copy"><i></i>正在整理访谈目录</span>';
  grid.setAttribute('aria-busy','true');
  grid.innerHTML=Array.from({length:indexInitialCount()},(_,index)=>`<div class="skeleton-card" style="--delay:${index*35}ms" aria-hidden="true"><div class="skeleton-cover"></div><div class="skeleton-body"><i></i><b></b><b></b><span></span></div></div>`).join('');
}

async function initIndex(){
  document.getElementById('langToggle').onclick = () => setLang(LANG === 'zh' ? 'en' : 'zh');
  document.getElementById('clearFilters').onclick = clearFilters;
  initBackToTop();
  applyStatic();
  showIndexLoading();
  try{
    const response = await fetch('data/index-lite.json');
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    INDEX = await response.json();
    if(!Array.isArray(INDEX) || !INDEX.length) throw new Error('empty episode index');
    document.getElementById('grid').removeAttribute('aria-busy');
    buildControls(); renderIndex(); initInfiniteIndex();
  }catch(error){
    const empty = document.getElementById('empty');
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    grid.removeAttribute('aria-busy');
    document.getElementById('resultCount').textContent = LANG === 'zh' ? '访谈内容正在整理中' : 'The episode library is being prepared';
    empty.hidden = false;
    empty.innerHTML = `<p>${LANG === 'zh' ? '更多内容正在陆续归档，稍后刷新即可继续浏览。' : 'More conversations are being added. Refresh again shortly.'}</p><button class="retry-button" type="button">${LANG === 'zh' ? '刷新看看' : 'Refresh'}</button>`;
    empty.querySelector('button').onclick = () => location.reload();
    console.error(error);
  }
}

function buildControls(){
  const topics = {}, identities = {};
  INDEX.forEach(episode => {
    (episode.topics?.length ? episode.topics : [episode.category]).filter(Boolean).forEach(topic => topics[topic] = (topics[topic] || 0) + 1);
    identities[episode.identity] = (identities[episode.identity] || 0) + 1;
  });
  buildFilterRow(document.getElementById('topicFilters'), 'topic', topics, t('topicLabel'));
  buildFilterRow(document.getElementById('idFilters'), 'ident', identities, t('idLabel'));
  document.getElementById('search').oninput = event => { state.q = event.target.value.trim().toLowerCase(); resetIndexPaging(); renderIndex(); };
}

function buildFilterRow(box, kind, values, label){
  const entries = Object.entries(values).sort((a,b) => b[1] - a[1]);
  box.innerHTML = `<span class="filter-label">${esc(label)}</span>${filterChip(kind, null, INDEX.length)}` +
    entries.map(([value,count]) => filterChip(kind,value,count)).join('');
  box.querySelectorAll('.chip').forEach(chip => chip.onclick = () => {
    state[kind] = chip.dataset.value || null;
    resetIndexPaging(); markActive(box, state[kind]); renderIndex();
  });
}

function filterChip(kind, value, count){
  const label = value == null ? t('all') : kind === 'ident' ? idLabel(value) : value;
  return `<button class="chip ${state[kind] === value ? 'active' : ''}" data-value="${esc(value || '')}">${esc(label)}<span>${count}</span></button>`;
}

function markActive(box, value){
  box.querySelectorAll('.chip').forEach(chip => chip.classList.toggle('active', (chip.dataset.value || null) === value));
}

function clearFilters(){
  state.topic = state.ident = null; state.q = '';
  resetIndexPaging();
  document.getElementById('search').value = '';
  document.querySelectorAll('.filter-row').forEach(row => markActive(row,null));
  renderIndex();
}

function resetIndexPaging(){
  state.visible = indexInitialCount();
}

function initInfiniteIndex(){
  const sentinel = document.getElementById('loadSentinel');
  if(!sentinel || !('IntersectionObserver' in window)) return;
  indexObserver = new IntersectionObserver(entries => {
    if(entries.some(entry => entry.isIntersecting) && !state.loading && !sentinel.hidden){
      state.loading = true;
      state.visible += indexPageSize();
      requestAnimationFrame(() => {
        renderIndex(true);
        state.loading = false;
      });
    }
  }, {rootMargin:'360px 0px'});
  indexObserver.observe(sentinel);
}

function searchableText(episode){
  return [episode.name, pick(episode.episodeTitle), episode.episodeTitle?.en, episode.category, episode.identity,
    ...(episode.topics || []), pick(episode.bio), pick(episode.guestBioOfficial), pick(episode.summary)]
    .filter(Boolean).join(' ').toLowerCase();
}

function indexThumbnail(url){
  if(!url || !url.includes('i.ytimg.com/vi_webp/')) return url;
  return url.replace('/maxresdefault.webp', '/mqdefault.webp');
}

function indexCardMarkup(episode,index){
  const title = pick(episode.episodeTitle) || pick(episode.summary) || episode.name;
  const originalImage = episode.thumbnail || avatarSVG(episode.name,false);
  const image = indexThumbnail(originalImage);
  const topics = (episode.topics?.length ? episode.topics : [episode.category]).filter(Boolean).slice(0,3);
  const bio = pick(episode.guestBioOfficial) || pick(episode.bio) || '';
  const facts = [];
  if(episode.recommendationCount) facts.push(`${episode.recommendationCount} ${t('picks')}`);
  if(episode.referenceCount) facts.push(`${episode.referenceCount} ${t('resources')}`);
  const priority = index < 6;
  return `<a class="card" href="episode.html#id=${encodeURIComponent(episode.id)}">
    <div class="card-image"><img src="${esc(image)}" alt="${esc(episode.name)}" width="480" height="270" loading="${priority?'eager':'lazy'}" fetchpriority="${priority?'high':'low'}" decoding="async" onload="this.parentElement.classList.add('is-loaded')" onerror="this.onerror=null;this.src='${esc(originalImage)}'">${LANG === 'zh' ? `<span class="cover-title">${esc(title)}</span>` : ''}</div>
    <div class="card-body">
      <div class="card-guest"><span>${esc(episode.name)}</span><span class="guest-role">${esc(idLabel(episode.identity))}</span></div>
      <h2>${esc(title)}</h2>
      <div class="topic-row">${topics.map(topic => `<span class="tag">${esc(topic)}</span>`).join('')}</div>
      <p>${esc(bio)}</p>
      <div class="card-foot"><span>${esc(formatDate(episode.publishedAt))}</span><span>${esc(facts.join(' · '))}</span></div>
    </div>
  </a>`;
}

function renderIndex(append=false){
  const list = INDEX.filter(episode => {
    if(state.topic && !(episode.topics || [episode.category]).includes(state.topic)) return false;
    if(state.ident && episode.identity !== state.ident) return false;
    return !state.q || searchableText(episode).includes(state.q);
  });
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const visible = list.slice(0, state.visible);
  document.getElementById('resultCount').innerHTML = `<strong>${list.length}</strong> ${t('results')}<span class="result-loaded"> · ${Math.min(visible.length, list.length)}/${list.length}</span>`;
  document.getElementById('clearFilters').hidden = !(state.topic || state.ident || state.q);
  const sentinel = document.getElementById('loadSentinel');
  if(sentinel) sentinel.hidden = !list.length || visible.length >= list.length;
  if(!list.length){ grid.innerHTML = ''; empty.hidden = false; empty.textContent = t('empty'); return; }
  empty.hidden = true;
  const start = append ? grid.children.length : 0;
  if(!append) grid.innerHTML = '';
  const additions = visible.slice(start);
  if(additions.length) grid.insertAdjacentHTML('beforeend', additions.map((episode,index) => indexCardMarkup(episode,start+index)).join(''));
}

/* Episode */
async function initEpisode(){
  const id = new URLSearchParams(location.search).get('id') || new URLSearchParams(location.hash.slice(1)).get('id');
  document.getElementById('langToggle').onclick = () => setLang(LANG === 'zh' ? 'en' : 'zh');
  initBackToTop();
  applyStatic();
  document.getElementById('back').textContent = '← ' + t('back');
  document.getElementById('epHead').innerHTML='<div class="episode-loading" aria-busy="true"><div class="skeleton-cover"></div><div class="episode-loading-copy"><span class="loading-copy"><i></i>正在打开这期访谈</span><b></b><b></b><b></b></div></div>';
  if(!id) return showNotFound();
  try{
    const [response, metadataResponse] = await Promise.all([
      fetch('data/episodes/' + encodeURIComponent(id) + '.json'), fetch('data/episode-meta/' + encodeURIComponent(id) + '.json')
    ]);
    if(!response.ok) return showNotFound();
    const episode = await response.json();
    const metadata = metadataResponse.ok ? await metadataResponse.json() : {};
    renderEpisode({...episode, ...metadata});
  }catch(error){
    showNotFound(true);
    console.error(error);
  }
}

function showNotFound(loadFailed=false){
  const message = loadFailed
    ? (LANG === 'zh' ? '这期访谈正在整理中，请稍后再来查看。' : 'This episode is still being prepared. Please check back shortly.')
    : (LANG === 'zh' ? '没有找到这期访谈。' : 'Episode not found.');
  document.getElementById('epHead').innerHTML = `<div class="data-error"><h1>${esc(message)}</h1><button class="retry-button" type="button">${LANG === 'zh' ? '重新加载' : 'Try again'}</button></div>`;
  document.querySelector('#epHead button').onclick = () => location.reload();
}

function renderEpisode(episode){
  const title = pick(episode.episodeTitle) || episode.name;
  const image = episode.thumbnail || avatarSVG(episode.name,false);
  const topics = (episode.topics?.length ? episode.topics : [episode.category]).filter(Boolean);
  document.title = `${title} · ${t('siteTitle')}`;
  document.getElementById('epHead').innerHTML = `
    <div class="episode-cover"><img src="${esc(image)}" alt="${esc(episode.name)}" width="960" height="540" loading="eager" fetchpriority="high" decoding="async">${LANG === 'zh' ? `<span class="cover-title cover-title-large">${esc(title)}</span>` : ''}</div>
    <div class="episode-intro">
      <div class="section-kicker">${esc(t('officialTopic'))}</div>
      <h1>${esc(title)}</h1>
      <div class="guest-line"><strong>${esc(episode.name)}</strong><span>${esc(idLabel(episode.identity))}</span></div>
      <div class="topic-row">${topics.map(topic => `<span class="tag">${esc(topic)}</span>`).join('')}</div>
      <div class="episode-actions">
        ${hasUrl(episode.youtube) ? `<a class="yt-btn" href="${esc(safeUrl(episode.youtube))}" target="_blank" rel="noopener">▶ ${esc(episode.source?.platform === 'YouTube' ? t('watchYT') : t('openOfficial'))}</a>` : ''}
        ${episode.publishedAt ? `<span class="publish-date">${esc(t('published'))} ${esc(formatDate(episode.publishedAt))}</span>` : ''}
      </div>
    </div>`;

  renderTextBlock('summary', episode.summary);
  renderEpisodeInsights(episode.knowledge?.insights || []);
  renderTextBlock('bio', episode.guestBioOfficial?.en ? episode.guestBioOfficial : episode.bio, episode.bio);
  renderChapters(episode.chapters || []);
  renderSocials(episode.socials || []);
  renderResources('recommendations', episode.recommendations || [], 'recommendationPanel', true);
  renderResources('references', episode.references || [], 'referencePanel', false);
  renderRelatedEpisodes(episode.knowledge, episode.knowledgeEpisodes || []);
  renderTranscript(episode);
}

function renderEpisodeInsights(insights){
  if(!insights.length) return;
  document.getElementById('episodeInsightPanel').hidden = false;
  document.getElementById('episodeInsights').innerHTML = insights.map((item,index) => `<article class="episode-insight"><span>${String(index+1).padStart(2,'0')} · ${esc(item.type)}</span><h3>${esc(item.title)}</h3><p>${esc(item.detail)}</p><small>${esc(t('sourceEpisode'))}</small></article>`).join('');
}

function renderRelatedEpisodes(entry, allEpisodes){
  if(!entry?.related?.length) return;
  const items = entry.related.map(relation => ({relation,episode:allEpisodes.find(item => item.id === relation.episodeId)})).filter(item => item.episode).slice(0,6);
  if(!items.length) return;
  document.getElementById('relatedPanel').hidden = false;
  document.getElementById('relatedEpisodes').innerHTML = items.map(({relation,episode}) => `<a href="episode.html#id=${encodeURIComponent(episode.id)}"><span>${esc(relation.sharedTopics.join(' · '))}</span><strong>${esc(episode.guest)}</strong><p>${esc(LANG === 'zh' ? episode.title?.zh || episode.title?.en : episode.title?.en || episode.guest)}</p></a>`).join('');
}

function renderTextBlock(id, preferred, fallback){
  const box = document.getElementById(id);
  const selected = pick(preferred) || pick(fallback) || '—';
  const pending = LANG === 'zh' && !(preferred?.zh || fallback?.zh);
  box.innerHTML = `${pending ? `<div class="fallback-note">${esc(t('zhPending'))}</div>` : ''}<div class="body">${esc(selected)}</div>`;
}

function renderChapters(chapters){
  const box = document.getElementById('chapters');
  if(!chapters.length){ box.hidden = true; return; }
  box.innerHTML = chapters.slice(0,8).map(chapter => `<div class="chapter"><span>${esc(chapter.time)}</span><p>${esc(LANG === 'zh' && chapter.titleZh ? chapter.titleZh : chapter.title)}</p></div>`).join('');
}

function renderSocials(socials){
  const box = document.getElementById('socials');
  if(!socials.length){ box.hidden = true; return; }
  box.innerHTML = socials.map(item => `<a href="${esc(safeUrl(item.url))}" target="_blank" rel="noopener"><span>${esc(item.platform)}</span><b>↗</b></a>`).join('');
}

function renderResources(id, resources, panelId, cards){
  const panel = document.getElementById(panelId);
  if(!resources.length){ panel.hidden = true; return; }
  panel.hidden = false;
  const box = document.getElementById(id);
  const visible = cards ? resources : resources.slice(0,8);
  box.innerHTML = visible.map(item => resourceItem(item,cards)).join('');
  if(!cards && resources.length > 8){
    const button = document.createElement('button'); button.className = 'show-more'; button.textContent = t('showAll') + ` (${resources.length})`;
    let expanded = false;
    button.onclick = () => { expanded = !expanded; box.innerHTML = (expanded ? resources : resources.slice(0,8)).map(item => resourceItem(item,false)).join(''); button.textContent = expanded ? t('showLess') : t('showAll') + ` (${resources.length})`; };
    panel.appendChild(button);
  }
}

function resourceItem(item, cards){
  const type = item.type || 'link';
  const useTranslation = LANG === 'zh' && item.titleZh && type !== 'book';
  const title = useTranslation ? item.titleZh : item.title;
  const original = useTranslation && item.titleZh !== item.title ? `<small class="resource-original">${esc(item.title)}</small>` : '';
  const source = safeUrl(item.url);
  const douban = item.doubanUrl ? `<a class="douban-link" href="${esc(safeUrl(item.doubanUrl))}" target="_blank" rel="noopener">${esc(t('douban'))} ↗</a>` : '';
  return `<div class="resource ${cards ? 'resource-card' : ''}">
    <span class="resource-type">${esc(t(type))}</span>
    <a class="resource-title" href="${esc(source)}" target="_blank" rel="noopener"><strong>${esc(title)}</strong>${original}</a>
    <span class="resource-actions"><a href="${esc(source)}" target="_blank" rel="noopener">${esc(t('sourceLink'))} ↗</a>${douban}</span>
  </div>`;
}

function renderTranscript(episode){
  const groups = [];
  let current = null;
  episode.turns.forEach(turn => {
    const name = turn.speaker || 'Guest';
    if(!current || current.name !== name){ current = {name,isHost:name === 'Lenny',segs:[]}; groups.push(current); }
    current.segs.push(turn);
  });
  document.getElementById('chat').innerHTML = groups.map(group => {
    const segments = group.segs.map(turn => {
      const original = LANG === 'zh' && !turn.zh ? `<span class="orig-tag">原文</span>` : '';
      const timestamp = turn.ts ? `<span class="ts">${esc(turn.ts)}</span>` : '';
      return `<p class="seg">${timestamp}${esc(pick(turn) || turn.zh || turn.en || '')}${original}</p>`;
    }).join('');
    return `<div class="msg ${group.isHost ? 'host' : 'guest'}"><img class="avatar" src="${avatarSVG(group.name,group.isHost)}" alt=""><div class="col"><div class="who">${esc(group.name)}</div><div class="bubble">${segments}</div></div></div>`;
  }).join('');
}

if(document.getElementById('grid')) initIndex();
else if(document.getElementById('epHead')) initEpisode();

function initBackToTop(){
  const button = document.getElementById('backToTop');
  if(!button) return;
  const sync = () => button.classList.toggle('show', window.scrollY > 520);
  button.onclick = () => window.scrollTo({top:0, behavior:'smooth'});
  window.addEventListener('scroll', sync, {passive:true});
  sync();
}
