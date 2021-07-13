import React, { Component } from 'react'
import { Button } from "../components/Button.js"
import "./Record.css"

class Record extends Component{
	constructor(props){
		super(props)
		this.state = {
			title : "",
			quantity : 0,
			type : "",
			date : "",
			price : 0,
			close_price : null
		}
	
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	
	async componentDidMount(){
		await this.validateUser()
	}

	handleChange(event){
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	
	async validateUser(){
		const result = await fetch('/api/record', {
			method : 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
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

	async handleSubmit(event){
		event.preventDefault()

		const name = this.state.title
		const quantity = this.state.quantity
		const type = this.state.type
		const dateObj = this.state.date
		const price = this.state.price
		const close_price = this.state.close_price

		let year = dateObj.substring(0, 4)
		let month = dateObj.substring(5, 7)
		let day = dateObj.substring(8, 10)	

		const formated_date = year + "/" + month + "/" + day
		const result = await fetch('/api/record-trade', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				quantity: quantity,
				type: type,
				date: formated_date,
				price: price,
				close_price: close_price
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
			alert('Trade Recorded Successfully')
			this.props.history.push('/journal')
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
		return(
			<div className="App-header">
				<div className="record-container">
					<div className="record-heading">
						<h1> Record Your Trade </h1>
					</div>
					<form onSubmit = {this.handleSubmit}>
						<br></br>
						<div>
							Name of trade (i.e 250/255 $SPY ):
							<br></br>
							<input 
								type="text" 
								placeholder="Name"
								name="title" 
								value={this.state.title}
								onChange={this.handleChange}
							/>
						</div>
						<br></br>
						<div>
							Quantity:
							<br></br>
							<input 
								type="number" 
								placeholder="0" 
								name="quantity"
								value={this.state.quantity}
								onChange={this.handleChange}
							/> 
						</div>
						<br></br>
						<div>
						Type of spread (i.e Credit, Debit, Condor, Butterfly):
						<br></br>
						<input 
							type="text" 
							placeholder="Debit or Credit" 
							name="type"
							value={this.state.type}
							onChange={this.handleChange}
						/> 
						<br></br>
						</div>
						<br></br>
						<div>
							Date of Expiration:
							<br></br>
							<input
								type="Date" 
								placeholder="Expiration Date" 
								name="date"
								value={this.state.date}
								onChange={this.handleChange}
							/> 
						</div>
						<br></br>
						<div>
							Equity (if this is a net credit spread, make sure this is negative):
							<br></br>
							<input 
								type="Number" 
								placeholder="Price or Collateral" 
								name="price"
								value={this.state.price}
								onChange={this.handleChange}
							/> 
						</div>
						<br></br>
						<div>
							Price At Close (Leave empty if trade has not concluded yet):
							<br></br>
							<input 
								type="Number" 
								placeholder="Close Price" 
								name="close_price"
								value={this.state.close_price}
								onChange={this.handleChange}
							/> 
						</div>

						<br></br>
						<br></br>
						<Button type="submit"> Submit </Button>
						<br></br>
						<br></br>
					</form>
				</div>
			</div>
		)
	}
}
export default Record
