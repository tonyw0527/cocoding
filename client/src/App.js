import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './components/home/Home';
import Dashboard from './components/dashboard/Dashboard';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/dashboard" component={Dashboard} exact />
            </Switch>
        </BrowserRouter>
        
    );
}

export default App;
