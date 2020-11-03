import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './components/home/Home';
import CoEditor from './components/co-editor/CoEditor';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/co-editor" component={CoEditor} exact />
            </Switch>
        </BrowserRouter>
        
    );
}

export default App;
