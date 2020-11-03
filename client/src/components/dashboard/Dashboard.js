import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import CoEditor from '../co-editor/CoEditor';
import Painter from '../painter/Painter';
import QnaBoard from '../qna-board/QnaBoard';
import io from 'socket.io-client';
import dotenv from 'dotenv';
dotenv.config();
const socket = io.connect(process.env.REACT_APP_LOCAL_URL);

const Dashboard = (props) => {
    const {userName, password} = props.location.state;

    useEffect(() => {
        
        return () => {
            
        }
    }, [])

    return (
        <>
            <CoEditor socket={socket} userName={userName} password={password} />
            <Painter socket={socket} />
            <QnaBoard socket={socket} />
        </>
    );
}

export default Dashboard;