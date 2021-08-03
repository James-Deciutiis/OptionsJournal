import React, { Component } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from "../components/Button.js"

toast.configure()
class Register extends Component {
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
		const result = await fetch('/api/register', {
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
			toast.success(`New Account ${username} Created Successfully!`)
			this.props.history.push('/')
		}
		else{
			toast.error(result.error)
		}
	}

	render(){
		return (
			<div className="App-header">
				<div className="home-container">
					<div className="heading">
						<h1> Register </h1>
					</div>
					<div className="home-col">
						<br></br>
						<form onSubmit={this.handleSubmit}>
							Username:
							<br></br>
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
							<Button type="submit"> Register New Account </Button>
							<br></br>
							<br></br>
						</form>
					</div>
				</div>
			</div>
		)
	} 
}

export default Register
