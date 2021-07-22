import React, { Component } from 'react'
import { Button } from "../components/Button.js"
import './Login.css'

class Login extends Component {
	constructor(props){
		super(props)
		this.state = {
			username: "",
			password: ""
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event){
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	async handleSubmit(event){
		event.preventDefault()
		const username = this.state.username
		const password = this.state.password
		alert(username, password)


		const result = await fetch('/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username,
				password
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
			this.props.history.push('/account')
		}
		else{
			alert(result.error)
		}
	}

	render(){
		return (
			<div className = "App-header">
				<div className = "log-container">
					<div className="heading">
						<h1> Login </h1>
					</div>
				<br></br>
				Username:
				<form onSubmit={this.handleSubmit}>
					<input
						type="text" 
						name="username" 
						value={this.state.username} 
						onChange={this.handleChange}
					/>
					<br></br>
					<br></br>
					Password:
					<br></br>
					<input 
						type="password" 
						name="password" 
						value={this.state.password} 
						onChange={this.handleChange}
					/>
					<br></br>
					<br></br>
					<Button type="submit"> Log In </Button>
					<br></br>
					<br></br>
				</form>
				</div>
			</div>
		)
	} 
}

export default Login
