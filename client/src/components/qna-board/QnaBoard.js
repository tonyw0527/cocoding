import React, {useState, useEffect, useRef} from 'react';
import './QnaBoard.css';
import Memo from './memo/Memo';

const QnaBoard = (props) => {
    const {socket} = props;

    const [Question, setQuestion] = useState('');
    const [QnaList, setQnaList] = useState([]);

    useEffect(() => {
        if(socket){
            socket.emit('send qna-list-cache');
            socket.on('send qna-list-cache', (data) => {
                setQnaList(data);
            })

            socket.on('send qna-list', (data) => {
                setQnaList([]);
                setQnaList(data);
            })
        }
        return () => {
            if(socket){
                socket.off('send qna-list-cache');
                socket.off('send qna-list');
            }
        }
    }, [socket]);

    const handleEditDone = (index, qna) => {
        const newQnaList = QnaList;
        newQnaList[index].question = qna.question;
        newQnaList[index].answer = qna.answer;
        setQnaList(newQnaList);
        const data = newQnaList;
        socket.emit('send qna-list', data);
    }

    const renderList = () => {
        return QnaList.map((qna, index) => {
            return (
                <Memo key={index} index={index} qna={qna} onHandleEditDone={handleEditDone} />
            );
        });
    };

    return (
        <div className="Qna-wrapper">
            <div className="Qna-title-box">
                <h3>Q&A Board</h3>
            </div>
            <div className="Qna-input-box">
                <label>질문하기</label>
                <input type="text" value={Question} onChange={(e) => {setQuestion(e.target.value)}} onKeyPress={(e) => {
                    if(e.code === "Enter") {
                        const data = [...QnaList, {question: Question, answer: 'Answer is...'}];
                        setQnaList(data);
                        socket.emit('send qna-list', data);
                        setQuestion('');
                    }
                }} />
            </div>
            <div className="Qna-list-box">
                {renderList()}
            </div>
        </div>
    );
};

export default QnaBoard;
