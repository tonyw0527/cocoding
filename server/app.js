const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT_NUMBER;
const tutorName = process.env.TUTOR_NAME;
const invitation_code = process.env.INVITATION_CODE;
let isTutorLoggedIn = false;
let tutorId = '';

io.on('connection', (socket) => {
    console.log(socket.client.id);
    console.log('logined!');

    socket.on('login', ({userName, password}) => {
        if(password !== invitation_code){
            socket.disconnect(true);
            return;
        }
        if(userName === tutorName) {
            isTutorLoggedIn = true;
            tutorId = socket.client.id;
            socket.emit('login', {isTutor: true});
            io.emit('tutor login', {login: true});
        } else {
            socket.emit('login', {isTutor: false});
        }
    });

    socket.on('send text', (text) => {
        socket.broadcast.emit('send text', text);
    })

    socket.on('disconnect', ()=> {
        if(tutorId === socket.client.id){
            socket.broadcast.emit('tutor login', {login: false});
        }
    })

})

http.listen(PORT, () => {
    console.log(`server is running on ${PORT}!`);
})