(function initFloatingTools() {
  if (document.querySelector('.floating-tool-rail')) return;

  const rail = document.createElement('aside');
  rail.className = 'floating-tool-rail';
  rail.setAttribute('aria-label', '快速入口');
  rail.innerHTML = `
    <button class="floating-tool floating-tool-knowledge" type="button" aria-label="查看知识库二维码">
      <span class="floating-tool-icon">
        <img src="assets/ima-icon.png" alt="">
      </span>
      <span class="floating-tool-popover floating-tool-popover-qr">
        <img src="assets/lenny-ima-kb-qr.png" alt="Lenny's Podcast 问答库二维码">
        <strong>扫码向 DeepSeek 提问</strong>
        <em>基于 Lenny 播客知识库继续追问。</em>
      </span>
    </button>
    <button class="floating-tool floating-tool-wechat" type="button" aria-label="查看公众号二维码">
      <span class="floating-tool-icon">
        <img src="assets/wechat-account-icon.png" alt="">
      </span>
      <span class="floating-tool-popover floating-tool-popover-qr">
        <img src="assets/raymond-wechat-qr.jpg" alt="公众号二维码">
        <strong>关注作者公众号</strong>
        <em>了解更多 AI、知识库与内容整理实践。</em>
      </span>
    </button>
    <a class="floating-tool floating-tool-link" href="https://okjk.co/zo7xKT" target="_blank" rel="noopener" aria-label="打开即刻主页">
      <span class="floating-tool-icon">
        <img src="assets/jike-icon.png" alt="">
      </span>
      <span class="floating-tool-popover">查看作者的日常想法与内容更新。</span>
    </a>
  `;

  document.body.appendChild(rail);

  const knowledgeButton = rail.querySelector('.floating-tool-knowledge');
  if (knowledgeButton) {
    knowledgeButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
