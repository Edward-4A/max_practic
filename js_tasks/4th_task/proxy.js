const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const app = express()

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	)
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET')
		return res.status(200).json({})
	}
	next()
})
app.use(
	'/service/cpu',
	createProxyMiddleware({
		target: 'http://exercise.develop.maximaster.ru/service/cpu/',
		changeOrigin: true,
		pathRewrite: {
			'^/service/cpu': '/service/cpu/',
		},
		followRedirects: false,
		headers: {
			Authorization: 'Basic ' + Buffer.from('cli:12344321').toString('base64'),
			'User-Agent': 'PostmanRuntime/7.42.0',
			Accept: 'text/html',
		},
		on: {
			proxyReq: (proxyReq, req, res) => {
				console.log('CPU Request URL:', proxyReq.path)
				console.log('CPU Request headers:', proxyReq.getHeaders())
			},
			proxyRes: (proxyRes, req, res) => {
				console.log('CPU Response status:', proxyRes.statusCode)
				console.log('CPU Response headers:', proxyRes.headers)
				let body = ''
				proxyRes.on('data', chunk => {
					body += chunk
				})
				proxyRes.on('end', () => {
					console.log('CPU Response body (full):', body)
					if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400) {
						console.log('CPU Redirect detected to:', proxyRes.headers.location)
					}
				})
			},
			error: (err, req, res) => {
				console.log('CPU Proxy error:', err)
				res.status(500).send('CPU Proxy error: ' + err.message)
			},
		},
	})
)
app.listen(3000, () => {
	console.log('Прокси-сервер запущен на http://localhost:3000')
})
