import React, { Component } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from "../components/Button.js"
import './Account.css'

toast.configure()
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
		
		const y = (new Date()).getFullYear();
		this.years = Array.from(new Array(20),(val, index) => index + y);
		
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
			toast.error(result.error)
			if(result.error === 'invalid-signature'){
				this.props.history.push('/')
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
			toast.success(`Year Changed to ${new_year}`)
			this.setState({ calendar: result.calendar })
			this.setState({ months: result.months })
			this.setState({ year: result.year })
			this.setState({ trade_data: result.trade_data })
		}
		else{
			toast.error(result.error)
			if(result.error === 'invalid-signature'){
				this.props.history.push('/')
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
			toast.error(result.error)
			if(result.error === 'invalid-signature'){
				this.props.history.push('/')
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
			toast.error(result.error)
			if(result.error === 'invalid-signature'){
				this.props.history.push('/')
			}
		}
	}
		
		
	handleChange(event){
		this.setState({
			year : event.target.value
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

		return trade_year === date[0] && trade_month === date[1] && trade_day === date[2]
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

		
		return(
		<div className="App-header">
				<div className = "cal-heading">
					<h1> Dashboard </h1>
						<div className = "widget-container">
							<div className = "widget-content">
								<form action="/change-password" method="get">
									<Button type="Submit">Change Password</Button>
								</form>
							</div>
							<div className = "widget-content">
								<form onSubmit={this.updateCalendar}>
									<h8> Change Year </h8>
									<br></br>
									<select value={this.state.year} onChange={this.handleChange}>
										{
										this.years.map((y, index) => {
											return <option value={y}>{y}</option>
										})}
									</select>
									<br></br>
									<br></br>
									<Button type="submit"> Change Year </Button>
								</form>
							</div>
						</div>
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
		)}
}
export default Account
