# OptionsJournal
Options Journal is a service where derivatives traders can go to record their trades. Keeping track of how a trader does over a given period of time is paramount. With this tool you could see how certain strategies you have employed played out and with that information, make better decisions. 

## Technologies and Concepts Used 
* Node.js
* React
* MongoDB
* Express JS
* RESTful APIs
* Web tokens

## How it works

### Getting Started
To get started, all you need to do is create an account.

### Recording and Editing a Trade

#### Recording
Once logged in, in order to record a new or previous trade, all you need to do is go to the journal section and press add at the top of your journal.
You will be sent to a page with a form where you can fill in information about the trade. Once you've completed the form, the journal will be updated with the new trade
and the calendar on the dashboard will populate that trade to the corresponding date. Clicking on the calandar date will show you more details about the trade that expires 
on the correspoding date. 

#### Editing
To edit a trade you just needs to go the the Journal page and hit the edit button on the right most column, doing this will bring you back to the form where you filled
out the trade originally. You can fill in any missing items or change them as you please.

### Suggestions Page
If you click the link to the suggestions page (which is found on the navbar) you will be brought to a page that will load a list of all upcoming earnings. These dates have been provided by a third-party API call.
