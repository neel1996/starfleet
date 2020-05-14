import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { animated, useSpring, useSprings } from "react-spring";
import { v4 as uuid } from "uuid";
import { CHANGE_SHIPNAME } from "../../actionStore";
import { SearchContext } from "../../context";
import "./Search.css";
import SearchCard from "./SearchCard";

export default function Search(props) {
  const [noResultIndicator, setNoResultIndicator] = useState(false);
  const { state, dispatch } = useContext(SearchContext);
  const [shipDetails, setShipDetails] = useState([]);
  const history = useHistory();

  const searchRef = useRef();

  const spring = useSpring({
    from: {
      transform: shipDetails[0] ? "scale(1.0)" : "scale(0.3)",
    },
    to: {
      transform: shipDetails[0] ? "scale(0.8)" : "scale(1.0)",
    },
  });

  const springs = useSprings(
    shipDetails.length,
    shipDetails.map((item) => ({
      from: {
        transform: shipDetails[0]
          ? "translate3d(-150px,0,0) scale(0.5)"
          : "translate3d(0,0,0) scale(1.0)",
      },
      to: {
        transform: shipDetails[0]
          ? "translate3d(0px,0,0) scale(1.0)"
          : "translate3d(150px,0,0) scale(0.5)",
      },
    }))
  );

  useEffect(() => {
    return () => {
      setShipDetails([]);
    };
  }, []);

  function searchHandler(query) {
    const apiURL = "http://localhost:9001/search";

    axios({
      url: apiURL,
      method: "POST",
      data: {
        query: `
          query SearchQuery{
              searchQuery(shipName: "${query}")
              {
                  name
                  model
                  image
              }
          }
      `,
      },
    })
      .then((res) => {
        const searchResults = res.data.data.searchQuery;
        setNoResultIndicator(false);

        if (
          searchResults &&
          searchResults.length > 0 &&
          !searchResults.errors
        ) {
          setShipDetails([...searchResults]);
          dispatch({ type: CHANGE_SHIPNAME, payload: searchResults[0].name });
        } else {
          setShipDetails([]);
          setNoResultIndicator(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setNoResultIndicator(true);
        setShipDetails([]);
      });
  }

  return (
    <>
      <div className="flex w-full h-screen">
        <div className="block xl:w-1/2 md:w-3/4 sm:w-11/12 w-11/12 mx-auto my-auto">
          <div className="text-center mx-auto my-auto">
            <animated.div style={spring}>
              <div className="search-header text-6xl space-x-1 tracking-widest border-b-2 border-grey-200 border-dotted">
                <span className="text-gray-300">Star</span>
                <span className="text-yellow-500">fleet</span>
              </div>
              <div className="flex mx-auto my-auto w-full mt-10 rounded-md shadow-md font-sans text-xl border border-gray-300">
                <input
                  type="text"
                  className="w-full rounded-l-md text-center p-4 outline-none"
                  placeholder="What are you looking for?"
                  ref={searchRef}
                  onChange={(event) => {
                    searchHandler(event.target.value);
                  }}
                ></input>
                <div
                  className="w-1/6 bg-yellow-400 text-center p-4 hover:bg-yellow-500 cursor-pointer rounded-r-md font-sans font-semibold"
                  onClick={() => {
                    history.push("/result");
                  }}
                >
                  Search
                </div>
              </div>
            </animated.div>
            <>
              {shipDetails.length > 0 ? (
                <>
                  {springs.map((animation, index) => {
                    return (
                      <animated.div
                        style={{ ...animation }}
                        key={`${shipDetails[index].name}-${uuid()}`}
                      >
                        {<SearchCard ship={shipDetails[index]}></SearchCard>}
                      </animated.div>
                    );
                  })}
                </>
              ) : null}
            </>
            {noResultIndicator && searchRef.current.value ? (
              <div className="w-full mx-auto my-4 text-center block p-4 bg-yellow-200 text-yellow-800 rounded-md text-2xl">
                No Results Found
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
