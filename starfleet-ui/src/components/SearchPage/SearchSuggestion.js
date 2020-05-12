import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { animated, useTrail, useSpring, useChain } from "react-spring";
import { SearchContext } from "../../context";
import { CHANGE_SHIPNAME } from "../../actionStore";
import { v4 as uuid } from "uuid";
import { useRef } from "react";
export default function SearchSuggestion(props) {
  const apiURL = "http://localhost:9001/search";

  const [shipDetails, setShipDetails] = useState([]);
  const { dispatch } = useContext(SearchContext);

  const springRef = useRef();
  const spring = useSpring(true, null, {
    ref: springRef,
    from: {
      transform: "rotate(10deg)",
    },
    to: {
      transform: "rotate(0deg)",
    },
  });

  const trailRef = useRef();
  const trail = useTrail(shipDetails.length, {
    ref: trailRef,
    from: {
      transform: "translate3d(-200px,0,0) scale(0)",
      opacity: "0.0",
    },
    to: {
      transform: "translate3d(0,0,0) scale(1)",
      opacity: "1.0",
    },
    leave: {
      transform: "translate3d(-200px,0,0) scale(0)",
      opacity: "0.0",
    },
    config: {
      duration: 500,
    },
  });

  useChain(shipDetails ? [springRef, trailRef] : [trailRef, springRef]);

  useEffect(() => {
    dispatch({ type: CHANGE_SHIPNAME, payload: "" });

    if (props.text.length > 1) {
      axios({
        url: apiURL,
        method: "POST",
        data: {
          query: `
                        query SearchQuery{
                            searchQuery(shipName: "${props.text}")
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

          if (
            searchResults &&
            searchResults.length > 0 &&
            !searchResults.errors
          ) {
            setShipDetails([...searchResults]);
            dispatch({ type: CHANGE_SHIPNAME, payload: searchResults[0].name });
          } else {
            setShipDetails([]);
          }
        })
        .catch((err) => {
          console.log(err);
          setShipDetails([]);
        });
    }
  }, [props, shipDetails]);

  function searchPreviewCard() {
    if (shipDetails && shipDetails.length > 0) {
      return (
        <>
          {trail.map((animation, index) => {
            let ship = shipDetails[index];
            if (ship) {
              let labelComponent = (lead, value) => {
                return (
                  <div className="flex mx-auto text-left mx-2 my-2 p-4">
                    <div className="text-lg font-sans font-bold border-b border-gray-400 border-dashed">
                      {lead}
                    </div>
                    <div className="font-sans text-md text-left mx-4">
                      {value}
                    </div>
                  </div>
                );
              };
              return (
                <animated.div
                  style={{ ...spring, ...animation }}
                  key={`${ship.name}-${uuid()}`}
                >
                  <NavLink
                    to={{
                      pathname: `/result`,
                      search: encodeURI(ship.name),
                      query: ship.name,
                    }}
                  >
                    <div className="flex bg-gray-700 mx-auto my-4 rounded-md border-dotted p-6 w-full hover:shadow-lg hover:bg-blue-900 border-2 border-gray-800">
                      <div
                        style={{
                          background: `url('${ship.image}')`,
                          backgroundSize: "100% 100%",
                          backgroundRepeat: "no-repeat",
                        }}
                        className="w-1/5 rounded-md shadow-sm"
                      ></div>
                      <div className="block w-3/4 my-auto mx-auto justify-between text-gray-200">
                        {labelComponent("Ship Name", ship.name)}
                        {labelComponent("Ship Model", ship.model)}
                      </div>
                    </div>
                  </NavLink>
                </animated.div>
              );
            }
          })}
        </>
      );
    } else {
      return (
        <div className="w-full mx-auto my-4 text-center block p-4 bg-yellow-200 text-yellow-800 rounded-md text-2xl">
          No Results Found
        </div>
      );
    }
  }

  return (
    <div className="w-full h-full mx-auto my-6">
      {props.text.length < 2 ? (
        <div className="bg-gray-200 text-center text-xl font-thin italic font-sans border-l border-r border-b border-gray-200 shadow-md rounded-md p-6">
          Enter one more character to initiate search
        </div>
      ) : null}
      {searchPreviewCard()}
    </div>
  );
}
