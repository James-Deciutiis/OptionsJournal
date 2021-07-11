import React, { Component } from 'react'
import { Button } from "../components/Button.js"

class ChangePassword extends Component{
	constructor(props){
		super(props)
		this.state = {
			newpassword : "",
			newpasswordconfirm : ""
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

		const newpass = this.state.newpassword
		const newpassconfirm = this.state.newpasswordconfirm
		const result = await fetch('/api/change-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				newpassword : newpass,
				newpassword_confirm : newpassconfirm		
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
			alert('Password Change Successful')
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
			<div className = "App-header">
				<div className = "log-container">
					<div className = "heading">
						<h1> Change Password </h1>
					</div>
					<br></br>
					<form onSubmit = {this.handleSubmit}>
						New Password:	
						<br></br>
						<input 
							type="password" 
							name="newpassword" 
							placeholder="New Password"
							value={this.state.newpassword}
							onChange={this.handleChange}
						/>
						<br></br>
						<br></br>
						New Password Confirm:
						<br></br>
						<input 
							type="password" 
							name="newpasswordconfirm" 
							placeholder="Confirm New Password"
							value={this.state.newpasswordconfirm}
							onChange={this.handleChange}
						/>
						<br></br>
						<br></br>
						<Button type="submit"> Change </Button>
						<br></br>
						<br></br>
					</form>
				</div>
			</div>	
		)
	}
}
export default ChangePassword
