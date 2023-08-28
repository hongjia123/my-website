import ".././common/css/html.less";
import cacheImg from "./img/cache.png";
import processImg from "./img/cache_process.png";
const Html4 = {
  setup() {
    return () => (
      <div>
        <p>
          缓存是网络世界中非常重要的一换，也是解决性能问题最常用的手段之一。说起缓存这个概念，貌似谁都可以说上两句，但又不能绵绵俱到地介绍。
          你可能听说过etag或if-modified-since这样的头部，但是并不能梳理好这些头部之间的关系；你可能观察过某个网站或请求的缓存策略，但是并没有亲自设计
          并应用过缓存机制；你可能为了面试准备了很多缓存理论知识，但是在实际开发中依然避免不了踩坑。
        </p>
        <br />
        <p>本节将细致总结梳理缓存方面的知识，</p>
        <br />

        <h1>缓存概念与分类</h1>
        <div className="web-content">
          <p>
            HTTP缓存是用于临时存储(缓存)Web文档(如HTML页面和图像)，以减少服务器延迟的一种信息技术。HTTP缓存系统会将通过系统的文档的副本保存下来，如果请求
            满足某些条件，则可以由缓存内容来返回请求结果。HTTP缓存系统既可以指设备，也可以指计算机程序。
          </p>
          <br />
          <p>
            <strong>《HTTP权威指南》</strong>
            一书中这样介绍缓存：在前端开发中，性能一直是被大家所重视的一点，然后判断一个网站性能
            如何的最直观的方法就是看网页打开的速度。其中，提高网页打开速度的一个方式就是使用缓存。一个优秀的缓存策略可以缩短网页请求资源的距离，减少延迟，并且由于
            缓存可以重复利用，因此可以减少带宽，降低网络负荷。下面我们就来看一看服务器端缓存的原理。
          </p>
          <br />
          <p>
            对浏览器缓存进行分类的方式有很多，按缓存位置分类可以氛分为
            <strong>内存缓存</strong>、<strong>硬盘缓存</strong>、service
            worker等
          </p>
          <br />
          <p>
            浏览器的资源缓存可以分为硬盘缓存和内存缓存两类。当首次访问网页时，自愿文件被缓存在内存中，同时也会在本地磁盘中保留一份副本。
            当用户再一次访问页面时，如果资源文件的缓存没有过期，就可以从本地磁盘加载数据并再次缓存到内存中。
          </p>
          <br />
          <p>
            &nbsp;&nbsp;如果按照缓存策略分类，浏览器的资源缓存可以分为强缓存、协商缓存,如图所示
          </p>
          <br />
          <img src={cacheImg} alt="" className="cache-img" />
          <br />
          <p>
            说到底，缓存的核心就是解决什么时候使用缓存、什么时候更新缓存的问题。
          </p>
        </div>
        <h1>流程图</h1>
        <div className="web-content">
          <p>
            <img src={processImg} alt="" className="processImg" />
          </p>
          <br />
          <p>
            强制缓存的优先级最高，并且缓存有效期内浏览器不会因为自愿的改动而发送请求，因此强制缓存的使用适用于大型且不易修改的资源文件，例如，第三方的CSS、JS文件或图片自愿。如果想提高缓存的灵活性，也可以为文件名加上hash标识进行版本的区分
          </p>
          <br />
          <p>
            协商缓存灵活性最高，使用于数据的缓存，根据上述介绍，采用etag标识比对文件内容是否发生变化的灵活度最高，也最为可靠。对数据的缓存，
            我们可以重点考虑将数据缓存在内存中，因为内存加载速度最快，并且数据提交最小。
          </p>
        </div>
      </div>
    );
  },
};
export default Html4;
