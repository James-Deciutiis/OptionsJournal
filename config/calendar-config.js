function calcTable(year){
	let arr = new Array(12)
	for(let i = 0; i < arr.length; i++){
		arr[i] = new Array(6)
	}
	
	for(let i = 0; i < arr.length; i++){
		for(let j = 0; j < arr[i].length; j++){
			arr[i][j] = new Array(7)
		}
	}
	
	for(let month = 0; month < arr.length; month++){
		let startWeekDay = new Date(year, month, 0).getDay() + 1
		let monthLength = new Date(year, month + 1, 0).getDate() + 1
		let beforeCount = 0
		let counter = 1
		let startCount = false

		for(let i = 0; i < arr[month].length; i++){
			for(let j = 0; j < arr[month][i].length; j++){
				if(beforeCount == startWeekDay){
					startCount = true
				}
				else{
					beforeCount++
				}

				if(startCount){
					arr[month][i][j] = counter
					counter++
				}
				else{
					arr[month][i][j] = ""
				}

				if(counter > monthLength){
					arr[month][i][j] = ""
				}
			}
		}
	}

	return arr
}

module.exports = calcTable
