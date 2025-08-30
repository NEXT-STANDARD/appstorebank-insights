-- ファクトチェック履歴管理テーブル作成
-- 実行順序: fact_check_sessions → fact_check_items → fact_check_history

-- ファクトチェック実行セッション
CREATE TABLE IF NOT EXISTS fact_check_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_date DATE NOT NULL,
    executor_id UUID REFERENCES auth.users(id),
    total_items INTEGER NOT NULL DEFAULT 0,
    completed_items INTEGER NOT NULL DEFAULT 0,
    updated_items INTEGER NOT NULL DEFAULT 0,
    failed_items INTEGER NOT NULL DEFAULT 0,
    execution_notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ファクトチェック管理マスター（監視対象項目）
CREATE TABLE IF NOT EXISTS fact_check_items (
    id VARCHAR(50) PRIMARY KEY,
    component VARCHAR(100) NOT NULL,
    section VARCHAR(100) NOT NULL,
    fact_type VARCHAR(50) NOT NULL CHECK (fact_type IN ('statistic', 'date', 'percentage', 'legal', 'company_info', 'market_data')),
    claim TEXT NOT NULL,
    source VARCHAR(200) NOT NULL,
    source_url TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    confidence VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (confidence IN ('high', 'medium', 'low')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    review_frequency_days INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ファクトチェック履歴（各項目の確認記録）
CREATE TABLE IF NOT EXISTS fact_check_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES fact_check_sessions(id) ON DELETE CASCADE,
    item_id VARCHAR(50) NOT NULL REFERENCES fact_check_items(id),
    previous_value TEXT,
    new_value TEXT,
    verification_status VARCHAR(20) NOT NULL CHECK (verification_status IN ('verified', 'updated', 'failed', 'skipped')),
    verification_notes TEXT,
    confidence_level VARCHAR(20) CHECK (confidence_level IN ('high', 'medium', 'low')),
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    checker_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_fact_check_sessions_date ON fact_check_sessions(execution_date DESC);
CREATE INDEX IF NOT EXISTS idx_fact_check_sessions_executor ON fact_check_sessions(executor_id);
CREATE INDEX IF NOT EXISTS idx_fact_check_history_session ON fact_check_history(session_id);
CREATE INDEX IF NOT EXISTS idx_fact_check_history_item ON fact_check_history(item_id);
CREATE INDEX IF NOT EXISTS idx_fact_check_history_date ON fact_check_history(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_fact_check_items_priority ON fact_check_items(priority, is_active);

-- RLS (Row Level Security) 有効化
ALTER TABLE fact_check_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_check_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_check_history ENABLE ROW LEVEL SECURITY;

-- RLS ポリシー作成（管理者のみアクセス可能）
CREATE POLICY "fact_check_sessions_admin_only" ON fact_check_sessions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.user_role IN ('admin', 'developer')
        )
    );

CREATE POLICY "fact_check_items_admin_only" ON fact_check_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.user_role IN ('admin', 'developer')
        )
    );

CREATE POLICY "fact_check_history_admin_only" ON fact_check_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.user_role IN ('admin', 'developer')
        )
    );

-- 初期データ挿入
INSERT INTO fact_check_items (id, component, section, fact_type, claim, source, source_url, priority, confidence) VALUES
('smartphone-law-enforcement', 'FAQ/CaseStudy', '法規制', 'date', 'スマホ新法施行予定', '経済産業省', 'https://www.meti.go.jp/', 'critical', 'high'),
('japan-market-size', 'IndustryStatsSummary', '市場概況', 'market_data', '日本アプリ市場規模', 'MMD研究所', 'https://mmdlabo.jp/', 'critical', 'medium'),
('global-downloads-2024', 'IndustryStatsSummary', '市場概況', 'statistic', 'グローバルダウンロード数', 'App Annie', 'https://www.data.ai/', 'high', 'high'),
('ios-market-share-japan', 'IndustryStatsSummary', '日本市場特性', 'percentage', 'iOS市場シェア（日本）', 'StatCounter', 'https://gs.statcounter.com/', 'high', 'medium'),
('active-developers-count', 'IndustryStatsSummary', '市場概況', 'statistic', 'アクティブ開発者数', 'Developer Economics', 'https://developereconomics.com/', 'medium', 'high'),
('smartphone-law-date', 'FAQ/CaseStudy', '法規制', 'date', 'スマホ新法成立日', '官報', 'https://www.gov.jp/', 'critical', 'high'),
('app-store-commission', 'FAQ/AppStoreComparison', '手数料', 'percentage', 'App Store標準手数料', 'Apple Developer', 'https://developer.apple.com/', 'high', 'high'),
('google-play-commission', 'FAQ/AppStoreComparison', '手数料', 'percentage', 'Google Play標準手数料', 'Google Play Console', 'https://play.google.com/console/', 'high', 'high'),
('epic-games-commission', 'FAQ/AppStoreComparison', '手数料', 'percentage', 'Epic Games Store手数料', 'Epic Games', 'https://store.epicgames.com/', 'medium', 'high'),
('dma-enforcement-date', 'FAQ/CaseStudy', '法規制', 'date', 'DMA施行日', 'European Commission', 'https://ec.europa.eu/', 'high', 'high')
ON CONFLICT (id) DO NOTHING;

-- 更新トリガー作成
CREATE OR REPLACE FUNCTION update_fact_check_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fact_check_sessions_updated_at
    BEFORE UPDATE ON fact_check_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_fact_check_updated_at();

CREATE TRIGGER update_fact_check_items_updated_at
    BEFORE UPDATE ON fact_check_items
    FOR EACH ROW
    EXECUTE FUNCTION update_fact_check_updated_at();

-- セッション完了時の統計更新関数
CREATE OR REPLACE FUNCTION complete_fact_check_session(session_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE fact_check_sessions 
    SET 
        status = 'completed',
        completed_at = NOW(),
        completed_items = (
            SELECT COUNT(*) FROM fact_check_history 
            WHERE session_id = session_uuid 
            AND verification_status IN ('verified', 'updated')
        ),
        updated_items = (
            SELECT COUNT(*) FROM fact_check_history 
            WHERE session_id = session_uuid 
            AND verification_status = 'updated'
        ),
        failed_items = (
            SELECT COUNT(*) FROM fact_check_history 
            WHERE session_id = session_uuid 
            AND verification_status = 'failed'
        )
    WHERE id = session_uuid;
END;
$$ LANGUAGE plpgsql;

-- 次回確認日計算ビュー
CREATE OR REPLACE VIEW fact_check_schedule AS
SELECT 
    fi.id,
    fi.claim,
    fi.priority,
    fi.review_frequency_days,
    COALESCE(
        MAX(fch.checked_at) + INTERVAL '1 day' * fi.review_frequency_days,
        NOW()
    ) AS next_review_date,
    MAX(fch.checked_at) AS last_checked_at,
    COUNT(fch.id) AS total_checks,
    SUM(CASE WHEN fch.verification_status = 'updated' THEN 1 ELSE 0 END) AS update_count
FROM fact_check_items fi
LEFT JOIN fact_check_history fch ON fi.id = fch.item_id
WHERE fi.is_active = true
GROUP BY fi.id, fi.claim, fi.priority, fi.review_frequency_days
ORDER BY next_review_date ASC;

-- 統計サマリービュー
CREATE OR REPLACE VIEW fact_check_summary AS
SELECT 
    DATE_TRUNC('month', fcs.execution_date) as month,
    COUNT(*) as total_sessions,
    AVG(fcs.completed_items::float / NULLIF(fcs.total_items, 0) * 100) as avg_completion_rate,
    SUM(fcs.updated_items) as total_updates,
    SUM(fcs.failed_items) as total_failures
FROM fact_check_sessions fcs
WHERE fcs.status = 'completed'
GROUP BY DATE_TRUNC('month', fcs.execution_date)
ORDER BY month DESC;

COMMENT ON TABLE fact_check_sessions IS 'ファクトチェック実行セッション管理';
COMMENT ON TABLE fact_check_items IS 'ファクトチェック対象項目マスター';  
COMMENT ON TABLE fact_check_history IS 'ファクトチェック実行履歴';
COMMENT ON VIEW fact_check_schedule IS '次回確認予定日ビュー';
COMMENT ON VIEW fact_check_summary IS 'ファクトチェック実行統計サマリー';