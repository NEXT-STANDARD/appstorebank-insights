-- トレンド記事管理テーブル
CREATE TABLE trending_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  view_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  trending_type VARCHAR(20) NOT NULL CHECK (trending_type IN ('hot', 'rising', 'new')),
  priority_order INTEGER DEFAULT 0, -- 表示順序（小さいほど上位）
  is_active BOOLEAN DEFAULT true,
  image_url VARCHAR(500),
  link VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 週間トレンドレポート管理テーブル
CREATE TABLE weekly_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  week_start_date DATE NOT NULL, -- 週の開始日（月曜日）
  week_end_date DATE NOT NULL,   -- 週の終了日（日曜日）
  report_content JSONB, -- レポート内容（記事ID配列、統計データなど）
  cover_image_url VARCHAR(500),
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false, -- トップページに表示するか
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ニュースティッカー管理テーブル
CREATE TABLE news_ticker_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('regulation', 'market', 'announcement', 'update')),
  text TEXT NOT NULL,
  link VARCHAR(500),
  priority_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE, -- 表示期限
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- イベントタイムライン管理テーブル
CREATE TABLE timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('law', 'launch', 'deadline', 'conference')),
  link VARCHAR(500),
  is_completed BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  priority_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- インデックス作成
CREATE INDEX idx_trending_topics_active_priority ON trending_topics (is_active, priority_order);
CREATE INDEX idx_trending_topics_article_id ON trending_topics (article_id);
CREATE INDEX idx_weekly_reports_published_featured ON weekly_reports (is_published, is_featured);
CREATE INDEX idx_news_ticker_active_priority ON news_ticker_items (is_active, priority_order);
CREATE INDEX idx_timeline_events_active_date ON timeline_events (is_active, date);

-- updated_atの自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_trending_topics_updated_at BEFORE UPDATE ON trending_topics FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_weekly_reports_updated_at BEFORE UPDATE ON weekly_reports FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_news_ticker_items_updated_at BEFORE UPDATE ON news_ticker_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_timeline_events_updated_at BEFORE UPDATE ON timeline_events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();