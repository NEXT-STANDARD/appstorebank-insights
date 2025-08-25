'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { AppStore } from '@/lib/app-stores'

export default function EditAppStorePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    company: '',
    logo_emoji: '',
    logo_url: '',
    status: 'planning' as AppStore['status'],
    commission_rate: '',
    small_business_rate: '',
    subscription_rate_year1: '',
    subscription_rate_year2: '',
    features: [] as string[],
    supported_devices: [] as string[],
    website_url: '',
    description: '',
    launch_date: '',
    is_third_party: true,
    is_featured: false,
    display_order: 999
  })

  const [featuresInput, setFeaturesInput] = useState('')
  const [devicesInput, setDevicesInput] = useState('')

  useEffect(() => {
    // paramsからIDを取得して、データを読み込み
    const loadData = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
      await loadAppStore(resolvedParams.id)
    }
    loadData()
  }, [params])

  const loadAppStore = async (storeId: string) => {
    try {
      const response = await fetch(`/api/admin/app-stores/${storeId}`)
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'アプリストアの読み込みに失敗しました')
        return
      }

      const store = data.appStore
      setFormData({
        name: store.name || '',
        slug: store.slug || '',
        company: store.company || '',
        logo_emoji: store.logo_emoji || '',
        logo_url: store.logo_url || '',
        status: store.status || 'planning',
        commission_rate: store.commission_rate || '',
        small_business_rate: store.small_business_rate || '',
        subscription_rate_year1: store.subscription_rate_year1 || '',
        subscription_rate_year2: store.subscription_rate_year2 || '',
        features: store.features || [],
        supported_devices: store.supported_devices || [],
        website_url: store.website_url || '',
        description: store.description || '',
        launch_date: store.launch_date || '',
        is_third_party: store.is_third_party || false,
        is_featured: store.is_featured || false,
        display_order: store.display_order || 999
      })

      setFeaturesInput((store.features || []).join(', '))
      setDevicesInput((store.supported_devices || []).join(', '))
    } catch (err) {
      console.error('Error loading app store:', err)
      setError('アプリストアの読み込み中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Auto-generate slug from name
    if (name === 'name' && value) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  // Handle features input
  const handleFeaturesChange = (value: string) => {
    setFeaturesInput(value)
    const features = value
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0)
    
    setFormData(prev => ({
      ...prev,
      features
    }))
  }

  // Handle devices input
  const handleDevicesChange = (value: string) => {
    setDevicesInput(value)
    const devices = value
      .split(',')
      .map(d => d.trim())
      .filter(d => d.length > 0)
    
    setFormData(prev => ({
      ...prev,
      supported_devices: devices
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.slug || !formData.company) {
      setError('名前、スラッグ、会社名は必須です')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/app-stores/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'アプリストアの更新に失敗しました')
        return
      }

      router.push('/admin/app-stores')
    } catch (err) {
      console.error('Error updating app store:', err)
      setError('アプリストアの更新中にエラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">エラーが発生しました</h1>
          <p className="text-neutral-600 mb-8">{error}</p>
          <Link href="/admin/app-stores" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/admin/app-stores"
              className="text-neutral-600 hover:text-neutral-800 p-2 rounded-lg hover:bg-neutral-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">アプリストアを編集</h1>
              <p className="mt-1 text-sm text-neutral-600">
                {formData.name}の情報を更新してください
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6">
                
                {/* Basic Information */}
                <div className="col-span-1">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">基本情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                        アプリストア名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Epic Games Store"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
                        運営会社 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Epic Games"
                      />
                    </div>

                    <div>
                      <label htmlFor="slug" className="block text-sm font-medium text-neutral-700 mb-2">
                        スラッグ（URL用） <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="epic-games-store"
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        URLに使用されます。英数字とハイフンのみ使用可能です。
                      </p>
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-2">
                        ステータス
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="available">利用可能</option>
                        <option value="coming_soon">準備中</option>
                        <option value="planning">計画中</option>
                        <option value="discontinued">終了</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Logo */}
                <div className="col-span-1">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">ロゴ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="logo_emoji" className="block text-sm font-medium text-neutral-700 mb-2">
                        絵文字ロゴ
                      </label>
                      <input
                        type="text"
                        id="logo_emoji"
                        name="logo_emoji"
                        value={formData.logo_emoji}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="⚫"
                        maxLength={10}
                      />
                    </div>

                    <div>
                      <label htmlFor="logo_url" className="block text-sm font-medium text-neutral-700 mb-2">
                        ロゴ画像URL
                      </label>
                      <input
                        type="url"
                        id="logo_url"
                        name="logo_url"
                        value={formData.logo_url}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  </div>
                </div>

                {/* Commission Rates */}
                <div className="col-span-1">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">手数料情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="commission_rate" className="block text-sm font-medium text-neutral-700 mb-2">
                        基本手数料
                      </label>
                      <input
                        type="text"
                        id="commission_rate"
                        name="commission_rate"
                        value={formData.commission_rate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="12%"
                      />
                    </div>

                    <div>
                      <label htmlFor="small_business_rate" className="block text-sm font-medium text-neutral-700 mb-2">
                        小規模事業者向け手数料
                      </label>
                      <input
                        type="text"
                        id="small_business_rate"
                        name="small_business_rate"
                        value={formData.small_business_rate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="12%"
                      />
                    </div>

                    <div>
                      <label htmlFor="subscription_rate_year1" className="block text-sm font-medium text-neutral-700 mb-2">
                        サブスク手数料（1年目）
                      </label>
                      <input
                        type="text"
                        id="subscription_rate_year1"
                        name="subscription_rate_year1"
                        value={formData.subscription_rate_year1}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="12%"
                      />
                    </div>

                    <div>
                      <label htmlFor="subscription_rate_year2" className="block text-sm font-medium text-neutral-700 mb-2">
                        サブスク手数料（2年目〜）
                      </label>
                      <input
                        type="text"
                        id="subscription_rate_year2"
                        name="subscription_rate_year2"
                        value={formData.subscription_rate_year2}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="12%"
                      />
                    </div>
                  </div>
                </div>

                {/* Features and Devices */}
                <div className="col-span-1">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">機能・対応端末</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="features" className="block text-sm font-medium text-neutral-700 mb-2">
                        主な機能
                      </label>
                      <input
                        type="text"
                        id="features"
                        name="features"
                        value={featuresInput}
                        onChange={(e) => handleFeaturesChange(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="低手数料, クリエイター支援, Unreal Engine統合"
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        カンマ区切りで入力してください
                      </p>
                    </div>

                    <div>
                      <label htmlFor="devices" className="block text-sm font-medium text-neutral-700 mb-2">
                        対応端末
                      </label>
                      <input
                        type="text"
                        id="devices"
                        name="devices"
                        value={devicesInput}
                        onChange={(e) => handleDevicesChange(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Android, iOS, Windows"
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        カンマ区切りで入力してください
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="col-span-1">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">追加情報</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="website_url" className="block text-sm font-medium text-neutral-700 mb-2">
                        公式サイトURL
                      </label>
                      <input
                        type="url"
                        id="website_url"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://store.epicgames.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="launch_date" className="block text-sm font-medium text-neutral-700 mb-2">
                        開始日・予定日
                      </label>
                      <input
                        type="text"
                        id="launch_date"
                        name="launch_date"
                        value={formData.launch_date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="2026年予定"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                        説明
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="ゲーム特化型ストア。業界最低水準の手数料で話題。"
                      />
                    </div>

                    <div>
                      <label htmlFor="display_order" className="block text-sm font-medium text-neutral-700 mb-2">
                        表示順序
                      </label>
                      <input
                        type="number"
                        id="display_order"
                        name="display_order"
                        value={formData.display_order}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="999"
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        数値が小さいほど上に表示されます
                      </p>
                    </div>
                  </div>
                </div>

                {/* Flags */}
                <div className="col-span-1">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">フラグ設定</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_third_party"
                        name="is_third_party"
                        checked={formData.is_third_party}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor="is_third_party" className="ml-2 block text-sm text-neutral-700">
                        第三者アプリストア
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_featured"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor="is_featured" className="ml-2 block text-sm text-neutral-700">
                        注目のアプリストア
                      </label>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/app-stores"
              className="bg-white py-2 px-4 border border-neutral-300 rounded-lg shadow-sm text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 border border-transparent rounded-lg shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  更新中...
                </div>
              ) : (
                'アプリストアを更新'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}