-- アプリストアテーブルの作成
CREATE TABLE IF NOT EXISTS app_stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  company VARCHAR(255) NOT NULL,
  logo_emoji VARCHAR(10),
  logo_url TEXT,
  status VARCHAR(50) NOT NULL CHECK (status IN ('available', 'coming_soon', 'planning', 'discontinued')),
  commission_rate VARCHAR(100),
  small_business_rate VARCHAR(100),
  subscription_rate_year1 VARCHAR(100),
  subscription_rate_year2 VARCHAR(100),
  features JSONB DEFAULT '[]'::jsonb,
  supported_devices JSONB DEFAULT '[]'::jsonb,
  website_url TEXT,
  description TEXT,
  launch_date VARCHAR(100),
  is_third_party BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 999,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- インデックスの作成
CREATE INDEX idx_app_stores_status ON app_stores(status);
CREATE INDEX idx_app_stores_is_featured ON app_stores(is_featured);
CREATE INDEX idx_app_stores_display_order ON app_stores(display_order);
CREATE INDEX idx_app_stores_slug ON app_stores(slug);

-- 更新日時を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_app_stores_updated_at
  BEFORE UPDATE ON app_stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 初期データの投入
INSERT INTO app_stores (
  name, slug, company, logo_emoji, status, commission_rate, 
  features, supported_devices, website_url, description, 
  launch_date, is_third_party, is_featured, display_order
) VALUES 
(
  'Google Play Store',
  'google-play',
  'Google',
  '🟢',
  'available',
  '15-30%',
  '["広大なアプリ数", "Google決済統合", "ファミリーリンク"]'::jsonb,
  '["Android"]'::jsonb,
  'https://play.google.com',
  '世界最大のAndroidアプリストア。300万以上のアプリを提供。',
  '2008年10月',
  false,
  true,
  1
),
(
  'App Store',
  'app-store',
  'Apple',
  '🔵',
  'available',
  '15-30%',
  '["厳格な審査", "Apple決済", "ファミリー共有"]'::jsonb,
  '["iOS", "iPadOS"]'::jsonb,
  'https://apps.apple.com',
  'iOSデバイス専用の公式アプリストア。高品質なアプリを厳選。',
  '2008年7月',
  false,
  true,
  2
),
(
  'Amazon Appstore',
  'amazon-appstore',
  'Amazon',
  '🟠',
  'coming_soon',
  '20-30%',
  '["Amazonコイン", "Fire TV対応", "テスト配信"]'::jsonb,
  '["Android", "Fire OS"]'::jsonb,
  'https://www.amazon.com/appstore',
  'Amazon独自のアプリストア。2025年12月日本展開予定。',
  '2025年12月予定',
  true,
  true,
  3
),
(
  'Samsung Galaxy Store',
  'samsung-galaxy-store',
  'Samsung',
  '🔷',
  'coming_soon',
  '30%',
  '["Galaxy限定機能", "ウォッチアプリ", "テーマストア"]'::jsonb,
  '["Samsung Galaxy"]'::jsonb,
  'https://galaxystore.samsung.com',
  'Galaxy端末向け最適化アプリを提供。日本展開準備中。',
  '2025年12月予定',
  true,
  false,
  4
),
(
  'Epic Games Store',
  'epic-games-store',
  'Epic Games',
  '⚫',
  'planning',
  '12%',
  '["低手数料", "クリエイター支援", "Unreal Engine統合"]'::jsonb,
  '["Android", "iOS（予定）"]'::jsonb,
  'https://store.epicgames.com',
  'ゲーム特化型ストア。業界最低水準の手数料で話題。',
  '2026年予定',
  true,
  true,
  5
),
(
  'Microsoft Store',
  'microsoft-store',
  'Microsoft',
  '🟦',
  'planning',
  '12-15%',
  '["Xbox統合", "PWA対応", "エンタープライズ向け"]'::jsonb,
  '["Android", "Windows"]'::jsonb,
  'https://apps.microsoft.com',
  'Microsoft 365やXboxとの連携が特徴。モバイル展開検討中。',
  '未定',
  true,
  false,
  6
);

-- RLS (Row Level Security) の設定
ALTER TABLE app_stores ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能
CREATE POLICY "App stores are viewable by everyone" 
  ON app_stores FOR SELECT 
  USING (true);

-- 管理者のみ作成・更新・削除可能
CREATE POLICY "App stores are editable by admins" 
  ON app_stores FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE user_role = 'admin'
    )
  );