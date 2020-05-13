import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SearchContext } from "../../context";

export default function SearchResult(props) {
  const apiURL = "http://localhost:9001/search";

  const { state, dispatch } = useContext(SearchContext);

  const query = state.shipName;

  const [shipDetails, setShipDetails] = useState({});
  const history = useHistory();

  useEffect(() => {
    if (query) {
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
                                manufacturer
                                cost_in_credits
                                length
                                max_atmosphering_speed
                                crew
                                passengers
                                cargo_capacity
                                consumables
                                hyperdrive_rating
                                MGLT
                                starship_class
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
            setShipDetails(...searchResults);
          }
        })
        .catch((err) => {
          console.assert(err);
        });
    } else {
      history.push("/");
    }
  }, []);

  function shipDetailLayout() {
    const shipKeys = Object.keys(shipDetails);

    return (
      <>
        {shipKeys
          .filter((item) => item !== "image")
          .map((entry) => {
            let label = entry;

            if (entry.includes("_")) {
              const splitKey = entry.split("_");
              label = splitKey.map((key) => {
                return (
                  key[0].toUpperCase() + key.substring(1, key.length) + " "
                );
              });
            } else {
              label = label[0].toUpperCase() + label.substring(1, label.length);
            }

            return (
              <div
                className="flex mx-auto my-8 w-full text-left justify-around"
                key={entry}
              >
                <div className="p-1 w-1/3 text-yellow-200 px-10 align-middle items-center">
                  {label}
                </div>
                <div className="p-1 w-1/3 bg-white text-gray-600 rounded-md break-words px-10 text-center align-middle my-auto text-lg">
                  {shipDetails[entry]}
                </div>
              </div>
            );
          })}
      </>
    );
  }

  return (
    <>
      <div className="w-3/4 mx-auto my-6 border border-gray-600 rounded-md">
        <div className="search-header bg-yellow-500 text-gray-700 p-2 rounded-t-md text-4xl text-center">
          {shipDetails.name}
        </div>
        <div className="flex">
          <div
            className="mx-10 my-20 rounded"
            style={{
              backgroundImage: `url('${shipDetails.image}')`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              width: "180px",
              height: "220px",
            }}
          ></div>

          <div className="block w-3/4">
            {shipDetails ? shipDetailLayout() : null}
          </div>
        </div>
      </div>
    </>
  );
}
