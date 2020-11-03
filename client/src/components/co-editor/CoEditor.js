import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Painter from '../painter/Painter';
import QnaBoard from '../qna-board/QnaBoard';
import './CoEditor.css';
import dotenv from 'dotenv';
dotenv.config();

const CoEditor = (props) => {
    const {userName, password} = props.location.state;

    const socketRef = useRef();

    const [Text, setText] = useState('');
    const [IsTutor, setIsTutor] = useState(false);
    const [IsTutorLoggedIn, setIsTutorLoggedIn] = useState(false);

    useEffect(() => {
        socketRef.current = io.connect(process.env.REACT_APP_LOCAL_URL);

        socketRef.current.emit('login', { userName, password });

        socketRef.current.on('login', ({isTutor}) => {
            setIsTutor(isTutor);
        });

        socketRef.current.on('tutor login', ({login}) => {
            setIsTutorLoggedIn(login);
        });

        socketRef.current.on('send text', (text) => {
            setText(text);
        });

        return () => {
            socketRef.current.off('login');

            socketRef.current.off('tutor login');

            socketRef.current.off('send text');
        }
    }, [])

    return (
        <div className="CoEditor-wrapper">
            <div className="CoEditor-title">
                <h1>Co-Editor</h1>
                {IsTutorLoggedIn ? <h3>Tutoring <span style={{color: "red"}}>OnAir</span></h3> : <h3>Call your Tutor</h3>}
            </div>
            <div className="CoEditor-main">
                <textarea value={Text} onChange={(e)=>{
                    const text = e.target.value;
                        setText(text);
                        socketRef.current.emit('send text', text);

                    }} placeholder="for tutor">
                </textarea>
            </div>
            {/* <Painter /> */}
            <QnaBoard />
        </div>
    );
};

export default CoEditor;
