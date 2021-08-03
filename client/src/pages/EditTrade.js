import React, { Component } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from "../components/Button.js"
import "./Journal.css"

toast.configure()
class EditTrade extends Component{
	constructor(props){
		super(props)
		this.state = {
			title : "",
			quantity : 0,
			type : "",
			date : "",
			price : 0,
			close_price : null,
			index : null
		}
	
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleDelete = this.handleDelete.bind(this)

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
			this.setState({index: result.current_index})
		}
		else{
			toast.error(result.error)
			if(result.error === 'invalid-signature'){
				this.props.history.push('/')
			}
		}
	}

	async handleSubmit(event){
		event.preventDefault()

		const index = this.state.index
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
		const result = await fetch('/api/edit-trade', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				index: index,
				quantity: quantity,
				name: name,
				type: type,
				date: formated_date,
				price: price,
				close_price: close_price
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
			toast.success(`Trade ${name} Edit Success`)
			this.props.history.push('/journal')
		}
		else{
			toast.error(result.error)
			if(result.error === 'invalid-signature'){
				this.props.history.push('/')
			}
		}
	}


	async handleDelete(event){
		event.preventDefault()

		const index = this.state.index
		const result = await fetch('/api/delete-trade', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				index: index
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){

			toast.success('Trade Deleted Successfully')
			this.props.history.push('/journal')
		}
		else{
			toast.error(result.error)
			if(result.error === 'invalid-signature'){
				this.props.history.push('/')
			}
		}
	}

	render(){
		const title = this.state.title
		const index = this.state.index 

		return(
			<div className="App-header">
				<div className="record-container">
					<div className="record-heading">
						<h1> Edit Trade: {title} </h1>
					</div>
					<h3> Leave field empty for no change </h3>
					<form action = "/journal" method="get">
						<button> Go Back </button>
					</form>
					<form  onSubmit = {this.handleDelete}>
						<button onClick={this.handleDelete} value={index}>Delete This Trade</button>
					</form> 
					<form onSubmit = {this.handleSubmit}>
						<div>
							Name of trade <div className = "tooltip"> (?) <span className="tooltiptext"> i.e 250/255 $SPY </span></div>
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
						Type of spread <div className = "tooltip"> (?) <span className="tooltiptext"> i.e Credit, Debit, Condor, Butterfly </span></div>
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
							<br></br>
							Currently: {this.state.date}
						</div>
						<br></br>
						<div>
							Equity Per Spread Or Contract <div className = "tooltip"> (?) <span className="tooltiptext"> if this is a net credit spread, make sure this is negative</span></div>
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
							Price At Close Per Spread or Contract <div className = "tooltip"> (?) <span className="tooltiptext"> Leave empty if trade has not concluded yet </span></div>
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
		)}
	}
export default EditTrade
