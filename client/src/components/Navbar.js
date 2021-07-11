import React, { Component } from 'react'
import { MenuItems } from "./MenuItems"
import { Button } from "./Button.js"
import './Navbar.css'

class Navbar extends Component{
	constructor(props){
		super(props)
		this.state = {
			clicked : false
		}

		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(){
		this.setState({ clicked: !this.state.clicked })
	}

	render(){
		return(
			<div className="navbar-items">
				<h1 className="navbar-logo">Options Journal <i className="fas fa-chart-area"/></h1>
				<div className="menu-icon" onClick={this.handleClick}>
					<i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}/>
				</div>
				<ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>	
					{MenuItems.map((item, index) => {
						return(
							<li key={index}>
								<a 
									className={item.cname} 
									href={item.url}
								>
									{item.title}			
								</a>
							</li>
						)
					})}
				</ul>
			</div>
		)
	}
}

export default Navbar
