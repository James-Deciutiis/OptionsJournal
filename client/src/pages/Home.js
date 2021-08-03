import React, { Component } from 'react';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from "../components/Button.js"
import "./Home.css"


toast.configure()
class Home extends Component {
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
			toast.success(`Welcome ${username}!`)
			this.props.history.push('/account')
		}
		else{
			toast.error(result.error)
		}
	}

	render() {
		return (
			<div className="App-header">
				<div className = "home-container">
					<div className = "heading">
						<h1> Welcome to Options Journal </h1>
					</div>
					<div className = "home-content">
						<div className = "home-col">
							<p> Options Journal is a service where derivatives traders can go to record their trades. Keeping track of how a trader does over a given period of time is paramount. With this tool you could see how certain strategies you have employed played out and with that information, make better decisions.</p>
						</div>
						<div className = "home-col">
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
							</form>
							<p> First time? Click <a href="/register">Here</a> to create an account</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
