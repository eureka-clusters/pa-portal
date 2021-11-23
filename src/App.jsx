import './App.scss';

import Content from './component/content';
import {ProvideAuth} from "./context/user-context";
import React from "react";
import Header from "./component/header";
import Footer from "./component/footer";

class ErrorBoundary extends React.Component {
    state = {error: null, errorInfo: null};

    componentDidCatch(error, errorInfo) {
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
                    <Header/>
                    <Content/>
                    <Footer/>
                </ProvideAuth>
            </ErrorBoundary>
        </div>
    );
}

export default App;