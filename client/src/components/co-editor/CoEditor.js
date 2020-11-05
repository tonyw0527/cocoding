import React, { useState, useEffect, useRef } from 'react';
import './CoEditor.css';
import { scrollToBottom } from '../../utils/utils';

const CoEditor = (props) => {
    const {socket} = props;
    const {userName, password} = props;

    const noteRef = useRef();
    const toolsRef = useRef();

    const [Text, setText] = useState('');
    const [IsTutor, setIsTutor] = useState(false);
    const [IsTutorLoggedIn, setIsTutorLoggedIn] = useState(false);

    const handleSendText = (e) => {
        if(e.type === 'click'){
            setTimeout(() => {
                const text = document.getElementById('note').innerHTML;
                socket.emit('send text', text);    
            }, 100);
            return;
        }
        const text = document.getElementById('note').innerHTML;
        socket.emit('send text', text);
    }

    const handleEdit = (e) => {
        if(e.code === 'Tab'){
            e.preventDefault();
            document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
        } else if (e.key === '{'){
            setTimeout(() => {
                document.execCommand('insertHTML', false, '}');
            }, 10);
        } else if (e.key === '('){
            // setTimeout(() => {
            //     document.execCommand('insertHTML', false, ')');
            // }, 10);
        } else if (e.key === `'`){
            // setTimeout(() => {
            //     document.execCommand('insertHTML', false, `'`);
            // }, 10);
        } else if (e.key === `"`){
            // setTimeout(() => {
            //     document.execCommand('insertHTML', false, `"`);
            // }, 10);
        }
    }

    useEffect(() => {
        noteRef.current.addEventListener('keydown', handleSendText);
        noteRef.current.addEventListener('keyup', handleSendText);
        toolsRef.current.addEventListener('click', handleSendText);

        noteRef.current.addEventListener('keydown', handleEdit);
        return () => {
            noteRef.current.removeEventListener('keydown', handleSendText);
            noteRef.current.removeEventListener('keyup', handleSendText);
            toolsRef.current.removeEventListener('click', handleSendText);

            noteRef.current.removeEventListener('keydown', handleEdit);    
        }
    }, [])

    useEffect(() => {
        socket.emit('login', { userName, password });

        socket.on('login', ({isTutor, text_cache}) => {
            setIsTutor(isTutor);
            setText(text_cache);
        });

        socket.on('tutor login', ({login}) => {
            setIsTutorLoggedIn(login);
        });

        socket.on('send text', (text) => {
            setText(text);
        });

        return () => {
            socket.off('login');
            socket.off('tutor login');
            socket.off('send text');
        }
    }, [socket])

    useEffect(() => {
        document.getElementById('note').innerHTML = Text;
        scrollToBottom(noteRef);
        return () => {
            
        }
    }, [Text])

    return (
        <div className="CoEditor-wrapper">
            <div className="CoEditor-title">
                <h1>Co-Editor</h1>
                {IsTutor ? <h3>Tutor Hi!</h3> : <h3>Tutee Hi!</h3>}
                {IsTutorLoggedIn ? <h3>Tutoring <span style={{color: "red"}}>OnAir</span></h3> : <h3>Call your Tutor</h3>}
            </div>
            <div className="CoEditor-main">
                <div ref={toolsRef} className="CoEditor-tools">
                    <button onClick={()=>{document.execCommand('bold')}}>
                        Bold
                    </button>
                    <button onClick={()=>{document.execCommand('foreColor', false, '#ffE57C')}}>
                        yellow
                    </button>
                    <button onClick={()=>{document.execCommand('Underline')}}>
                        Underline
                    </button>
                    <button onClick={()=>{
                        document.execCommand('selectAll');
                        document.execCommand('copy');
                        }}>
                        Copy
                    </button>
                    <button onClick={()=>{
                        const text = document.getElementById('note').innerText;
                        try{
                            const result = eval(text);
                        } catch (e){
                            alert(e);
                            console.log(e);
                        }
                        
                        }}>
                        Run
                    </button>
                </div>

                <code>
                <div ref={noteRef} id="note" className="CoEditor-note" contentEditable="true" spellCheck="false" >   
                </div>
                </code>
            </div>
        </div>
    );
};

export default CoEditor;
