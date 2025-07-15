document.addEventListener('DOMContentLoaded', function () {
	const widthInput = document.getElementById('width')
	const heightInput = document.getElementById('heght')
	const randomColorBtn = document.getElementById('Btn')
	const rectangle = document.getElementById('rectangle')
	let currentColor = getRandomColor()

	updateRectangleSize()
	updateRectangleColor()

	randomColorBtn.addEventListener('click', function (event) {
		event.preventDefault()
		currentColor = getRandomColor()
		updateRectangleColor()
	})

	widthInput.addEventListener('input', updateRectangleSize)
	heightInput.addEventListener('input', updateRectangleSize)

	function updateRectangleSize() {
		const width = widthInput.value || widthInput.placeholder
		const height = heightInput.value || heightInput.placeholder

		rectangle.style.width = width + 'px'
		rectangle.style.height = height + 'px'
	}

	function updateRectangleColor() {
		rectangle.style.backgroundColor = currentColor
	}

	function getRandomColor() {
		return (
			'#' +
			Math.floor(Math.random() * 16777215)
				.toString(16)
				.padStart(6, '0')
		)
	}
})
