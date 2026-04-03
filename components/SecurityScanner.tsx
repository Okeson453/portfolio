'use client'
import { useState } from 'react'

function CheckItem({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xl ${status ? 'text-green-500' : 'text-red-500'}`}>
        {status ? '✓' : '✗'}
      </span>
      <span>{label}</span>
    </div>
  )
}

interface ScanResults {
  ssl: boolean
  headers: boolean
  sqlInjection: boolean
  xss: boolean
  score: number
}

export default function SecurityScanner() {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<ScanResults | null>(null)

  const simulateScan = async () => {
    if (!url) return

    setScanning(true)
    setResults(null)

    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockResults = {
      ssl: url.startsWith('https://'),
      headers: Math.random() > 0.3,
      sqlInjection: Math.random() > 0.8,
      xss: Math.random() > 0.7,
      score: Math.floor(Math.random() * 30) + 70,
    }

    setResults(mockResults)
    setScanning(false)
  }

  return (
    <section id="scanner-demo" className="mb-16">
      <h2 className="text-3xl font-bold mb-4">Security Scanner Demo</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Simulated vulnerability assessment (client-side demo only).
      </p>

      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg max-w-2xl">
        <div className="flex gap-2 mb-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
          />
          <button
            onClick={simulateScan}
            disabled={scanning || !url}
            className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {scanning ? 'Scanning...' : 'Scan'}
          </button>
        </div>

        {results && (
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <span>Security Score:</span>
              <span className="text-2xl font-bold text-green-600">{results.score}/100</span>
            </div>

            <div className="space-y-2">
              <CheckItem label="SSL/TLS Enabled" status={results.ssl} />
              <CheckItem label="Security Headers" status={results.headers} />
              <CheckItem label="SQL Injection Protection" status={!results.sqlInjection} />
              <CheckItem label="XSS Protection" status={!results.xss} />
            </div>

            <p className="text-sm text-gray-500 mt-4">
              *This is a demonstration only. For real security audits, use professional tools.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
