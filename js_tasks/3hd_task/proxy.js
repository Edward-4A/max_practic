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
	'/service/products',
	createProxyMiddleware({
		target: 'http://exercise.develop.maximaster.ru/service/products/',
		changeOrigin: true,
		pathRewrite: {
			'^/service/products': '/service/products/',
		},
		headers: {
			Authorization: 'Basic ' + Buffer.from('cli:12344321').toString('base64'),
			'User-Agent': 'PostmanRuntime/7.42.0',
			Accept: 'application/json',
		},
		onProxyReq: (proxyReq, req, res) => {
			console.log('Request URL:', proxyReq.path)
			console.log('Request headers:', proxyReq.getHeaders())
		},
		onProxyRes: (proxyRes, req, res) => {
			console.log('Response status:', proxyRes.statusCode)
			console.log('Response headers:', proxyRes.headers)
			let body = ''
			proxyRes.on('data', chunk => {
				body += chunk
			})
			proxyRes.on('end', () => {
				console.log('Response body:', body.slice(0, 200))
			})
		},
		onError: (err, req, res) => {
			console.log('Proxy error:', err)
			res.status(500).send('Proxy error: ' + err.message)
		},
	})
)

app.listen(3000, () => {
	console.log('Прокси-сервер запущен на http://localhost:3000')
})
