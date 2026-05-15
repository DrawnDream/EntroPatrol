import { useState } from 'react';

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface NewsItem {
  id: number;
  title: string;
  date: string;
  summary: string;
}

interface GuideItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

function HomePage({ onFeatureClick }: { onFeatureClick: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: '智能田间感知',
      subtitle: '四足机器人自主巡田采集',
      description: '搭载多传感器的四足机器人，自动采集土壤湿度、温度、作物生长数据',
      image: '/images/slide1.png'
    },
    {
      title: 'AI 智能分析',
      subtitle: 'DeepSeek 大模型赋能',
      description: '基于深度学习的作物生长分析，精准预测病虫害、旱情预警',
      image: '/images/slide2.png'
    },
    {
      title: '数据可视化',
      subtitle: '实时监测一目了然',
      description: '直观的数据展示，实时掌握田间状况',
      image: '/images/slide3.png'
    }
  ];

  const features: FeatureItem[] = [
    { id: 1, title: '土壤监测', description: '实时采集土壤湿度、温度、电导率等数据', icon: '🌍' },
    { id: 2, title: '作物分析', description: '基于NDVI、叶绿素等指标评估作物健康', icon: '🌾' },
    { id: 3, title: '旱情预警', description: 'AI预测土壤墒情，智能灌溉建议', icon: '💧' },
    { id: 4, title: '生长预测', description: '基于历史数据预测作物生长趋势', icon: '📈' }
  ];

  const news: NewsItem[] = [
    { id: 1, title: '四足机器人田间测试取得重大突破', date: '2024-01-15', summary: '新一代四足机器人在小麦田测试中表现优异，数据采集精度提升30%' },
    { id: 2, title: 'AI分析模型更新至V2.0版本', date: '2024-01-10', summary: '新增作物病虫害预测功能，准确率达95%以上' },
    { id: 3, title: '平台用户突破10000人', date: '2024-01-05', summary: '感谢用户支持，我们将持续优化服务' }
  ];

  const guides: GuideItem[] = [
    { id: 1, title: '快速入门', description: '3分钟完成平台注册与数据查看', icon: '🚀' },
    { id: 2, title: '设备接入', description: '四足机器人连接与配置指南', icon: '🔧' },
    { id: 3, title: '数据分析', description: '如何解读土壤与作物数据报告', icon: '📊' },
    { id: 4, title: '常见问题', description: '使用过程中常见问题解答', icon: '❓' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="carousel-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="carousel-overlay"></div>
              <div className="carousel-content">
                <div className="carousel-subtitle">{slide.subtitle}</div>
                <h1 className="carousel-title">{slide.title}</h1>
                <p className="carousel-description">{slide.description}</p>
                <button className="carousel-button" onClick={onFeatureClick}>
                  立即体验
                </button>
              </div>
            </div>
          ))}
          
          <button className="carousel-prev" onClick={prevSlide}>‹</button>
          <button className="carousel-next" onClick={nextSlide}>›</button>
          
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>主要功能</h2>
            <p>基于四足机器人的智能田间感知系统</p>
          </div>
          <div className="features-grid">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="feature-card"
                onClick={onFeatureClick}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="news-section">
        <div className="section-container">
          <div className="section-header">
            <h2>平台资讯</h2>
            <a href="#" className="view-more">查看更多 →</a>
          </div>
          <div className="news-grid">
            {news.map((item) => (
              <div key={item.id} className="news-card">
                <div className="news-date">{item.date}</div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="guides-section">
        <div className="section-container">
          <div className="section-header">
            <h2>用户指南</h2>
            <p>帮助您快速上手使用平台</p>
          </div>
          <div className="guides-grid">
            {guides.map((guide) => (
              <div key={guide.id} className="guide-card">
                <div className="guide-icon">{guide.icon}</div>
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-title">🌾 智墒巡田</div>
              <p>四足机器人田间智能感知系统</p>
            </div>
            <div className="footer-links">
              <div>
                <h4>快速链接</h4>
                <ul>
                  <li><a href="#">首页</a></li>
                  <li><a href="#" onClick={onFeatureClick}>功能介绍</a></li>
                  <li><a href="#">用户指南</a></li>
                  <li><a href="#">关于我们</a></li>
                </ul>
              </div>
              <div>
                <h4>联系我们</h4>
                <ul>
                  <li>邮箱: support@zhishang.com</li>
                  <li>电话: 400-888-8888</li>
                  <li>地址: 北京市海淀区中关村科技园</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <p>© 2024 智墒巡田. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
