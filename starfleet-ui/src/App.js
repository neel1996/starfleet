import React, { useReducer } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { useSpring } from "react-spring";
import SearchResult from "./components/ResultPage/SearchResult";
import Search from "./components/SearchPage/Search";
import { SearchContext } from "./context";
import reducer from "./reducer";


function App(props) {
  const [state, dispatch] = useReducer(reducer, {});

  const spring = useSpring({
    from: {
      opacity: "0.0",
      transform: "translate3d(0,200px,0) scale(0.2)",
    },
    to: {
      opacity: "1.0",
      transform: "translate3d(0,0,0) scale(1.0)",
    },
  });

  return (
    <div className="App">
      <SearchContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Route
            path="/"
            exact
            render={() => {
              return <Search></Search>;
            }}
          ></Route>
          <Route
            path="/result"
            exact
            render={() => <SearchResult></SearchResult>}
          ></Route>
        </BrowserRouter>
      </SearchContext.Provider>
    </div>
  );
}

export default App;
