/**
 * k6 Load Test Script
 *
 * Tests portfolio performance under load:
 * - 100 concurrent virtual users
 * - Mixed workload (homepage, API, contact form)
 * - Performance assertions (p95 ≤500ms, errors <1%)
 * - Real-time metrics reporting
 *
 * Run: k6 run scripts/load-test.js
 * Or with custom settings: k6 run --vus 50 --duration 60s scripts/load-test.js
 */

import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

// ===== CONFIGURATION =====

export const options = {
  stages: [
    // Ramp-up: Gradually increase load to 100 VUs over 30s
    { duration: '30s', target: 100 },
    // Steady state: Maintain 100 VUs for 2 minutes
    { duration: '2m', target: 100 },
    // Cool-down: Gradually decrease to 0 VUs over 30s
    { duration: '30s', target: 0 },
  ],

  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'], // 95th percentile < 500ms, 99th < 1s
    'http_req_failed': ['rate<0.01'], // Error rate < 1%
    'http_reqs': ['rate>50'], // At least 50 requests per second
  },
}

// ===== CUSTOM METRICS =====

const errorRate = new Rate('error_rate')
const responseTime = new Trend('response_time')
const apiResponseTime = new Trend('api_response_time')
const pageResponseTime = new Trend('page_response_time')
const contactFormTime = new Trend('contact_form_time')

// ===== HELPER FUNCTIONS =====

function makeRequest(method, url, payload = null) {
  const options = {
    headers: {
      'User-Agent': 'k6/0.40.0',
      'Accept-Encoding': 'gzip, deflate',
    },
  }

  let response
  if (method === 'GET') {
    response = http.get(url, options)
  } else if (method === 'POST') {
    options.headers['Content-Type'] = 'application/json'
    response = http.post(url, JSON.stringify(payload), options)
  }

  responseTime.add(response.timings.duration)

  return response
}

function checkResponse(response, name, expectedStatus = 200) {
  const success = check(response, {
    [`${name} status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
    [`${name} response time < 1s`]: (r) => r.timings.duration < 1000,
    [`${name} no errors`]: (r) => !r.error,
  })

  if (!success) {
    errorRate.add(1)
  } else {
    errorRate.add(0)
  }

  return success
}

// ===== TEST SCENARIOS =====

export default function () {
  const baseURL = __ENV.BASE_URL || 'http://localhost:3000'

  // ===== GROUP 1: Homepage (50% of traffic) =====
  group('Homepage', () => {
    const response = makeRequest('GET', `${baseURL}/`)
    pageResponseTime.add(response.timings.duration)
    checkResponse(response, 'GET /', 200)
  })

  // ===== GROUP 2: API Endpoints (30% of traffic) =====
  group('API Endpoints', () => {
    // GET /api/posts
    const postsResponse = makeRequest('GET', `${baseURL}/api/posts?limit=10`)
    apiResponseTime.add(postsResponse.timings.duration)
    checkResponse(postsResponse, 'GET /api/posts', 200)

    sleep(0.5) // 500ms between API calls

    // GET /api/health
    const healthResponse = makeRequest('GET', `${baseURL}/api/health`)
    apiResponseTime.add(healthResponse.timings.duration)
    checkResponse(healthResponse, 'GET /api/health', 200)
  })

  // ===== GROUP 3: Contact Form (20% of traffic) =====
  group('Contact Form', () => {
    const contactPayload = {
      name: `Test User ${Math.random()}`,
      email: `test${Math.random()}@example.com`,
      subject: 'Test Subject',
      message: 'This is a test message for load testing.',
    }

    const response = makeRequest('POST', `${baseURL}/api/contact`, contactPayload)
    contactFormTime.add(response.timings.duration)

    // Accept both 201 (created) and 429 (rate limited) as "success" for this test
    check(response, {
      'POST /api/contact status is 201 or 429': (r) => r.status === 201 || r.status === 429,
      'POST /api/contact response time < 2s': (r) => r.timings.duration < 2000,
    })

    if (response.status === 429) {
      console.warn('Rate limit hit on contact form')
      errorRate.add(0) // Rate limiting is expected during load, not an error
    }
  })

  // Random sleep between 0.5-2 seconds
  sleep(Math.random() + 0.5)
}

// ===== SUMMARY HANDLER =====
export function handleSummary(data) {
  return {
    'stdout': JSON.stringify(data, null, 2),
    'stdout.txt': JSON.stringify(data, null, 2),
  }
}
