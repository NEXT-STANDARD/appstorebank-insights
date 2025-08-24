import Link from 'next/link'
import { getCategoryDisplayName } from '@/lib/articles'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `https://insights.appstorebank.com${item.href}` }),
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="flex" aria-label="パンくず">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {items.map((item, index) => (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <svg
                  className="w-3 h-3 mx-1 text-neutral-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-neutral-500 hover:text-primary-600"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-neutral-900" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

// よく使用されるパンくずパターンのヘルパー関数
export function getArticleBreadcrumb(category: string, title: string) {
  return [
    { label: 'ホーム', href: '/' },
    { label: getCategoryDisplayName(category), href: `/#categories` },
    { label: title }
  ]
}