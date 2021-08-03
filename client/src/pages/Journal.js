import React, { Component } from 'react'
import { Button } from "../components/Button.js"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "./Journal.css"

toast.configure()
class Journal extends Component{
	constructor(props){
		super(props)
		this.state = {
			journal : [],	
			total_pl : 0
		}
		this.sendToEditTrade = this.sendToEditTrade.bind(this)
	}

	async componentDidMount(){
		await this.fetchData()
	}
	
	async fetchData(){
		const result = await fetch('/api/journal', {
			method : 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
			this.setState({ journal : result.journal })
			this.setState({ total_pl : result.total_pl })
		}
		else{
			toast.error(result.error)
			if(result.error === 'invalid-signature'){
				this.props.history.push('/')
			}
		}
	}
	
	async sendToEditTrade(event){
		event.preventDefault()
		const index = event.target.value

		const result = await fetch('/api/edit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				index:index
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
			this.props.history.push('/edit-trade')
		}
		else{
			toast.error(result.error)
			if(result.error === 'invalid-signature'){
				this.props.history.push('/')
			}
		}
	}

	render(){
		const journal = this.state.journal
		return(
		<div className="App-header">
			<br></br>
			<div className="journal-container">
				<div className="heading">
					<h7> Journal </h7>
					<br></br>
					<br></br>
					<form action = "/record">
						<Button> Add + </Button>
					</form>
					<br></br>
					<h10> Total Profit/loss: {this.state.total_pl}</h10>
				</div>
				<div className="journal-row-2">
					<span>Name</span><span>Quantity</span><span>Type</span><span>Expiration Date</span><span>Price</span><span>Close Price</span><span>Profit/Loss</span><span> Edit/Delete  </span>
				</div>
				{journal.map((entry, index_one) => (
					<div>
						{!journal[index_one].close_price ?  (
						<div className={index_one % 2 === 0 ? "journal-row":"journal-row-2"}>
							<span>{journal[index_one].name}</span><span>{journal[index_one].quantity}</span><span>{journal[index_one].type}</span><span>{journal[index_one].date}</span><span>{journal[index_one].price}</span><span>N/A</span><span>N/A</span>
							<span>
								<form action = "/edit-trade" method="post">
									<input type="hidden" name="index" value={index_one} />
									<span>
										<button onClick={this.sendToEditTrade} value={index_one}>Edit Trade</button>
									</span>
								</form>
							</span>
						</div>
						) : (
						<div className={index_one % 2 === 0 ? "journal-row":"journal-row-2"}>
							<span>{journal[index_one].name}</span><span>{journal[index_one].quantity}</span><span>{journal[index_one].type}</span><span>{journal[index_one].date}</span><span>{journal[index_one].price}</span><span>{journal[index_one].close_price}</span>
							{((journal[index_one].close_price - journal[index_one].price) * journal[index_one].quantity) > 0 ? (
								<span>
									{(journal[index_one].close_price - journal[index_one].price) * journal[index_one].quantity}
									</span>		
								) : (
									<span>
										{(journal[index_one].close_price - journal[index_one].price) * journal[index_one].quantity}
									</span>		
								)}
							<span>
								<button onClick={this.sendToEditTrade} value={index_one}>Edit Trade</button>
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

export default Journal
