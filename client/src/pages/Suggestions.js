import React, { Component } from 'react'
import './Suggestions.css'

class Suggestions extends Component{
	constructor(props){
		super(props)
		this.state = {
			earnings : []
		}

		this.handleChange = this.handleChange.bind(this)
	}
	
	componentDidMount(){
		this.fetchData()
	}

	handleChange(event){
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	async fetchData(){
		const result = await fetch('/api/suggestions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
			this.setState({ earnings: result.earnings })
		}
		else{
			this.props.history.push('/')
		}
	}

	render(){
		const earnings = this.state.earnings 
		return(
			<div className = "App-header">
				<div className = "suggestion-container">
					<div className = "heading"><h3> Upcoming Earnings </h3></div>
					<div className = "row">
						<span>$Symbol</span><span>Date of Earnings</span><span>Hours(BMO for Before market hours, AMC for after market close)</span>
					</div>
						{earnings.map((earning, index) => (
							<div className = {index % 2 != 0 ? ("row") : ("row-2")} >
								<span>{earnings[index].symbol}</span><span>{earnings[index].date}</span><span>{earnings[index].hour}</span>
							</div>
						))}
				</div>	
			</div>
		)
	}
}
export default Suggestions
