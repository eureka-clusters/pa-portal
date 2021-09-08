import './App.scss';
import Header from './component/Header/Header';
import Footer from './component/Footer/Footer';
import Content from './component/Content/Content';
import { ProvideAuth } from "./context/UserContext.js";
import React from "react";


class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null };

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
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
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
          <Header name="Some Header" />  
          <Content/>
          <Footer />
      </ProvideAuth>
      </ErrorBoundary>
    </div>
  );
}

export default App;