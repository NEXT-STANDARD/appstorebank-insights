'use client'

import { useEffect } from 'react'
import GoogleAnalytics from './GoogleAnalytics'

export default function GoogleAnalyticsWrapper() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
}