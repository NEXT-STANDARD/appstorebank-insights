'use client'

import { useState } from 'react'
import { getCategoryDisplayName } from '@/lib/articles'

interface CategoryFilterProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  articles?: Array<{ category: string }>
}

const categoryIcons = {
  'すべて': '📋',
  '市場分析': '📊',
  'グローバルトレンド': '🌏',
  '法規制': '⚖️',
  '技術解説': '🔧',
  'ニュース': '📰'
} as const

export default function CategoryFilter({ categories, activeCategory, onCategoryChange, articles = [] }: CategoryFilterProps) {
  // カテゴリ別の記事数を計算
  const getCategoryCount = (category: string) => {
    if (category === 'すべて') return articles.length
    return articles.filter(article => getCategoryDisplayName(article.category) === category).length
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
      <h2 className="text-lg font-bold text-neutral-800 mb-4">カテゴリで絞り込み</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = activeCategory === category
          const icon = categoryIcons[category as keyof typeof categoryIcons] || '📄'
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span>{icon}</span>
              <span>{category}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                isActive ? 'bg-white/20' : 'bg-neutral-200'
              }`}>
                {getCategoryCount(category)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}