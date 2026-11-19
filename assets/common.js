(function initFloatingTools() {
  if(location.protocol === 'file:' && document.querySelector('#grid, #epHead, #mediaGrid, #mediaDetailHero, #knowledgeGraph')){
    document.querySelector('main').innerHTML = '<h1>请先启动本地访谈库</h1><p>请双击项目根目录里的「打开网站.cmd」。需要 Python 3，启动后浏览器会自动打开。</p><p>也可以在项目根目录运行 <code>python website/serve.py</code>。如果浏览器没有打开，请使用命令窗口显示的实际地址。</p>';
    return;
  }
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
        <strong>扫码进入 IMA 知识库</strong>
        <em>基于 Lenny 播客内容继续提问。</em>
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
