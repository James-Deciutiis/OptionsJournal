import React, { Component } from 'react'
import { Button } from "../components/Button.js"
import "./Journal.css"

class EditTrade extends Component{
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
		await this.fetchData()
	}

	handleChange(event){
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	
	async fetchData(){
		const result = await fetch('/api/fetch-single-trade', {
			method : 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
			this.setState({title: result.trade_data.name})
			this.setState({quantity: result.trade_data.quantity})
			this.setState({type: result.trade_data.type})
			this.setState({date: result.trade_data.date})
			this.setState({price: result.trade_data.price})
			this.setState({close_price: result.trade_data.close_price})
		}
		else{
			if(result.error === 'invalid-signature'){
			}
			else{
				alert(result.error)
			}
		}
	}

	async deleteTrade(event){
		event.preventDefault()
		const result = await fetch('/api/delete-trade', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
			})
		}).then((res) => res.json())
	
		if(result.status === 'ok'){
			document.location.href  = '/account'
		}
		else{
			alert(result.error)
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
		const title = this.state.title
		const quantity = this.state.quantity
		const type = this.state.type
		const date = this.state.date
		const price = this.state.price
		const close_price = this.state.price
		return(
			<div className="App-header">
				<div className="heading">
					<title> Login </title>
				</div>
				<h1> Edit Trade </h1>
				<h3> Leave field empty for no change </h3>
				<form action = "/journal" method="get">
					<button> Go Back </button>
				</form>
				<form id='delete-trade'>
				</form>
				<form id='edit-trade'>
					Name of trade (i.e 2asdas50/255 $SPY ):
					<br></br>
					<input type = "text" id="name" placeholder={title} />	
					<br></br>
					Quantity:
					<br></br>
					<input type="number" placeholder={quantity} id="quantity"/> 
					<br></br>
					Type of spread (i.e Credit, Debit, Condor, Butterfly):
					<br></br>
					<input type = "text" id="type" placeholder={type}/>	
					<br></br>
					Date of Expiration:
					<br></br>
					<input type = "date" id="date" placeholder={date} />	
					<br></br>
					Equity (if this is a net credit spread, make sure this is negative):
					<br></br>
					<input type = "number" id="price" placeholder={price}/>	
					<br></br>
					Price At Close (Leave empty if trade has not concluded yet):
					<br></br>
					<input type = "number" id="close_price" placeholder={close_price}/>
					<br></br>
					<input type="submit" id="submit" placeholder="submit"/>
				</form> 
			</div>
		)}
	}
export default EditTrade
