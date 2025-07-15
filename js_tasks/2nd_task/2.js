document.addEventListener('DOMContentLoaded', function () {
	const nameInput = document.getElementById('name')
	const telInput = document.getElementById('tel')
	const emailInput = document.getElementById('email')
	const comment = document.getElementById('comment')
	const btn = document.getElementById('btn')

	const messageDiv = document.createElement('div')
	messageDiv.style.marginTop = '10px'
	messageDiv.style.color = 'red'
	btn.after(messageDiv)

	let placemark = null
	let selectedCoords = null
	let myMap = null

	ymaps.ready(init)
	function init() {
		myMap = new ymaps.Map('map', {
			center: [54.1994, 37.6216],
			zoom: 11,
		})

		myMap.events.add('click', function (e) {
			var coords = e.get('coords')
			selectedCoords = coords

			if (placemark) {
				myMap.geoObjects.remove(placemark)
			}

			placemark = new ymaps.Placemark(
				coords,
				{
					balloonContent: `Выбранная точка: ${coords[0].toFixed(
						6
					)}, ${coords[1].toFixed(6)}`,
				},
				{
					preset: 'islands#redDotIcon',
					balloonCloseButton: false,
					hideIconOnBalloonOpen: false,
				}
			)
			myMap.geoObjects.add(placemark)
			placemark.balloon.open()
		})
	}

	telInput.addEventListener('input', function () {
		this.value = this.value.replace(/[^\d]/g, '')
	})

	btn.addEventListener('click', function () {
		let errors = []

		if (!nameInput.value.trim()) {
			errors.push('ФИО является обязательным полем')
		}

		if (!telInput.value.trim()) {
			errors.push('Телефон является обязательным полем')
		} else if (telInput.value.trim().length < 10) {
			errors.push('Телефон должен содержать не менее 10 цифр')
		}

		if (emailInput.value.trim() && !emailInput.value.includes('@')) {
			errors.push('Email должен содержать символ @')
		}

		if (comment.value.length > 500) {
			errors.push('Комментарий не должен превышать 500 символов')
		}

		if (!selectedCoords) {
			errors.push('Необходимо выбрать точку на карте')
		}

		if (errors.length > 0) {
			messageDiv.style.color = 'red'
			messageDiv.innerHTML = errors.join('<br>')
		} else {
			messageDiv.style.color = 'green'
			messageDiv.textContent = 'Заказ оформлен!'
		}
	})
})
