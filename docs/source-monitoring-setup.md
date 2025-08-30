# データソース監視設定ガイド

## 📡 主要データソースの更新通知設定

### 1. RSS フィード設定

#### 必須監視対象

##### 政府・官公庁
```xml
経済産業省
https://www.meti.go.jp/main/rss/index.xml

総務省
https://www.soumu.go.jp/news_rss/index.rdf

公正取引委員会
https://www.jftc.go.jp/rss/index.xml

デジタル庁
※RSSフィード提供なし - メール通知登録推奨
```

##### 調査機関
```xml
MMD研究所
https://mmdlabo.jp/feed/

IDC Japan
※会員制 - メールアラート設定推奨

StatCounter
※RSS提供なし - 月次レポート通知設定
```

##### 業界ニュース
```xml
ITmedia Mobile
https://rss.itmedia.co.jp/rss/2.0/mobile.xml

CNET Japan（モバイル）
https://japan.cnet.com/rss/mobile/

TechCrunch Japan
https://jp.techcrunch.com/feed/

Engadget 日本版
https://japanese.engadget.com/rss.xml
```

### 2. Googleアラート設定

#### 設定手順
1. [Google アラート](https://www.google.com/alerts) にアクセス
2. 以下のキーワードでアラートを作成

#### 推奨キーワード

##### Critical Priority（即座通知）
```
"スマートフォン新法" OR "スマホ新法" 施行
"アプリストア" 手数料 変更
"App Store" OR "Google Play" 料金改定
"第三者アプリストア" 日本
```

##### High Priority（日次通知）
```
"iOS市場シェア" 日本
"アプリダウンロード数" 統計
"Epic Games Store" 日本進出
"DMA" アプリストア
```

##### Medium Priority（週次通知）
```
アプリストア自由化
サイドローディング セキュリティ
代替決済システム
モバイルアプリ市場規模
```

#### アラート設定
- **頻度**: その都度（Critical）、1日1回（High）、週1回（Medium）
- **ソース**: ニュース、ブログ、ウェブ
- **言語**: 日本語、英語
- **地域**: 日本、すべての国
- **件数**: すべての結果
- **配信先**: 管理者メールアドレス

### 3. 企業公式チャンネル監視

#### Apple Developer
- **News and Updates**: https://developer.apple.com/news/
- **RSS**: https://developer.apple.com/news/rss/news.rss
- **Twitter**: @AppleDevJP

#### Google Play Console
- **Blog**: https://android-developers.googleblog.com/
- **RSS**: https://android-developers.googleblog.com/feeds/posts/default
- **Twitter**: @GooglePlayDev

#### Epic Games
- **Newsroom**: https://www.epicgames.com/site/ja/news
- **Twitter**: @EpicGamesJapan

### 4. Slack/Discord 通知設定

#### RSS to Slack 連携
```bash
# Slack アプリ追加
1. Workspace Settings → Apps
2. "RSS" で検索
3. RSS アプリを追加
4. チャンネルで /feed subscribe [RSS_URL] を実行
```

#### 推奨チャンネル構成
```
#fact-check-critical    - Critical項目の更新通知
#fact-check-news       - 業界ニュース全般
#fact-check-gov        - 政府発表・法規制
#fact-check-stats      - 統計データ更新
```

### 5. ブラウザ拡張機能

#### Distill Web Monitor
- **用途**: 特定ページの変更監視
- **設定対象**:
  - 経産省スマホ新法ページ
  - StatCounter日本統計ページ
  - 各アプリストア料金ページ

#### Feedly
- **用途**: RSS統合管理
- **カテゴリ分け**:
  - Government（政府系）
  - Market Research（調査機関）
  - Industry News（業界ニュース）
  - Official（企業公式）

### 6. 定期チェックカレンダー

#### Google Calendar 設定
```
毎月1日 9:00 - ファクトチェック実行リマインダー
毎月15日 9:00 - 中間チェック（Critical項目のみ）
四半期初日 9:00 - 四半期データ更新確認
```

#### iCal ファイル
```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AppStoreBank//FactCheck//EN
BEGIN:VEVENT
DTSTART:20250101T090000
RRULE:FREQ=MONTHLY;BYMONTHDAY=1
SUMMARY:月次ファクトチェック実行
DESCRIPTION:Critical項目とHigh Priority項目の確認
URL:http://localhost:3001/admin/fact-check/execute
END:VEVENT
END:VCALENDAR
```

### 7. API 監視（上級者向け）

#### data.ai API
```python
# 要APIキー取得
import requests

API_KEY = "your_api_key"
endpoint = "https://api.data.ai/v1.3/intelligence/apps/top-chart"

def check_download_stats():
    response = requests.get(endpoint, headers={
        "Authorization": f"Bearer {API_KEY}"
    })
    return response.json()
```

#### StatCounter API
```javascript
// Node.js example
const axios = require('axios');

async function getMarketShare() {
  const response = await axios.get('https://api.statcounter.com/stats', {
    params: {
      device: 'mobile',
      region: 'JP',
      stat: 'os'
    }
  });
  return response.data;
}
```

### 8. 監視ダッシュボード構築

#### Zapier 自動化
```
トリガー: RSS Feed更新
アクション: 
1. Slackに通知
2. Googleスプレッドシートに記録
3. 重要度判定
4. 管理者にメール
```

#### IFTTT レシピ
```
IF: New RSS feed item (経産省)
THEN: Send notification to phone
AND: Add row to Google Sheets
```

### 9. エスカレーションフロー

#### 自動通知レベル
```
🔴 Critical - 即座通知
├─ Slack: @channel メンション
├─ Email: 優先度高
└─ SMS: 管理者直通

🟠 High - 1時間以内
├─ Slack: 通常通知
└─ Email: 通常

🟡 Medium - 日次サマリー
└─ Email: ダイジェスト

🔵 Low - 週次レポート
└─ Email: 週報に含める
```

### 10. 月次レビュー項目

#### 監視効果測定
- [ ] 通知の適切性（ノイズ vs 有用情報）
- [ ] 見逃した重要更新の有無
- [ ] フィード/アラートの追加・削除検討
- [ ] 自動化ツールの改善点

#### ソース信頼性評価
- [ ] 各ソースの更新頻度
- [ ] 情報の正確性
- [ ] 速報性の評価
- [ ] 新規ソースの発掘

## 📋 クイックセットアップチェックリスト

### 今すぐ設定（30分）
- [ ] Googleアラート - Critical Keywords設定
- [ ] 経産省RSSフィード購読
- [ ] カレンダーリマインダー設定
- [ ] Slack通知チャンネル作成

### 週内に設定（2時間）
- [ ] 全RSSフィード登録
- [ ] Feedly整理
- [ ] Distill Web Monitor設定
- [ ] IFTTT/Zapier自動化

### 月内に検討（継続的）
- [ ] API連携構築
- [ ] カスタムダッシュボード
- [ ] 監視精度向上
- [ ] チーム共有体制

## 🔧 トラブルシューティング

### RSS が取得できない
- User-Agentを変更
- Feedlyなどのアグリゲーター経由で取得
- Web scraping（最終手段）

### 通知が多すぎる
- キーワードを具体的に絞る
- 除外キーワードを追加
- 通知頻度を調整

### 重要情報を見逃した
- キーワードの見直し
- ソースの追加
- 通知レベルの調整