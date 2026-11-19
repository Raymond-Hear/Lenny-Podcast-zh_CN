const ABOUT_LANG = localStorage.getItem('lenny_lang') || 'zh';
const ABOUT_COPY = {
  zh: {
    personalSite:'访问我的个人网站',
    sourceNote:'本站访谈整理自 Lenny Rachitsky 公开发布的播客。',
    feedbackIntro:'如发现内容有误或涉及侵权，欢迎通过 ',
    feedbackAction:' 告知，我会更正错误或删除侵权内容。',
    personalSiteIntro:'我把最近写的文章、做的网站和工具，都放在这里。',
    siteTitle:'Lenny 播客知识库', library:'访谈录', map:'知识地图', media:'书影音库', project:'项目', updates:'更新日志', about:'关于作者',
    title:'关于 · 聆风 Raymond', kicker:'ABOUT LINGFENG RAYMOND',
    hero:'嘿！我是聆风Raymond。',
    intro:'我平时喜欢折腾产品、增长、创业、AI 和个人知识系统。我把自己会反复翻看的 Lenny 访谈整理在这里，方便大家按嘉宾和主题查找、对照原话。',
    openSourceKicker:'OPEN SOURCE', openSourceTitle:'查看项目代码', openSourceBody:'在 GitHub 查看项目实现，也可以提交问题或分享使用建议。', openSourceAction:'查看开源仓库 ↗',
    whatKicker:'WHAT I DO', whatTitle:'让内容真正能用', whatBody:'把高质量访谈、文章和公开资料拆成主题、人物、观点、案例和方法，重新组织成可以检索、比较、引用和继续延展的知识资产。',
    whyKicker:'WHY THIS EXISTS', whyTitle:'从学习到复用', whyBody:'内容很丰富，真正困难的是怎么更好地使用它。这里把长音频和长逐字稿变成可进入的地图：从问题出发，找到观点、嘉宾和来源，再把收获带回自己的工作。',
    principleKicker:'PRINCIPLES', principleTitle:'持续沉淀方法', principleBody:'尽量保留来源、上下文和不确定性，不把嘉宾观点包装成万能答案。未来会把反复验证的方法整理成更多可复用的 skill，让知识资产继续生长。',
    contactKicker:'FOLLOW', contactTitle:'继续关注', contactBody:'如果你也对知识整理、产品增长、AI 工具和内容资产感兴趣，可以通过下面几个入口找到我。'
  },
  en: {
    personalSite:'Visit my personal website',
    sourceNote:'These interviews are drawn from publicly available episodes of Lenny Rachitsky’s podcast. ',
    feedbackIntro:'If you spot an error or a copyright issue, please let me know via ',
    feedbackAction:' so I can correct the error or remove the infringing material.',
    personalSiteIntro:'You’ll find my latest writing there, along with the websites and tools I’ve built.',
    siteTitle:"Lenny's Podcast Library", library:'Episodes', map:'Knowledge map', media:'Books & media', project:'This project', updates:'Updates', about:'About',
    title:'About · Lingfeng Raymond', kicker:'ABOUT LINGFENG RAYMOND',
    hero:"Hey! I'm Lingfeng Raymond.",
    intro:'I like experimenting with product, growth, startups, AI, and personal knowledge systems. I organized the Lenny interviews I come back to so you can browse by guest or topic and check the original wording.',
    openSourceKicker:'OPEN SOURCE', openSourceTitle:'View the project code', openSourceBody:'Find the implementation on GitHub, report an issue, or share feedback.', openSourceAction:'View the open-source repo ↗',
    whatKicker:'WHAT I DO', whatTitle:'Make content usable', whatBody:'I break high-quality interviews, essays, and public materials into topics, people, ideas, cases, and methods, then reorganize them into knowledge assets that can be searched, compared, cited, and extended.',
    whyKicker:'WHY THIS EXISTS', whyTitle:'From learning to reuse', whyBody:'The content is rich; the hard part is using it well. This site turns long audio and transcripts into a map: start with a question, find the ideas, guests, and sources, then bring the learning back to your work.',
    principleKicker:'PRINCIPLES', principleTitle:'Keep distilling methods', principleBody:'Keep sources, context, and uncertainty visible, and do not turn guest opinions into universal answers. Over time, I will turn repeatedly validated methods into more reusable skills so the knowledge assets can keep growing.',
    contactKicker:'FOLLOW', contactTitle:'Follow along', contactBody:'If you are interested in knowledge work, product growth, AI tools, and content assets, these are the best places to find me.'
  }
};

function applyAboutLanguage(){
  const copy = ABOUT_COPY[ABOUT_LANG];
  document.documentElement.lang = ABOUT_LANG;
  document.title = copy.title;
  document.querySelectorAll('[data-about-i18n]').forEach(el => {
    el.textContent = copy[el.dataset.aboutI18n] || el.textContent;
  });
  const toggle = document.getElementById('langToggle');
  toggle.textContent = ABOUT_LANG === 'zh' ? 'EN' : '中文';
  toggle.onclick = () => {
    localStorage.setItem('lenny_lang', ABOUT_LANG === 'zh' ? 'en' : 'zh');
    location.reload();
  };
}

function initBackToTop(){
  const button = document.getElementById('backToTop');
  if(!button) return;
  const sync = () => button.classList.toggle('show', window.scrollY > 520);
  button.onclick = () => window.scrollTo({top:0, behavior:'smooth'});
  window.addEventListener('scroll', sync, {passive:true});
  sync();
}

applyAboutLanguage();
initBackToTop();
