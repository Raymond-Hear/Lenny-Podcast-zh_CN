let KNOWLEDGE;
let activeTopic = '';
let query = '';
let visibleCount = 24;
let insightObserver = null;

const LANG = localStorage.getItem('lenny_lang') || 'zh';
const TOPIC_LABELS = {
  '领导力与管理': {zh:'领导力与管理', en:'Leadership & management'},
  '创业与融资': {zh:'创业与融资', en:'Startups & fundraising'},
  '市场营销': {zh:'市场营销', en:'Marketing'},
  '职业成长': {zh:'职业成长', en:'Career growth'},
  'AI 与智能体': {zh:'AI 与智能体', en:'AI & agents'},
  '增长': {zh:'增长', en:'Growth'},
  '产品管理': {zh:'产品管理', en:'Product management'},
  '工程与开发': {zh:'工程与开发', en:'Engineering & development'},
  '设计与用户体验': {zh:'设计与用户体验', en:'Design & UX'},
  '销售与定价': {zh:'销售与定价', en:'Sales & pricing'},
  '用户研究': {zh:'用户研究', en:'User research'},
  '特别内容': {zh:'特别内容', en:'Special episodes'}
};
const ID_LABELS = {
  '创始人/CEO': {zh:'创始人 / CEO', en:'Founder / CEO'},
  '工程/AI': {zh:'工程 / AI', en:'Engineering / AI'},
  '营销/增长': {zh:'营销 / 增长', en:'Marketing / Growth'},
  '投资': {zh:'投资人', en:'Investor'},
  '产品': {zh:'产品', en:'Product'},
  '设计': {zh:'设计', en:'Design'},
  '作者/思想者': {zh:'作者 / 思想者', en:'Author / Thinker'},
  '其他': {zh:'其他', en:'Other'}
};
const INSIGHT_TYPES = {
  '核心观点': {zh:'核心观点', en:'Key idea'},
  '方法': {zh:'方法', en:'Method'},
  '趋势判断': {zh:'趋势判断', en:'Trend'},
  '案例洞察': {zh:'案例洞察', en:'Case insight'},
  '洞察': {zh:'洞察', en:'Insight'},
  '案例': {zh:'案例', en:'Case'},
  '反例': {zh:'反例', en:'Counterexample'}
};
const K = {
  zh: {
    title:"知识地图 · Lenny 播客知识库",
    siteTitle:'Lenny 播客知识库', library:'访谈库', map:'知识地图', media:'书影音库', project:'这个项目', about:'关于网站作者',
    kicker:'KNOWLEDGE MAP · 可追溯的观点网络',
    hero:'不是收藏 329 期节目，<br>而是找到观点之间的路。',
    intro:'从主题进入，查看不同嘉宾如何回答同一个问题。每条观点都保留来源，方便继续回听、比较、验证，并为后续方法论与 Skill 做准备。',
    episodes:'期访谈', insights:'条可追溯观点', topics:'个主题入口',
    search:'搜索问题、观点、嘉宾或主题', allTopics:'全部主题',
    connectionKicker:'CONNECTIONS', connectionTitle:'主题关系面板', connectionNote:'按主题查看相关访谈、代表观点和可继续探索的问题',
    inspectorEmptyTitle:'选择一个主题或访谈', inspectorEmpty:'这里会显示主题说明、相关访谈与可追溯观点。',
    related:'相关访谈', representative:'代表观点', open:'进入完整访谈 →',
    insightKicker:'INSIGHT INDEX', insightTitle:'从观点开始阅读', current:'当前找到', currentSuffix:'条观点',
    loadMore:'继续加载', source:'查看来源访谈 →', noMatch:'没有找到匹配的观点。'
  },
  en: {
    title:"Knowledge Map · Lenny's Podcast Library",
    siteTitle:"Lenny's Podcast Library", library:'Episodes', map:'Knowledge map', media:'Books & media', project:'This project', about:'About',
    kicker:'KNOWLEDGE MAP · TRACEABLE IDEA NETWORK',
    hero:'Do not just collect 329 episodes.<br>Find the paths between ideas.',
    intro:'Start from a topic, compare how different guests answer the same question, and follow each idea back to its source episode.',
    episodes:'episodes', insights:'traceable ideas', topics:'topic entry points',
    search:'Search questions, ideas, guests, or topics', allTopics:'All topics',
    connectionKicker:'CONNECTIONS', connectionTitle:'Topic relationship board', connectionNote:'Browse topics by related episodes, representative ideas, and follow-up questions',
    inspectorEmptyTitle:'Select a topic or episode', inspectorEmpty:'Topic notes, related episodes, and traceable ideas will appear here.',
    related:'Related episodes', representative:'Representative idea', open:'Open full episode →',
    insightKicker:'INSIGHT INDEX', insightTitle:'Start from the ideas', current:'Found', currentSuffix:'ideas',
    loadMore:'Load more', source:'Open source episode →', noMatch:'No matching ideas.'
  }
};

const tr = key => K[LANG][key] || key;
const escK = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const label = (map, value) => map[value]?.[LANG] || value || '';
const topicLabel = value => label(TOPIC_LABELS, value);
const identityLabel = value => label(ID_LABELS, value);
const typeLabel = value => label(INSIGHT_TYPES, value);
const titleOf = episode => LANG === 'zh' ? episode.title?.zh || episode.title?.en || episode.guest : episode.title?.en || episode.title?.zh || episode.guest;
const summaryOf = episode => LANG === 'zh' ? episode.summary?.zh || episode.summary?.en || '' : episode.summary?.en || episode.summary?.zh || '';
const insightTitle = item => LANG === 'zh' ? item.title : (item.episode?.title?.en || item.episode?.guest || item.title);
const insightDetail = item => LANG === 'zh' ? item.detail : (item.episode?.summary?.en || item.detail);
const episodeUrl = id => `episode.html#id=${encodeURIComponent(id)}`;

async function initKnowledge(){
  const response = await fetch('data/knowledge.json');
  KNOWLEDGE = await response.json();
  applyLanguage();
  renderTopics();
  renderAll();
  initInsightObserver();
  initBackToTop();
  document.getElementById('knowledgeSearch').addEventListener('input', event => {
    query = event.target.value.trim().toLowerCase();
    visibleCount = 24;
    renderAll();
  });
  document.getElementById('moreInsights').onclick = loadMoreInsights;
}

function applyLanguage(){
  document.documentElement.lang = LANG;
  document.title = tr('title');
  document.querySelector('.brand span:last-child').textContent = tr('siteTitle');
  const nav = document.querySelectorAll('.site-nav a');
  nav[0].textContent = tr('library');
  nav[1].textContent = tr('map');
  nav[2].textContent = tr('media');
  nav[3].textContent = tr('project');
  nav[4].textContent = tr('about');
  const toggle = document.getElementById('langToggle');
  toggle.textContent = LANG === 'zh' ? 'EN' : '中文';
  toggle.onclick = () => { localStorage.setItem('lenny_lang', LANG === 'zh' ? 'en' : 'zh'); location.reload(); };
  document.querySelector('.knowledge-hero .hero-kicker').textContent = tr('kicker');
  document.querySelector('.knowledge-hero h1').innerHTML = tr('hero');
  document.querySelector('.knowledge-hero p').textContent = tr('intro');
  document.getElementById('knowledgeSearch').placeholder = tr('search');
  const headings = document.querySelectorAll('.map-heading');
  headings[0].querySelector('.section-kicker').textContent = tr('connectionKicker');
  headings[0].querySelector('h2').textContent = tr('connectionTitle');
  headings[0].querySelector('p').textContent = tr('connectionNote');
  headings[1].querySelector('.section-kicker').textContent = tr('insightKicker');
  headings[1].querySelector('h2').textContent = tr('insightTitle');
  document.getElementById('moreInsights').textContent = tr('loadMore');
  document.getElementById('graphInspector').innerHTML = `<div class="inspector-empty"><strong>${escK(tr('inspectorEmptyTitle'))}</strong><p>${escK(tr('inspectorEmpty'))}</p></div>`;
}

function renderStats(){
  document.getElementById('knowledgeStats').innerHTML = `
    <span><strong>${KNOWLEDGE.meta.episodeCount}</strong> ${tr('episodes')}</span>
    <span><strong>${KNOWLEDGE.meta.insightCount}</strong> ${tr('insights')}</span>
    <span><strong>${KNOWLEDGE.topics.length}</strong> ${tr('topics')}</span>`;
}

function renderTopics(){
  renderStats();
  const box = document.getElementById('knowledgeTopics');
  box.innerHTML = `<button class="map-chip active" data-topic="">${escK(tr('allTopics'))}</button>` +
    KNOWLEDGE.topics.map(topic => `<button class="map-chip" data-topic="${escK(topic.id)}">${escK(topicLabel(topic.id))} <span>${topic.count}</span></button>`).join('');
  box.onclick = event => {
    const button = event.target.closest('[data-topic]');
    if(!button) return;
    activeTopic = button.dataset.topic;
    visibleCount = 24;
    box.querySelectorAll('.map-chip').forEach(item => item.classList.toggle('active', item === button));
    renderAll();
  };
}

function filteredEpisodes(){
  return KNOWLEDGE.episodes.filter(episode => {
    if(activeTopic && !episode.topics.includes(activeTopic)) return false;
    if(!query) return true;
    const text = [
      episode.guest, titleOf(episode), episode.title?.en, episode.title?.zh,
      summaryOf(episode), episode.summary?.en, episode.summary?.zh, episode.identity,
      ...episode.topics.map(topicLabel),
      ...episode.insights.flatMap(item => [item.title, item.detail, typeLabel(item.type)])
    ].join(' ').toLowerCase();
    return text.includes(query);
  });
}

function renderAll(){
  renderRelationshipBoard();
  renderInsights();
}

function renderRelationshipBoard(){
  const board = document.getElementById('knowledgeGraph');
  const episodes = filteredEpisodes();
  const topics = (activeTopic ? KNOWLEDGE.topics.filter(topic => topic.id === activeTopic) : KNOWLEDGE.topics.slice(0, 8))
    .map(topic => {
      const related = episodes.filter(episode => episode.topics.includes(topic.id)).slice(0, 5);
      return {...topic, related};
    })
    .filter(topic => topic.related.length);
  board.innerHTML = topics.map(topic => relationshipCluster(topic)).join('') || `<div class="empty">${escK(tr('noMatch'))}</div>`;
  board.querySelectorAll('[data-topic-card]').forEach(card => card.onclick = () => inspectTopic(card.dataset.topicCard));
  board.querySelectorAll('[data-episode-card]').forEach(link => link.onclick = event => event.stopPropagation());
}

function relationshipCluster(topic){
  const sample = topic.related.flatMap(episode => episode.insights.map(insight => ({...insight, episode}))).slice(0, 1)[0];
  return `<article class="relationship-cluster" data-topic-card="${escK(topic.id)}">
    <div class="cluster-head">
      <span>${escK(topic.count)} ${escK(tr('episodes'))}</span>
      <h3>${escK(topicLabel(topic.id))}</h3>
    </div>
    <div class="cluster-episodes">
      ${topic.related.map(episode => `<a data-episode-card="${escK(episode.id)}" href="${episodeUrl(episode.id)}"><strong>${escK(episode.guest)}</strong><span>${escK(titleOf(episode))}</span></a>`).join('')}
    </div>
    ${sample ? `<div class="cluster-insight"><span>${escK(tr('representative'))}</span><p>${escK(insightTitle(sample))}</p></div>` : ''}
  </article>`;
}

function inspectTopic(topic){
  const episodes = KNOWLEDGE.episodes.filter(item => item.topics.includes(topic)).slice(0, 10);
  const insights = episodes.flatMap(episode => episode.insights.map(insight => ({...insight, episode}))).slice(0, 4);
  document.getElementById('graphInspector').innerHTML = `
    <span class="inspector-label">${escK(tr('connectionTitle'))}</span>
    <h3>${escK(topicLabel(topic))}</h3>
    <p>${escK(tr('related'))}: ${episodes.length}. ${escK(tr('connectionNote'))}</p>
    <div class="inspector-insights">${insights.map(item => `<div><span>${escK(typeLabel(item.type))}</span><strong>${escK(insightTitle(item))}</strong></div>`).join('')}</div>
    <div class="inspector-links">${episodes.slice(0, 6).map(item => `<a href="${episodeUrl(item.id)}"><strong>${escK(item.guest)}</strong><span>${escK(titleOf(item))}</span></a>`).join('')}</div>`;
}

function renderInsights(){
  const episodes = filteredEpisodes();
  const total = episodes.reduce((sum,item) => sum + item.insights.length, 0);
  const insights = episodes.flatMap(episode => episode.insights.map(insight => ({...insight, episode}))).slice(0, visibleCount);
  document.getElementById('insightCount').textContent = `${tr('current')} ${total} ${tr('currentSuffix')}`;
  document.getElementById('insightGrid').innerHTML = insights.map(item => `<article class="insight-card">
    <div class="insight-top"><span>${escK(typeLabel(item.type))}</span><span>${escK(topicLabel(item.episode.topics[0] || ''))}</span></div>
    <h3>${escK(insightTitle(item))}</h3>
    <p>${escK(insightDetail(item))}</p>
    <a href="${episodeUrl(item.episode.id)}"><strong>${escK(item.episode.guest)}</strong><span>${escK(tr('source'))}</span></a>
  </article>`).join('') || `<div class="empty">${escK(tr('noMatch'))}</div>`;
  document.getElementById('moreInsights').hidden = insights.length >= total;
}

function loadMoreInsights(){
  visibleCount += 24;
  renderInsights();
}

function initInsightObserver(){
  const button = document.getElementById('moreInsights');
  if(!button || !('IntersectionObserver' in window)) return;
  insightObserver = new IntersectionObserver(entries => {
    if(entries.some(entry => entry.isIntersecting) && !button.hidden) loadMoreInsights();
  }, {rootMargin:'520px 0px'});
  insightObserver.observe(button);
}

function initBackToTop(){
  const button = document.getElementById('backToTop');
  if(!button) return;
  const sync = () => button.classList.toggle('show', window.scrollY > 520);
  button.onclick = () => window.scrollTo({top:0, behavior:'smooth'});
  window.addEventListener('scroll', sync, {passive:true});
  sync();
}

initKnowledge().catch(error => {
  document.getElementById('knowledgeGraph').outerHTML = `<p class="empty">${LANG === 'zh' ? '知识数据加载失败' : 'Knowledge data failed to load'}: ${escK(error.message)}</p>`;
});
