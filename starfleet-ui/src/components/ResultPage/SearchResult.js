import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SearchLogo } from "../SearchPage/Search";
import { SearchContext } from "../../context";

export default function SearchResult(props) {
  const apiURL = "http://localhost:8080/search";

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
          shipName: query.toLowerCase(),
        },
      })
        .then((res) => {
          const searchResults = res.data;

          if (searchResults && !searchResults.errors) {
            setShipDetails(searchResults);
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
          .filter((item) => item !== "image" && item !== "name")
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
                className="flex mx-auto justify-center my-10 text-center border-b border-dotted border-gray-700"
                key={entry}
              >
                <div className="w-full text-xl my-auto mx-auto rounded-md py-2 px-2 bg-yellow-500 px-10 align-middle items-center">
                  {label}
                </div>
                <div className="w-full p-1 text-white my-auto mx-auto rounded-md break-words px-10 text-left align-middle my-auto text-lg text-white">
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
      <div
        className="p-6 w-1/6 scale-50 mx-auto cursor-pointer"
        onClick={() => {
          history.push("/");
        }}
      >
        <SearchLogo></SearchLogo>
        <div
          className="font-sans text-white text-2xl mx-2"
          style={{ letterSpacing: "5px" }}
        >
          SEARCH RESULTS
        </div>
      </div>
      <div className="flex text-center justify-center mx-auto w-full">
        <div
          className="w-1/2 mx-10 my-20 rounded-lg border-dotted border-2 border-gray-200"
          style={{
            backgroundImage: `url('${shipDetails.image}')`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            width: "240px",
            height: "270px",
          }}
        ></div>
        <div className="my-20 w-1/3">
          <div className="p-6 border border-2 border-dotted border-gray-100 rounded-md shadow-md">
            <div className="text-left p-3 bg-yellow-500 rounded-lg w-full">
              NAME
            </div>
            <div className="text-left text-2xl mx-2 text-white font-sans">
              {shipDetails.name}
            </div>
          </div>
          <div className="w-full h-auto overflow-auto mx-auto justify-center my-3 p-3 border border-2 border-dotted border-gray-100 rounded-md">
            {shipDetailLayout()}
          </div>
        </div>
      </div>
    </>
  );
}
