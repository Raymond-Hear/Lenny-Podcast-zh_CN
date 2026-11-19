<div align="center">

# 🎙️ Lenny 播客 · 中文访谈库

从一个工作问题出发，找到相关嘉宾的访谈，读中文，再回到英文和原节目核对。

[![公开仓库收录 329 期](https://img.shields.io/badge/访谈-329_期-176b5b)](website/data/episodes/)
[![中英对照阅读](https://img.shields.io/badge/阅读-中英对照-246292)](#阅读一场访谈)
[![代码许可 MIT](https://img.shields.io/badge/代码许可-MIT-805531)](LICENSE)

**[在线阅读 · 飞书妙搭](https://e34unmxckz.feishuapp.com/app/app_17ab90dg2v8)**　·　[下载公开版 ZIP](https://github.com/Raymond-Hear/Lenny-Podcast-zh_CN/archive/refs/heads/main.zip)　·　[本地打开](#在自己的电脑上打开)　·　[问题反馈](https://github.com/Raymond-Hear/Lenny-Podcast-zh_CN/issues)

</div>

## 阅读一场访谈

想知道 Airbnb 的 Brian Chesky 如何做产品决策？在访谈库里搜他的名字，打开《布莱恩·切斯基的新策略手册》。先读「这期值得带走的观点」和「这期聊什么」，再到正文里看他如何解释这些判断。切换 **EN** 可以核对措辞，想听语气和上下文时，可以打开原视频。[这期的原节目](https://www.youtube.com/watch?v=4ef0juAMqoE)

| 你想做什么 | 从哪里开始 |
| --- | --- |
| 找某位嘉宾，或找讨论同一主题的节目 | 在首页搜索嘉宾、公司或关键词，也可以用主题筛选。 |
| 读懂一段话，再核对出处 | 在单期页读中文正文，切换英文，按发言人和时间戳回到原节目。 |
| 用自己的工具做索引、笔记或主题对照 | 从[双语正文](website/data/episodes/)读取每期的 `turns`。每段包含发言人 `speaker`、原稿时间 `ts`、英文 `en` 和中文 `zh`；标题、章节及节目链接见[单期资料](website/data/episode-meta/)。 |

## 在自己的电脑上打开

1. 下载页面顶部的 ZIP，解压后进入能看到 `README.md` 和 `website` 的文件夹。
2. 安装 Python 3，在这个文件夹打开终端，运行下面的命令。
3. 浏览器会自动打开访谈库。若没有弹出，复制终端显示的本机地址；阅读期间保持窗口开启。

```bash
python website/serve.py
```

macOS 或 Linux 上如果命令名是 `python3`，运行 `python3 website/serve.py`。端口由程序自动选择。

<details>
<summary>公开仓库与维护者本地版有什么区别？</summary>

公开仓库收录 329 期。2026 年 11 月 19 日，本地访谈库新增 19 期，共 348 期；旧 329 期的中文重译另存为独立的本地阅读版。这两批更新目前均供本地阅读。

拿到完整维护工作区时，Windows 用户也可以双击根目录的「打开网站.cmd」。新增原稿放入「01-待更新」，归档在「02-原文归档」，使用和部署说明在「03-项目文档」。

</details>

## 网站托管

阅读站使用静态网页和 JSON，可部署到 GitHub Pages。公开站包含访谈库、单期正文和关于作者三类页面。维护者准备发布时，先确认可公开的节目范围，再把三页的资源路径改为相对路径，将静态成品放到独立的 `gh-pages` 分支根目录，在 **Settings → Pages** 选择该分支和 **/(root)**。现有飞书包使用妙搭专用路径，需要单独准备 Pages 版本。[GitHub Pages 发布设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 来源与反馈

访谈整理自 Lenny Rachitsky 公开发布的播客。如发现翻译、人物或时间戳有误，或涉及侵权，请附上节目名和对应段落，我会更正错误或删除侵权内容。[提交 GitHub Issue](https://github.com/Raymond-Hear/Lenny-Podcast-zh_CN/issues)

项目代码使用 MIT 许可。播客原文及衍生内容依其来源条款使用；公开入门数据集的条款允许分享个人非商业项目，同时限制原始文件的再分发。引用访谈时请保留嘉宾、节目和原始出处。[代码许可](LICENSE) · [内容说明](CONTENT_NOTICE.md) · [上游条款](https://github.com/LennysNewsletter/lennys-newsletterpodcastdata/blob/main/LICENSE.md)

**相关资料**　[Lenny’s Newsletter](https://www.lennysnewsletter.com/) · [英文逐字稿合集](https://www.dropbox.com/scl/fo/yxi4s2w998p1gvtpu4193/AMdNPR8AOw0lMklwtnC0TrQ?rlkey=j06x0nipoti519e0xgm23zsn9&e=3&st=m01vhfa1&dl=0) · [Lenny Skills](https://refoundai.com/lenny-skills/)

## 关于作者

由**聆风Raymond**整理和维护。如果你用这些访谈做了主题索引、阅读工具或其他作品，也欢迎在 Issues 分享。我的文章、网站和工具收录在[个人网站](https://lingfengya.cn/)。
