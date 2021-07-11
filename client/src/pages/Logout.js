import React, { Component } from 'react'

class Logout extends Component{
	constructor(props){
		super(props)
		this.state = {
		}
	
		this.logUserOut = this.logUserOut.bind(this)
	}
	
	componentDidMount(){
		this.logUserOut()
	}
	
	async logUserOut(){
		const result = await fetch('/api/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
			})
		}).then((res) => res.json())

		if(result.status === 'ok'){
			this.props.history.push('/')
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
			<div>
			</div>
		)
	}
		
}
export default Logout
