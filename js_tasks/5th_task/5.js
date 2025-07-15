$(document).ready(function () {
	let rows = 3
	let cols = 3
	let data = []
	function loadData() {
		const savedData = localStorage.getItem('spreadsheetData')
		if (savedData) {
			data = JSON.parse(savedData)
			rows = data.length
			cols = data[0] ? data[0].length : 3
		} else {
			data = Array(rows)
				.fill()
				.map(() => Array(cols).fill(''))
		}
	}

	function saveData() {
		localStorage.setItem('spreadsheetData', JSON.stringify(data))
	}

	function renderTable() {
		const $headerRow = $('#headerRow')
		const $tableBody = $('#tableBody')
		$headerRow.empty()
		$tableBody.empty()
		let headerHtml = '<th></th>'
		for (let j = 0; j < cols; j++) {
			headerHtml += `<th>${String.fromCharCode(65 + j)}</th>`
		}
		$headerRow.html(headerHtml)

		for (let i = 0; i < rows; i++) {
			let rowHtml = `<tr><th>${i + 1}</th>`
			for (let j = 0; j < cols; j++) {
				rowHtml += `<td data-row="${i}" data-col="${j}">${
					data[i][j] || ''
				}</td>`
			}
			rowHtml += '</tr>'
			$tableBody.append(rowHtml)
		}
	}

	function hasDataInRow(rowIndex) {
		return data[rowIndex].some(cell => cell !== '')
	}

	function hasDataInColumn(colIndex) {
		return data.some(row => row[colIndex] !== '')
	}

	loadData()
	renderTable()
	$('#spreadsheetTable').on('dblclick', 'td', function () {
		const $cell = $(this)
		const row = parseInt($cell.data('row'))
		const col = parseInt($cell.data('col'))
		const currentValue = data[row][col] || ''

		$cell.html(`<input type="text" value="${currentValue}">`)
		const $input = $cell.find('input')
		$input.focus()

		$input.on('blur keypress', function (e) {
			if (e.type === 'blur' || e.key === 'Enter') {
				const newValue = $input.val().trim()
				data[row][col] = newValue
				$cell.html(newValue)
				saveData()
			}
		})
	})
	$('.add-row').on('click', function () {
		data.push(Array(cols).fill(''))
		rows++
		renderTable()
		saveData()
	})
	$('.remove-row').on('click', function () {
		if (rows <= 1) {
			alert('Нельзя удалить последнюю строку!')
			return
		}
		const lastRowIndex = rows - 1
		if (hasDataInRow(lastRowIndex)) {
			if (!confirm('В последней строке есть данные. Удалить?')) {
				return
			}
		}
		data.pop()
		rows--
		renderTable()
		saveData()
	})

	$('.add-column').on('click', function () {
		data.forEach(row => row.push(''))
		cols++
		renderTable()
		saveData()
	})

	$('.remove-column').on('click', function () {
		if (cols <= 1) {
			alert('Нельзя удалить последний столбец!')
			return
		}
		const lastColIndex = cols - 1
		if (hasDataInColumn(lastColIndex)) {
			if (!confirm('В последнем столбце есть данные. Удалить?')) {
				return
			}
		}
		data.forEach(row => row.pop())
		cols--
		renderTable()
		saveData()
	})
})
