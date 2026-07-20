import React, {Component} from "react";

import Home from "./components/home.jsx";
import About from "./components/about.jsx";
import Values from "./components/values.jsx";
import Client from "./components/client.jsx";
import Footer from "./components/footer.jsx";

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <AboutSection /> */}
        {/* <Clients /> */}
        <Home />
        <About />
        <Values />
        <Client />
        <Footer />
      </div>
    );
  }
}

export default App;

