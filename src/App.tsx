import React, {ErrorInfo} from "react";

import Header from './component/Header';
import Footer from './component/Footer';

import Content from './component/Content';
import {ProvideAuth} from "./context/UserContext.js";

import './App.scss';

interface State {
    error: Error | null,
    errorInfo: ErrorInfo | null
}

class ErrorBoundary extends React.Component {

    state: Readonly<State> = {error: null, errorInfo: null};

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.errorInfo) {
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{whiteSpace: "pre-wrap"}}>
                        {this.state.error && this.state.error.toString()}
                        <br/>
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        return this.props.children;
    }
}


function App() {
    return (
        <div className="App">
            <ErrorBoundary>
                <ProvideAuth>
                    <Header name="Some Header"/>
                    <Content/>
                    <Footer/>
                </ProvideAuth>
            </ErrorBoundary>
        </div>
    );
}

export default App;