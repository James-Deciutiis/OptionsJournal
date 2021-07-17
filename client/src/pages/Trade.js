import React, { Component } from 'react'
import { Button } from "../components/Button.js"

class Trade extends Component{
	constructor(props){
		super(props)
		this.state = {
			trades : [],
			date : ""
		}
	}
	
	componentDidMount(){
		this.fetchData()
	}
	
	async fetchData(){
		const result = await fetch('/api/trade', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
			})
		}).then((res) => res.json())
		if(result.status === 'ok'){
			this.setState({ trades : result.trades })
			this.setState({ date : result.trades[0].date })
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


	render(){
		const trades = this.state.trades
		const date = this.state.date

		return(
			<div className="App-header">
				<div className = "journal-container">
					<div className="heading">
						<h1> Trades Exp On: {date}  </h1>
					</div>
					<div className="journal-row-2">
						<span>Name</span><span>Quantity</span><span>Type</span><span>Expiration Date</span><span>Price</span><span>Close Price</span><span>Profit/Loss</span>
					</div>
					{trades.map((entry, index_one) => (
						<div>
							{!trades[index_one].close_price ?  (
							<div className={index_one % 2 == 0 ? "journal-row":"journal-row-2"}>
								<span>{trades[index_one].name}</span><span>{trades[index_one].quantity}</span><span>{trades[index_one].type}</span><span>{trades[index_one].date}</span><span>{trades[index_one].price}</span><span>N/A</span><span>N/A</span>
								<span>
								</span>
							</div>
							) : (
							<div className={index_one % 2 == 0 ? "journal-row":"journal-row-2"}>
								<span>{trades[index_one].name}</span><span>{trades[index_one].quantity}</span><span>{trades[index_one].type}</span><span>{trades[index_one].date}</span><span>{trades[index_one].price}</span><span>{trades[index_one].close_price}</span>
								{((trades[index_one].close_price - trades[index_one].price) * trades[index_one].quantity) > 0 ? (
									<span>
										{(trades[index_one].close_price - trades[index_one].price) * trades[index_one].quantity}
										</span>		
									) : (
										<span>
											{(trades[index_one].close_price - trades[index_one].price) * trades[index_one].quantity}
										</span>		
									)}
								<span>
								</span>
							</div>
							)}
						</div>
					))}
				<br></br>
			</div>
		</div>
		)
	}
}

export default Trade
