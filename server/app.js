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

let text_cache = '';
let qna_list_cache = [];

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
            socket.emit('login', {isTutor: true, text_cache});
            io.emit('tutor login', {login: true});
        } else {
            socket.emit('login', {isTutor: false, text_cache});
            if(isTutorLoggedIn){
                io.emit('tutor login', {login: true});
            }
        }
    });

    socket.on('send text', (text) => {
        socket.broadcast.emit('send text', text);
        text_cache = text;
    })

    socket.on('send qna-list-cache', () => {
        const data = qna_list_cache;
        socket.emit('send qna-list-cache', data);
    })

    socket.on('send qna-list', (data) => {
        socket.broadcast.emit('send qna-list', data);
        qna_list_cache = data;
    })

    socket.on('disconnect', ()=> {
        if(tutorId === socket.client.id){
            isTutorLoggedIn = false;
            socket.broadcast.emit('tutor login', {login: false});
        }
    })

})

http.listen(PORT, () => {
    console.log(`server is running on ${PORT}!`);
})