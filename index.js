var fs = require('fs');
var express = require("express");
var bodyParser = require("body-parser");
var data = fs.readFileSync('db/data.json');
var chatObject = JSON.parse(data);
const PORT = process.env.PORT || 3000;
var app = express();

//middleware: request handling
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var server = app.listen(PORT, listening);

function listening() {
    console.log(`Server is listening on port ${PORT}!`);
}

app.use(express.static('public'));

//get chat data
app.get('/api/v1/chat/data', getChatData);

//add a chat element to data
app.post('/api/v1/chat/data', addChatDataElement);

//clear chat data
app.delete('/api/v1/chat/data', clearChatData);

//get the number of visitors
app.get('/api/v1/chat/numvisitors', getChatNumVisitors);

//update the number of visitors
app.put('/api/v1/chat/numvisitors/:num', updateChatNumVisitors);

function getChatData(request, response) {
    // console.log('Getting Complete');
    response.json(chatObject.data);
}

function addChatDataElement(request, response) {
    const date = new Date();
    const dates = [date.getDate(),date.getMonth(),date.getFullYear()]
    const dateStructure = dates.join("/")

    const hours = [date.getHours(),date.getMinutes()]
    const hourstructure = hours.join(":")
    chatObject.data.push({name: request.body.name, message: request.body.message,Year: dateStructure,Hour:hourstructure});
    var data = JSON.stringify(chatObject, null, 2);
    fs.writeFile('db/data.json', data, finished);

    function finished(err) {
        console.log('Writing Complete');
        response.json(chatObject.data);
    }
}

function clearChatData(request, response) {
    chatObject.data = [];
    var data = JSON.stringify(chatObject, null, 2);
    fs.writeFile('db/data.json', data, finished);

    function finished(err) {
        // console.log('Writing Complete');
        response.json(chatObject.data);
    }
}

function getChatNumVisitors(request, response) {
    // console.log('Getting Complete');
    response.json(chatObject.numVisitors);
}

function updateChatNumVisitors(request, response) {
    chatObject.numVisitors = Number(request.params.num);
    var data = JSON.stringify(chatObject, null, 2);
    fs.writeFile('db/data.json', data, finished);

    function finished(err) {
        // console.log('Writing Complete');
        response.json(chatObject.numVisitors);
    }
}