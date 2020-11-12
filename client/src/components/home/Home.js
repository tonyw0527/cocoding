import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const history = useHistory();

    const [UserName, setUserName] = useState('');
    const [Password, setPassword] = useState('');

    return (
        <div className="Home-wrapper">
            <div className="Home-title">
                <h1>Welcome to Cocoding!</h1>
            </div>
            <div className="Home-loginForm">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    alert(`${UserName}, ${Password}`);
                    history.push('/dashboard', {userName: UserName, password: Password});
                }}>
                    <label>UserName</label>
                        <input type="text" value={UserName} onChange={(e)=>{
                            setUserName(e.target.value);
                        }} />
                    
                    <label>Inviation code</label>
                        <input type="text" value={Password} onChange={(e)=>{
                            setPassword(e.target.value);
                        }} />
                    
                    <button type="submit" >
                        Go
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Home;

