document.addEventListener('DOMContentLoaded', () => {
	let productsData = []

	function displayTable(products) {
		const tableBody = document.getElementById('tableBody')
		tableBody.innerHTML = ''

		if (products.length === 0) {
			tableBody.innerHTML =
				'<tr><td colspan="5">Нет данных, попадающих под условие фильтра</td></tr>'
			return
		}
		products.forEach((product, index) => {
			const sum = product.quantity * product.price
			const row = document.createElement('tr')
			row.innerHTML = `
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>${product.price}</td>
                <td>${sum}</td>
            `
			tableBody.appendChild(row)
		})
	}

	function filterProducts(minPrice, maxPrice) {
		return productsData.filter(product => {
			return product.price >= minPrice && product.price <= maxPrice
		})
	}
	fetch('http://localhost:3000/service/products', {
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
			if (!contentType || !contentType.includes('application/json')) {
				return response.text().then(text => {
					throw new Error(
						`Unexpected content type: ${contentType}, received: ${text.slice(
							0,
							200
						)}...`
					)
				})
			}
			return response.json()
		})
		.then(data => {
			productsData = data
			displayTable(productsData)
		})
		.catch(error => {
			console.error('Ошибка при загрузке данных:', error)
			const tableBody = document.getElementById('tableBody')
			tableBody.innerHTML =
				'<tr><td colspan="5">Ошибка загрузки данных: ' +
				error.message +
				'</td></tr>'
		})

	document.getElementById('btn').addEventListener('click', () => {
		const minPriceInput = document.getElementById('ot').value
		const maxPriceInput = document.getElementById('do').value
		const tableBody = document.getElementById('tableBody')

		if (minPriceInput === '' || maxPriceInput === '') {
			tableBody.innerHTML = '<tr><td colspan="5">Заполните фильтры</td></tr>'
			return
		}
		const minPrice = Number(minPriceInput)
		const maxPrice = Number(maxPriceInput)
		if (isNaN(minPrice) || isNaN(maxPrice)) {
			tableBody.innerHTML =
				'<tr><td colspan="5">Ошибка: Введите корректные числовые значения</td></tr>'
			return
		}
		if (minPrice < 0 || maxPrice < 0) {
			tableBody.innerHTML =
				'<tr><td colspan="5">Ошибка: Цены не могут быть отрицательными</td></tr>'
			return
		}
		if (minPrice > maxPrice) {
			tableBody.innerHTML =
				'<tr><td colspan="5">Ошибка: Минимальная цена не может быть больше максимальной</td></tr>'
			return
		}
		if (minPrice === 0 && maxPrice === 0) {
			displayTable(productsData)
			return
		}
		const filteredProducts = filterProducts(minPrice, maxPrice)
		displayTable(filteredProducts)
	})
})
