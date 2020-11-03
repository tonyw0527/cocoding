import React, { useState } from 'react';
import './Memo.css'

const Memo = (props) => {
    const {index, qna, onHandleEditDone} = props;

    const [IsEditing, setIsEditing] = useState(false);
    const [Question, setQuestion] = useState(qna.question);
    const [Answer, setAnswer] = useState(qna.answer);

    return (
        <div className="memo-wrapper">
            <div className="question-box">
                <button type="button" onClick={(e) => {
                    if(IsEditing){
                        setIsEditing(false);
                        qna.question = Question;
                        qna.answer = Answer;
                        onHandleEditDone(index, qna);
                    } else {
                        setIsEditing(true);
                    } 
                }}>
                    {IsEditing ? 'done' : 'edit'}
                </button>
                <input value={Question} onChange={(e) => setQuestion(e.target.value)} readOnly={!IsEditing} />
            </div>
            <div className="answer-box">
                <textarea value={Answer} onChange={(e) => {setAnswer(e.target.value)}} readOnly={!IsEditing} spellCheck="false" >
                    {Answer}
                </textarea>
            </div>
        </div>
    );
};

export default Memo;