document.addEventListener('DOMContentLoaded', () => {
	if (typeof Chart === 'undefined') {
		const errorMessage = document.getElementById('errorMessage')
		errorMessage.textContent =
			'Ошибка: Chart.js не загружен. Проверьте подключение к CDN.'
		errorMessage.style.display = 'block'
		console.error(
			'Chart.js is not defined. Ensure the CDN script is loaded correctly.'
		)
		return
	}

	let lastValue = 0
	let dataPoints = []
	let labels = []
	const maxDataPoints = 20

	const ctx = document.getElementById('cpuChart').getContext('2d')
	const cpuChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					label: 'CPU Usage',
					data: dataPoints,
					borderColor: 'rgba(75, 192, 192, 1)',
					backgroundColor: 'rgba(75, 192, 192, 0.2)',
					fill: true,
					tension: 0.4,
					borderWidth: 2,
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: 'CPU Usage',
				},
				legend: {
					display: true,
				},
			},
			scales: {
				x: {
					title: {
						display: true,
						text: 'Time',
					},
				},
				y: {
					title: {
						display: true,
						text: 'Usage',
					},
					beginAtZero: true,
				},
			},
		},
	})

	function fetchCpuData() {
		console.log('Fetching CPU data...')
		fetch('http://localhost:3000/service/cpu', {
			method: 'GET',
			redirect: 'manual',
		})
			.then(response => {
				console.log('Status:', response.status)
				console.log('Headers:', [...response.headers.entries()])
				if (response.type === 'opaqueredirect') {
					throw new Error(
						'Request was redirected to: ' + response.headers.get('Location')
					)
				}
				if (!response.ok) {
					return response.text().then(text => {
						throw new Error(
							`Network response was not ok: ${
								response.status
							}, received: ${text.slice(0, 200)}...`
						)
					})
				}
				const contentType = response.headers.get('Content-Type')
				if (!contentType || !contentType.includes('text/html')) {
					return response.text().then(text => {
						throw new Error(
							`Unexpected content type: ${contentType}, received: ${text.slice(
								0,
								200
							)}...`
						)
					})
				}
				return response.text()
			})
			.then(html => {
				console.log('Received HTML:', html)
				let value = null
				let match = html.match(/<body>\s*(\d+)\s*<\/body>/i)
				if (match && match[1]) {
					value = Number(match[1])
				} else {
					match = html.match(/(\d+)/)
					if (match && match[1]) {
						value = Number(match[1])
					}
				}
				if (value === null) {
					throw new Error(
						'Could not extract number from HTML response: ' + html
					)
				}
				if (value === 0) {
					value = lastValue
				} else {
					lastValue = value
				}
				const now = new Date()
				labels.push(now.toLocaleTimeString())
				dataPoints.push(value)
				if (dataPoints.length > maxDataPoints) {
					dataPoints.shift()
					labels.shift()
				}
				cpuChart.data.labels = labels
				cpuChart.data.datasets[0].data = dataPoints
				cpuChart.update()
			})
			.catch(error => {
				console.error('Ошибка при загрузке данных:', error)
				const errorMessage = document.getElementById('errorMessage')
				errorMessage.textContent = 'Ошибка загрузки данных: ' + error.message
				errorMessage.style.display = 'block'
				if (lastValue !== 0) {
					const now = new Date()
					labels.push(now.toLocaleTimeString())
					dataPoints.push(lastValue)
					if (dataPoints.length > maxDataPoints) {
						dataPoints.shift()
						labels.shift()
					}
					cpuChart.data.labels = labels
					cpuChart.data.datasets[0].data = dataPoints
					cpuChart.update()
				}
			})
	}
	fetchCpuData()
	setInterval(fetchCpuData, 5000)
})
