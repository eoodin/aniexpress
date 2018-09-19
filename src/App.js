import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import store from './store';
import messenger from './services/messenger';
import {bindActionCreators} from 'redux';
import {connect, Provider} from 'react-redux';

class TheApp extends Component {
    componentDidMount() {
        messenger.startWatch();
    }

    componentWillUnmount() {
        messenger.stopWatch();
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {cluster: state.cluster, nes: state.nes}
};

const mapDispatchToProps = dispatch => bindActionCreators({
    // fetchMeasures: from => fetchMeasures(from),
}, dispatch);

const App = connect(mapStateToProps, mapDispatchToProps)(TheApp);

export default props => <Provider store={store}><App {... props} /></Provider>;
