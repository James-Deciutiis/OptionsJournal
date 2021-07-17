import React, { Component } from 'react'
import { Button } from "../components/Button.js"
import "./Account.css"

class Account extends Component{
	constructor(props){
		super(props)
		this.state = {
			year: "",
			calendar: [],
			months: [],
			trade_data: [],
			is_populated: Array(366).fill(false)
		}
		
		const year = (new Date()).getFullYear();
		this.years = Array.from(new Array(20),(val, index) => index + year);
		
		this.handleChange = this.handleChange.bind(this)
		this.sendToTrade = this.sendToTrade.bind(this)
		this.updateCalendar = this.updateCalendar.bind(this)
		this.logUserOut = this.logUserOut.bind(this)
	}

	componentDidMount(){
		this.fetchData()
	}

	async fetchData(){
		const result = await fetch('/api/account', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
			this.setState({ calendar: result.calendar })
			this.setState({ months: result.months })
			this.setState({ year: result.year })
			this.setState({ trade_data: result.trade_data })
		}
		else{
			if(result.error === 'invalid-signature'){
				this.props.history.push('/')
			}
			else{
				alert('something is wrong')
			}
		}
	}
	
	async updateCalendar(event){
		event.preventDefault()

		const new_year = this.state.year
		const result = await fetch('/api/account', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				year: new_year
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
			this.setState({ calendar: result.calendar })
			this.setState({ months: result.months })
			this.setState({ year: result.year })
			this.setState({ trade_data: result.trade_data })
		}
		else{
			if(result.error === 'invalid-signature'){
				this.props.history.push('/')
			}
			else{
				alert('something is wrong')
			}
		}
	}
		
	async logUserOut(event){
		event.preventDefault()

		const result = await fetch('/api/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
			this.props.history.push('/')
		}
		else{
			if(result.error === 'invalid-signature'){
				this.props.history.push('/')
			}
			else{
				alert('something is wrong')
			}
		}
	}

	async sendToTrade(event){
		event.preventDefault()
		const date = event.target.value

		const result = await fetch('/api/set-trades', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				fetched_date : date
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
			this.props.history.push('/trade')
		}
		else{
			if(result.error === 'invalid-signature'){
				this.props.history.push('/')
			}
			else{
				alert('something is wrong')
				alert(result.error)
			}
		}
	}
		
		
	handleChange(event){
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	getTradeDate(tradeObj){
		let trade_year = tradeObj.date.substring(0, 4)
		let trade_month = tradeObj.date.substring(5, 7)
		let trade_day = tradeObj.date.substring(8, 10)	
		
		return [trade_year, trade_month, trade_day]
	}

	equalDates(tradeObj, date){
		const [trade_year, trade_month, trade_day] = this.getTradeDate(tradeObj)

		return trade_year == date[0] && trade_month == date[1] && trade_day == date[2]
	}

	checkPopulated(is_populated, date){
		if(!is_populated[date]){
			is_populated[date] = true
			return false
		}

		return true
	}
		
		
	render(){
		const calendar = this.state.calendar
		const months = this.state.months
		const year = this.state.year
		const trade_data = this.state.trade_data
		const is_populated = this.state.is_populated

		return (
			<div className="App-header">
				<div className = "cal-heading">
					<h1> Dashboard </h1>
					<form action="/change-password" method="get">
						<Button type="Submit">Change Password</Button>
					</form>
					<select value= {this.year} onChange = {this.updateCalendar}>
			     			{
				            	this.years.map((y, index) => {
							return <option key={`year${index}`} value={y}>{y}</option>
						})}
			    		</select>
					<br></br>
					<h2>Year: {year}</h2>
				</div>
				<div className="calendar-container">
					{calendar.map((month, index_one) => (
						<div className="month-container" id={month}>
							<div className = "month-heading"> <h3>{months[index_one]}</h3> </div>
							<br></br>
							<div className="day-of-week">
								<span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
							</div>
							{calendar[index_one].map((day, index_two) => (
								<div className="days">
									{calendar[index_one][index_two].map((date, index_three) => (
										<div>
										{calendar[index_one][index_two][index_three] ? ( 
											<div className="date">
												<div id={calendar[index_one][index_two][index_three]}>
													{calendar[index_one][index_two][index_three]}
													{trade_data.length ? (
														<div>
															{trade_data.map((trade, index_four) => ( 
																<div>
																{this.equalDates(trade_data[index_four], [year, index_one+1, calendar[index_one][index_two][index_three]]) ? ( 
																	<div>
																	{!this.checkPopulated(is_populated, trade_data[index_four].date) ? (
																			<div>
																				<h7>View Trades</h7>
																				<br></br>
																				<button onClick={this.sendToTrade} value={trade_data[index_four].date}>View</button>
																			</div>
																			):(
																			<div>
																			</div>
																	)}
																	</div>
																	) : (
																	<div>
																	</div>
																)}
																</div>
															))}	
														</div>
													):(
														<div>
														</div>
													)
													}
											</div>
										</div>
										) : ( 
										<div>
										</div>
										)}
										</div>
									))}
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		)	
	}
}

																	/*{trade_data[index_four].close_price ? (
																		<div>
																			<h5> Profit/loss </h5>
																				{(trade_data[index_four].close_price - trade_data[index_four].price) > 0 ? (
																					<span>
																						up : 
																						{(trade_data[index_four].close_price - trade_data[index_four].price)}
																					</span>
																				) : (
																					<span>
																						down : 
																						{(trade_data[index_four].close_price - trade_data[index_four].price)}
																					</span>
																				)}
																		</div>
																	):(
																		<div>
																		</div>
																	)}*/

export default Account
