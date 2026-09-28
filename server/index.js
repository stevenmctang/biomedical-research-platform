import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { searchEvidence } from './evidenceSearch.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  )

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  return next()
})

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.get('/', (req, res) => {
  res.json({
    ok: true,
    name: 'Helix Research Explorer Backend',
    message: 'Backend is running.',
    testRoutes: [
      'http://localhost:3001/api/health',
      'http://localhost:3001/api/evidence?q=SOD1%20ALS',
      'http://localhost:3001/api/evidence?q=CRISPR%20Cas9',
    ],
  })
})

app.get('/api', (req, res) => {
  res.json({
    ok: true,
    name: 'Helix Research Explorer API',
    routes: [
      '/api/health',
      '/api/evidence?q=SOD1 ALS',
    ],
  })
})

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    message: 'Helix backend is running.',
    port: PORT,
  })
})

app.get('/api/evidence', async (req, res) => {
  try {
    const query = String(req.query.q || '').trim()

    if (!query) {
      return res.status(400).json({
        ok: false,
        error: 'Missing query parameter q.',
        example: '/api/evidence?q=SOD1%20ALS',
      })
    }

    console.log(`Searching evidence for: ${query}`)

    const result = await searchEvidence(query)

    return res.json({
      ok: true,
      ...result,
    })
  } catch (error) {
    console.error('Evidence search failed:', error)

    return res.status(500).json({
      ok: false,
      error: 'Evidence search failed.',
      details:
        error instanceof Error
          ? error.message
          : 'Unknown server error.',
    })
  }
})

const distPath = path.join(__dirname, '..', 'dist')

app.use(express.static(distPath))

app.get(/.*/, (req, res) => {
  res.status(404).json({
    ok: false,
    error: 'Route not found.',
    message:
      'Use /api/health or /api/evidence?q=SOD1%20ALS to test the backend.',
    requestedPath: req.path,
  })
})

app.listen(PORT, () => {
  console.log('')
  console.log('====================================')
  console.log(`Helix backend running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
  console.log(`Evidence test: http://localhost:${PORT}/api/evidence?q=SOD1%20ALS`)
  console.log('====================================')
  console.log('')
})
