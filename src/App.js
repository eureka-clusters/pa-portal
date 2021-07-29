import './App.scss';
import Header from './component/Header/Header';
import Footer from './component/Footer/Footer';
import Content from './component/Content/Content';
import { ProvideAuth } from "./context/UserContext.js";

function App() {
  return (
    <div className="App">
      <ProvideAuth>
          <Header name="Some Header" />  
          <Content/>
          <Footer />
      </ProvideAuth>
    </div>
  );
}

export default App;
