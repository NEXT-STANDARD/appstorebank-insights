-- 既存のポリシーとテーブルをクリーンアップ
-- マイグレーション前に実行してください

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "fact_check_sessions_admin_only" ON fact_check_sessions;
DROP POLICY IF EXISTS "fact_check_items_admin_only" ON fact_check_items;
DROP POLICY IF EXISTS "fact_check_history_admin_only" ON fact_check_history;

-- 既存のテーブルを削除（データも削除される）
DROP TABLE IF EXISTS fact_check_history CASCADE;
DROP TABLE IF EXISTS fact_check_sessions CASCADE;
DROP TABLE IF EXISTS fact_check_items CASCADE;

-- 既存のビューを削除
DROP VIEW IF EXISTS fact_check_schedule;
DROP VIEW IF EXISTS fact_check_summary;

-- 既存の関数を削除
DROP FUNCTION IF EXISTS update_fact_check_updated_at();
DROP FUNCTION IF EXISTS complete_fact_check_session(UUID);

-- 確認用クエリ（実行後に確認）
SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'fact_check%';
SELECT viewname FROM pg_views WHERE viewname LIKE 'fact_check%';
SELECT routine_name FROM information_schema.routines WHERE routine_name LIKE '%fact_check%';