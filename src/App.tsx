import React, {ErrorInfo} from "react";
import Content from 'component/content';
import {ProvideAuth} from "context/user-context";

import './App.scss';

interface State {
    error: Error | null,
    errorInfo: ErrorInfo | null
}

class ErrorBoundary extends React.Component<any, any> {

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
                    <h2>An error was thrown</h2>
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
                    <Content/>
                </ProvideAuth>
            </ErrorBoundary>
        </div>
    );
}

export default App;