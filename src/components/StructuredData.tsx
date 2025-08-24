import { Article } from '@/lib/articles'

interface WebsiteStructuredDataProps {
  type: 'website'
}

interface ArticleStructuredDataProps {
  type: 'article'
  article: Article
}

type StructuredDataProps = WebsiteStructuredDataProps | ArticleStructuredDataProps

export default function StructuredData(props: StructuredDataProps) {
  const generateWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AppStoreBank Insights",
    "description": "アプリストア業界の専門的な洞察とトレンド分析。市場分析、グローバルトレンド、法規制解説、技術深層解説を提供。",
    "url": "https://insights.appstorebank.com",
    "publisher": {
      "@type": "Organization",
      "name": "AppStoreBank",
      "logo": {
        "@type": "ImageObject",
        "url": "https://insights.appstorebank.com/api/og?title=AppStoreBank&category=Logo",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://twitter.com/AppStoreBank",
        "https://github.com/NEXT-STANDARD/appstorebank-insights"
      ]
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://insights.appstorebank.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  })

  const generateArticleSchema = (article: Article) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt || article.subtitle || "",
    "image": article.cover_image_url ? [
      {
        "@type": "ImageObject",
        "url": article.cover_image_url,
        "width": 1200,
        "height": 630
      }
    ] : [],
    "datePublished": article.published_at,
    "dateModified": article.updated_at || article.published_at,
    "author": {
      "@type": "Organization",
      "name": "AppStoreBank"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AppStoreBank",
      "logo": {
        "@type": "ImageObject",
        "url": "https://insights.appstorebank.com/api/og?title=AppStoreBank&category=Logo",
        "width": 512,
        "height": 512
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://insights.appstorebank.com/articles/${article.slug}`
    },
    "articleSection": getCategoryLabel(article.category),
    "keywords": article.tags,
    "about": [
      {
        "@type": "Thing",
        "name": "アプリストア業界"
      },
      {
        "@type": "Thing", 
        "name": "市場分析"
      },
      {
        "@type": "Thing",
        "name": "デジタル市場"
      }
    ],
    "inLanguage": "ja-JP"
  })

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'market_analysis': '市場分析',
      'global_trends': 'グローバルトレンド',
      'law_regulation': '法規制',
      'tech_deep_dive': '技術解説'
    }
    return categoryMap[category] || category
  }

  const generateFAQSchema = () => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "スマホ新法とは何ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "スマホ新法（特定ソフトウェアに係る競争の促進に関する法律）は、2025年12月18日に施行される日本の法律で、AppleやGoogleなどの大手プラットフォーマーによる市場支配を制限し、競争環境を改善することを目的としています。"
        }
      },
      {
        "@type": "Question", 
        "name": "サイドローディングとは何ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "サイドローディングとは、App Store以外の方法でアプリをインストールすることです。スマホ新法により、iPhoneでもサードパーティアプリストアや直接配信によるアプリインストールが可能になります。"
        }
      }
    ]
  })

  let schema
  if (props.type === 'website') {
    schema = generateWebsiteSchema()
  } else {
    schema = generateArticleSchema(props.article)
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// FAQ用の構造化データコンポーネント
export function FAQStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "スマホ新法とは何ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "スマホ新法（特定ソフトウェアに係る競争の促進に関する法律）は、2025年12月18日に施行される日本の法律で、AppleやGoogleなどの大手プラットフォーマーによる市場支配を制限し、競争環境を改善することを目的としています。"
        }
      },
      {
        "@type": "Question", 
        "name": "サイドローディングとは何ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "サイドローディングとは、App Store以外の方法でアプリをインストールすることです。スマホ新法により、iPhoneでもサードパーティアプリストアや直接配信によるアプリインストールが可能になります。"
        }
      },
      {
        "@type": "Question",
        "name": "EUのデジタル市場法（DMA）との違いは？",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "日本のスマホ新法は主にモバイルOSに焦点を当てており、売上高2兆円以上の企業が対象です。一方、EUのDMAはゲートキーパー全般を対象とし、より厳しい罰則（全世界売上高の最大20%）が設定されています。"
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}