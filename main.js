const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient
const Trade = require('./model/trade')
const User = require('./model/user')
const aws = require('aws-sdk')
const bcrypt = require('bcryptjs')
const ls = require('local-storage')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const calendar = require('./config/calendar-config')
const app = express()

//const SECRET = process.env.S3_SECRET
const SECRET = "321H9FN4=93UI1QOFN4=98HAS9-D8H@9H29UFE!"

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static((path.join(__dirname, 'client/build'))));

app.get("*", (req, res) => {
	    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const client = new MongoClient("mongodb+srv://admin_thosonn:PZSdxQATXm6iNcX@optionsjournalcluster.yoiju.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"	, {

//const client = new MongoClient(process.env.MONGO_URI, {
	useNewUrlParser: true,
	connectTimeoutMS: 30000,
	useUnifiedTopology: true
})

async function add(doc) {
    try {
         await client.connect()
         console.log("Connected correctly to server")
         const db = client.db("UsersTrades")
         const col = db.collection("Users/Trades")
         const p = await col.insertOne(doc)
         const myDoc = await col.findOne()
        } catch (err) {
         console.log(err.stack)
     }
     finally {
        await client.close();
    }
}

async function find(username){
	try{
         await client.connect()
         console.log("Connected correctly to server")
         const db = client.db("UsersTrades")
         const col = db.collection("Users/Trades")
         const result = await col.findOne({username})
	 if(result){
	  return result
	 }
	 else{
	   return false
	 }
        } 
	catch (err) {
         console.log(err.stack)
     	}
}

async function update(username_, obj_type, obj){
	try{
         await client.connect()
         console.log("Connected correctly to server")
         const db = client.db("UsersTrades")
         const col = db.collection("Users/Trades")
	 const filter = {username: username_}
	 const options = {upsert: true}
	 const updateDoc = {
		$set: {
			obj_type:
				obj
		},
	};

	 const result = await col.updateOne(filter, updateDoc, options)
        } 
	catch (err) {
         console.log(err.stack)
     	}
}

function createDates(){
	let date = new Date()

	let day = date.getDate()
	let month = date.getMonth() + 1
	let year = date.getFullYear()
	let next_day = (day+5)%31

	if(day.toString.length < 2){
		day = '0'+ day
	}
	if(month.toString.length < 2){
		month = '0'+ month
	}
	if(next_day.toString.length < 2){
		next_day = '0'+ next_day
	}
	if(next_day ==  0){
		next_day = 1
	}
	
	start = year + "-" + month + "-" + day
	end = year + "-" + month + "-" + next_day

	return [ start, end ]
}

function validateUser(){
	token = ls.get('token')
	try{
		const username = jwt.verify(token, SECRET).username
		return true
	}
	catch(error){
		return false
	}

	return false
}

app.listen(process.env.PORT || 3000, function(){
		  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
})

app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await find(username)
	//const user = await User.findOne({ username }).lean()

	console.log(user)
	if(!user){
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if(await (bcrypt.compare(password, user.password))){
		ls.set('trades', user.trades)
		const token = jwt.sign({ id: user._id, username: user.username }, SECRET)
		ls.set('token', token)
		return res.json({ status: 'ok' , data: token })
	}

	return res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/register', async (req, res) => {
	const { username, password: plainTextPassword } = req.body
	const password = await bcrypt.hash(plainTextPassword, 10)

	if(!username || plainTextPassword.length < 9 || typeof username !== 'string' || typeof plainTextPassword !== 'string'){
		return res.json({ status: 'error', error: 'Empty or invalid username/password (NOTE, make sure password is at least 9 characters long).'})
	}

	try{
		const response = ({
			username,
			password,
			trades: []
		})
		await add(response)
	}
	catch(error){
		if(error.code === 11000){
			return res.json({ status:'error', error:'Duplicate username'})
		}
		
		throw error
	}

	return res.json({status: 'ok'})
})

app.post('/api/record-trade', async (req, res) => {
	if(validateUser()){
		let trades = ls.get('trades')
		const { name, quantity, type, date, price, close_price } = req.body
		if(name && type && date && price && quantity){
			const username = jwt.verify(ls.get('token'), SECRET).username
			try{
				trades.push({ "name" : name, "quantity": quantity, "type": type, "date": date, "price": price, "close_price" : close_price})
				ls.set('trades', trades)
				await update(username, "trades", trades)
			}
			catch(error){
				console.log(error)
				return res.json({status: 'error', error:'Session expired, please login again'})
			}

			return res.json({status: 'ok'})
		}
		else{
			return res.json({status: 'error', error:'Make sure all fields are filled in'})
		}
	}
	else{
		return res.json({status: 'error', error:'Session expired, please login again'})
	}
})

app.post('/api/edit-trade', async(req, res) => {
	if(validateUser()){
		const { index, name, quantity, type, date, price, close_price } = req.body
		const username = jwt.verify(ls.get('token'), SECRET).username
		try{
			let trades = ls.get('trades')
			const user = await find(username)
			const id = user._id
			let entry = {"name": trades[index].name, "quantity": trades[index].quantity, "type": trades[index].type, "date": trades[index].date, "price" : trades[index].price, "close_price" : trades[index].close_price} 
			if(name){
				entry.name  = name
			}
			if(quantity){
				entry.quantity = quantity
			}
			if(type){
				entry.type = type
			}
			if(date){
				entry.date = date
			}
			if(price){
				entry.price = price
			}
			if(close_price){
				entry.close_price = close_price
			}
						
			trades[index] = entry
			await ls.set('trades', trades)
			trades = ls.get('trades')
			await update(username, "trades", trades)
		}
		catch(error){
			return res.json({status: 'error', error:error})
		}

		return res.json({status: 'ok'})
	}
	else{
		return res.json({status: 'error', error:'Session expired, please login again'})
	}
		
	return res.json({status: 'error', error:'Session expired, please login again'})
})

app.post('/api/delete-trade', async(req, res) => {
	if(validateUser()){
		const { index } = req.body
		const username = jwt.verify(ls.get('token'), SECRET).username
		try{
			trades = ls.get('trades')
			trades.splice(index, 1)
			ls.set('trades', trades)
			await update(username, "trades", trades)
		}
		catch(error){
			return res.json({status: 'error', error:'Session expired, please login again'})
		}

		return res.json({status: 'ok'})
	}
	else{
		return res.json({status: 'error', error:'Session expired, please login again'})
	}

	return res.json({status: 'error', error:'Session expired, please login again'})
})


app.post('/api/change-password', async (req, res) => {
	if(validateUser()){
		let token = ls.get('token')
		const { newpassword, newpassword_confirm} = req.body
		if(newpassword !== newpassword_confirm || newpassword.length < 9){
			return res.json({ status:'error', error:'Passwords are not the same or are not long enought (NOTE, make sure password is at least 9 characters long)' })
		}
		
		const password = await bcrypt.hash(newpassword, 10)
		try{
			const user = jwt.verify(token, SECRET)
			const _id = user.id
			await update(username, "password", password)
		}
		catch(error){
			return res.json({ status:'error', error:'invalid-signature' })
		}
	}
	else{
		return res.json({ status:'error', error:'invalid-signature' })
	}
})

app.post('/api/suggestions', async(req, res) => {
	try{
		if(validateUser()){
			const [start_date, end_date] = createDates()
			let API_Call = `https://finnhub.io/api/v1/calendar/earnings?from=${start_date}&to=${end_date}&token=c28qb6qad3if6b4c2h50`
			let earnings = []
			await fetch(API_Call , {
			}).then(
				function(response){
					return response.json()
				}
			).then(
				function(data){
					data = data.earningsCalendar
					for(let i = 0; i < data.length; i++){
						earnings.push({ "symbol" : data[i].symbol, "date": data[i].date, "hour": data[i].hour })
					}	
				}
			)
			
			return res.json({ status: 'ok' , earnings : earnings })
		}
		else{
			return res.json({ status: 'error' })
		}
	}
	catch(error){
		throw error
	}
})

app.post('/api/edit', function(req, res){
	const { index } = req.body
	try{
		if(validateUser()){
			trades = ls.get('trades')
			data = trades[index]
			ls.set('target_trade', data)
			ls.set('current_index', index)
			return res.json({ status: 'ok'})
		}
		else{
			console.log('HERE')
			return res.json({status: 'error', error: 'invalid-signature'})
		}
	}
	catch(error){
		throw error
	}
			
	console.log('HERE')
	return res.json({status: 'error', error: 'something is wrong'})
})

app.post('/api/fetch-single-trade', async(req, res) => {
	try{
		if(validateUser()){
			return res.json({ status : 'ok', trade_data: ls.get('target_trade'), current_index: ls.get('current_index')})
		}
		else{
			return res.json({ status : 'error',  error: 'invalid signature'})
		}
	}
	catch(error){
		return res.json({ status : 'error',  error: 'invalid signature'})
	}
})

app.post('/api/set-trades', async(req, res) => {
	const { fetched_date  } = req.body
	try{
		if(validateUser()){
			let trades = ls.get('trades')
			let fetched_trades = []
			for(let i = 0; i < trades.length; i++){
				if(trades[i].date == fetched_date){
					fetched_trades.push(trades[i]);
				}
			}

			ls.set('current_trades', fetched_trades)
			return res.json({status: 'ok', current_trades : ls.get('current_trades')})
		}
		else{
			return res.json({status: 'error', error : 'invalid-signature'})
		}
	}
	catch(error){
		throw error
		return res.json({status: 'error', error : error})
	}
})

app.post('/api/trade', async(req, res) => {
	try{
		if(validateUser()){
			return res.json({ status : 'ok', trades : ls.get('current_trades') })
		}
		else{
			return res.json({ status : 'error',  error: 'invalid signature'})
		}
	}
	catch(error){
		return res.json({ status : 'error',  error: 'invalid signature'})
	}
})

app.post('/api/logout', async (req, res) => {
	try{
		ls.set('token', null)
		return res.json({ status: 'ok' })
	}
	catch(error){
		throw error
	}
})

app.post('/api/account', async(req, res) => {
	try{
		if(validateUser()){
			trades = ls.get('trades')
			const year = req.body.year || 2021
			const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
			return res.json({ status : 'ok', calendar: calendar(year), months: months, year: year, trade_data: trades})
		}
		else{
			return res.json({ status : 'error', error: "invalid-signature"})
		}
	}
	catch(error){
		return res.json({ status : 'error', error: "invalid-signature"})
	}
})

app.post('/api/record', async(req, res) => {
	try{
		if(validateUser()){
			return res.json({ status : 'ok'})
		}
		else{
			return res.json({ status : 'error', error:'invalid-signature'})
		}
	}
	catch(error){
		throw error
	}
			
	return res.json({ status : 'error'})
})

	
app.post('/api/journal', async(req, res) => {
	try{
		if(validateUser()){
			trades = ls.get('trades')
			let total_pl = 0
			trades.map((trade, index) => {
				if(trades[index].close_price){
					total_pl += (trades[index].close_price - trades[index].price) * trades[index].quantity
				}
			})

			return res.json({ status: 'ok', journal: trades, total_pl : total_pl })
		}
		else{
			return res.json({ status:'error', error:'invalid-signature' })
		}
	}
	catch(error){
		return res.json({ status:'error', error:'invalid-signature'})
	}
})
