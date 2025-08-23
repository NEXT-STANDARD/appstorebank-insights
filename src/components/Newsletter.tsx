'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Supabaseに保存するロジックを実装
    setTimeout(() => {
      setIsSubmitted(true)
      setIsSubmitting(false)
      setEmail('')
    }, 1500)

    setTimeout(() => {
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-2xl p-8 text-center shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-neutral-800">最新記事を見逃さない</h2>
          <p className="text-neutral-600 mb-8 text-lg">
            業界の重要な動向とInsightsの最新記事をお届けします
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              required
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isSubmitted
                  ? 'bg-accent-mint text-white'
                  : isSubmitting
                  ? 'bg-primary-300 text-white cursor-not-allowed'
                  : 'bg-primary-gradient text-white hover:shadow-lg hover:shadow-primary-300/50 hover:-translate-y-0.5'
              }`}
            >
              {isSubmitted ? '登録完了！' : isSubmitting ? '登録中...' : '購読開始'}
            </button>
          </form>

          {isSubmitted && (
            <p className="text-accent-mint text-sm mt-4 animate-fade-in">
              ご登録ありがとうございます！
            </p>
          )}
        </div>
      </div>
    </section>
  )
}