"use client"
import React, { useEffect, useState } from 'react'
import Templates from '@/app/(data)/Templates'
import { Copy, Code2, Hash, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface HistoryItem {
  id: number
  formData: string
  aiResponse: string
  templateSlug: string
  createdBy: string
  createdAt: string | null
}

function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/history')
      const data = await response.json()
      
      if (data.success) {
        setHistory(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTemplateInfo = (slug: string) => {
    const template = Templates.find((t) => t.slug === slug)
    return template || { name: 'Unknown Template', icon: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png', slug: 'unknown' }
  }

  const getWordCount = (text: string): number => {
    if (!text) return 0
    // Remove HTML tags if present
    const plainText = text.replace(/<[^>]*>/g, '')
    // Count words
    return plainText.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const truncateText = (text: string, maxLength: number = 100): string => {
    if (!text) return ''
    // Remove HTML tags
    const plainText = text.replace(/<[^>]*>/g, '')
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + '...'
  }

  const handleCopy = async (text: string, id: number) => {
    try {
      // Remove HTML tags before copying
      const plainText = text.replace(/<[^>]*>/g, '')
      await navigator.clipboard.writeText(plainText)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>
        <h1 className="text-4xl font-bold mb-2">History</h1>
        <p className="text-gray-600 text-lg">Search your previously generate AI content</p>
      </div>

      {/* Table */}
      {history.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500 text-lg">No history found. Start generating content to see it here!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">TEMPLATE</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">CONTENT</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">DATE</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">WORDS</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">COPY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map((item) => {
                  const template = getTemplateInfo(item.templateSlug)
                  const wordCount = getWordCount(item.aiResponse)
                  const truncatedResponse = truncateText(item.aiResponse, 150)
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      {/* TEMPLATE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0">
                            {template.slug === 'write-code' ? (
                              <Code2 className="w-5 h-5 text-primary" />
                            ) : template.slug === 'instagram-hash-tag-generator' ? (
                              <Hash className="w-5 h-5 text-primary" />
                            ) : (
                              <Image 
                                src={template.icon} 
                                alt={template.name} 
                                width={20} 
                                height={20}
                                className="object-contain"
                              />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{template.name}</span>
                        </div>
                      </td>
                      
                      {/* AI RESP */}
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {truncatedResponse}
                          </p>
                        </div>
                      </td>
                      
                      {/* DATE */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {item.createdAt || 'N/A'}
                        </span>
                      </td>
                      
                      {/* WORDS */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{wordCount}</span>
                      </td>
                      
                      {/* COPY */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleCopy(item.aiResponse, item.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          {copiedId === item.id ? (
                            <>
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
