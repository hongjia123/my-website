"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[68],{3068:function(e,t,a){a.r(t),a.d(t,{default:function(){return r}});var l=a(2173),c=a.p+"static/img/tcp.23ab242e.png",r={setup(){return()=>(0,l.createVNode)("div",{class:"hp-container"},[(0,l.createVNode)("h1",null,[(0,l.createTextVNode)("HTTP")]),(0,l.createVNode)("div",{class:"web-content"},[(0,l.createVNode)("h3",null,[(0,l.createTextVNode)("含义示例")]),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("   HTTP（Hypertext Transfer Protocol）是一种用于传输超文本的协议,用来在客户端和服务器之间传输数据。前端开发人员需要了解HTTP请求和响应的基本原理、常见的请求方法（GET、POST等）以及状态码的含义。")]),(0,l.createVNode)("br",null,null),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("它是一种被广泛应用在浏览器客户端中的应用层协议，它定义了客户端与服务端之间进行数据交互的一组规则，在和服务端建立连接后，通过携带请求消息，请求体发送数据请求。")]),(0,l.createVNode)("br",null,null),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("   我们通常是使用浏览器通过输入http协议的URL来访问 Web 服务器，事实上，浏览器并不只有这一个功能，它也可以用来在 FTP服务器上下载和上传文件，同时也具备电子邮件客户端的功能。可以说，浏览器是一个具备多种客户端功能的综合性客户端软件，因此它需要 一些东西来判断应该使用其中哪种功能来访问相应的数据，而各种不同的 URL 就是用来干这个的，比如访问 Web 服务器时用“http:”，而访问FTP服务器时用“ftp:”")])]),(0,l.createVNode)("h1",null,[(0,l.createTextVNode)("URL")]),(0,l.createVNode)("div",{className:"web-content"},[(0,l.createVNode)("h3",null,[(0,l.createTextVNode)("含义示例")]),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("   我们先从浏览器输入网址到页面展示内容谈起。")]),(0,l.createVNode)("br",null,null),(0,l.createVNode)("p",null,[(0,l.createTextVNode)('让我们来介绍一下网址。网址，准确来说应该叫URL(统一资源定位符),是用于标识和定位网络上资源的地址,它以http://开头，除了http，还有其他类型的网址，例如 "ftp","file","maito"等。 一般的话，一个完整的URL包括4个部分：协议类型(访问方法)、域名、端口号(可省略)、服务器目录文件路径；以百度网址为例：')]),(0,l.createVNode)("br",null,null),(0,l.createVNode)("code",null,[(0,l.createVNode)("i",null,[(0,l.createTextVNode)("http://www.baidu.com:80/dir/file.html")])]),(0,l.createVNode)("br",null,null),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("这表示要访问百度web服务器上路径名wei/dir/file.html的文件，也就是位于/dir/目录下的file.html这个文件")])]),(0,l.createVNode)("h1",null,[(0,l.createTextVNode)("DNS")]),(0,l.createVNode)("div",{className:"web-content"},[(0,l.createVNode)("h3",null,[(0,l.createTextVNode)("含义示例")]),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("DNS(Domain Name System),域名服务系统。将服务器名称和IP地址进行关联是DNS最常见的用法，但DNS的功能并不仅限于此，他还可以将邮件地址和邮件服务器进关联，以及为各种信息关联相印的名称")])]),(0,l.createVNode)("h1",null,[(0,l.createTextVNode)("TCP/IP")]),(0,l.createVNode)("div",{className:"web-content"},[(0,l.createVNode)("h3",null,[(0,l.createTextVNode)("IP地址基本知识")]),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("   http请求服务器数据时会生成htttp消息，然后需要委托操作系统将消息发送给web服务器，尽管浏览器能够解析网址并生成HTTP消息，但它本身并不具备将消息发送到网络中的功能， 因此这一功能需要委托操作系统来实现。在进行这一操作时，我们还有一个工作需要完成，那就是查询网址中服务器域名对应的IP地址。在委托操作系统发送消息时，必需要提供的不是通信对象的域名， 而是它的IP地址。因此因此在生成HTTP消息之后，下一个步骤就是根据域名查询IP地址。在讲解这一操作之前，让我们先来简单了解一下IP地址。")]),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("互联网和公司内部的局域网都是基于TCP/IP的思路来设计的，所以我们先来了解TCP/IP的基本思路。")]),(0,l.createVNode)("br",null,null),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("  TCP/IP结构如图所示，就是有一些小的子网，通过路由器连接起来组成一个大的网络。 这里的子网可以理解为用集线器连接起来的几台计算机。")]),(0,l.createVNode)("img",{className:"tcpimg",src:c,alt:""},null)]),(0,l.createVNode)("h1",null,[(0,l.createTextVNode)("跨域请求")]),(0,l.createVNode)("div",{className:"web-content"},[(0,l.createVNode)("h3",null,[(0,l.createTextVNode)("概述")]),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("在 HTML 中，"),(0,l.createVNode)("code",null,["<a>, <form>, <img>, <script>, <iframe>, <link>"])," ",(0,l.createTextVNode)("等标签以及 Ajax 都可以指向一个资源地址，跨域请求就是指：当前发起请求的域与该请求指向的资源所在的域不一样，凡是发送请求的url的 协议、域名、端口号三者之间任意一者与当前页面地址不同的请求。这里的域指的是这样的一个概念：我们认为若协议 + 域名 + 端口号均相同，那么就是同域")]),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("举个例子：假如一个域名为aaa.cn的网站，它发起一个资源路径为aaa.cn/books/getBookInfo的 Ajax 请求，那么这个请求是同域的，因为资源路径的协议、域名以及端口号与当前域一致（例子中协议名默认为http，端口号默认为80）。但是，如果发起一个资源路径为bbb.com/pay/purchase的 Ajax 请求，那么这个请求就是跨域请求，因为域不一致，与此同时由于安全问题，这种请求会受到同源策略限制。")])]),(0,l.createVNode)("h1",null,[(0,l.createTextVNode)("网络安全")]),(0,l.createVNode)("div",{className:"web-content"},[(0,l.createVNode)("h3",null,[(0,l.createTextVNode)("跨域请求的安全问题")]),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("通常，浏览器会对上面提到的跨域请求作出限制。浏览器之所以要对跨域请求作出限制，是出于安全方面的考虑，因为跨域请求有可能被不法分子利用来发动 CSRF攻击。")]),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("CSRF攻击：")]),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("CSRF（Cross-site request forgery），中文名称：跨站请求伪造，也被称为：one click attack/session riding，缩写为：CSRF/XSRF。CSRF攻击者在用户已经登录目标网站之后，诱使用户访问一个攻击页面，利用目标网站对用户的信任，以用户身份在攻击页面对目标网站发起伪造用户操作的请求，达到攻击目的。 CSRF 攻击的原理大致描述如下：有两个网站，其中A网站是真实受信任的网站，而B网站是危险网站。在用户登陆了受信任的A网站是，本地会存储A网站相关的Cookie，并且浏览器也维护这一个Session会话。这时，如果用户在没有登出A网站的情况下访问危险网站B，那么危险网站B就可以模拟发出一个对A网站的请求（跨域请求）对A网站进行操作，而在A网站的角度来看是并不知道请求是由B网站发出来的（Session和Cookie均为A网站的），这时便成功发动一次CSRF 攻击。")]),(0,l.createVNode)("br",null,null),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("因而 CSRF 攻击可以简单理解为：攻击者盗用了你的身份，以你的名义发送而已请求。CSRF能够做的事情包括：以你名义发送邮件，发消息，盗取你的账号，甚至于购买商品，虚拟货币转账......造成的问题包括：个人隐私泄露以及财产安全。")]),(0,l.createVNode)("br",null,null),(0,l.createVNode)("p",null,[(0,l.createTextVNode)("因此，大多数浏览器都会跨域请求作出限制，这是从浏览器层面上的对 CSRF 攻击的一种防御，但是需要注意的是在复杂的网络环境中借助浏览器来防御 CSRF 攻击并不足够，还需要从服务端或者客户端方面入手防御。详细可以参考这篇文章浅谈CSRF攻击方式")]),(0,l.createVNode)("h3",null,[(0,l.createTextVNode)("同源策略")]),(0,l.createVNode)("p",null,[(0,l.createVNode)("span",null,[(0,l.createTextVNode)("1. 同源策略是 Netscape 提出的一个著名的安全策略")]),(0,l.createVNode)("span",null,[(0,l.createTextVNode)("2. 同源策略是浏览器最核心最基础的安全策略")]),(0,l.createVNode)("span",null,[(0,l.createTextVNode)("3. 现在所有的可支持 Javascript 的浏览器都会使用这个策略")]),(0,l.createVNode)("span",null,[(0,l.createTextVNode)("4. web构建在同源策略基础之上，浏览器对非同源脚本的限制措施是对同源策略的具体实现")])])])])}}}}]);
//# sourceMappingURL=chunk-7d718fe5.3f53ab2f.js.map