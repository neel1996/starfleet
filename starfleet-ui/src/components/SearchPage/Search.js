import React, { useContext, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { SearchContext } from "../../context";
import "./Search.css";
import SearchSuggestion from "./SearchSuggestion";
import { CHANGE_SHIPNAME } from "../../actionStore";

export default function Search(props) {
  const [query, setQuery] = useState("");

  const { state, dispatch } = useContext(SearchContext);

  const memoizedSearchSuggestion = useMemo(() => {
    return <SearchSuggestion text={query}></SearchSuggestion>;
  }, [query]);
  
  return (
    <>
      <div className="flex w-full h-screen">
        <div className="block xl:w-1/2 md:w-3/4 sm:w-11/12 w-11/12 mx-auto my-auto">
          <div className="text-center  mx-auto my-auto">
            <div className="search-header text-6xl space-x-1 tracking-widest border-b-2 border-grey-200 border-dotted">
              <span className="text-gray-300">Star</span>
              <span className="text-yellow-500">fleet</span>
            </div>
            <div className="flex mx-auto my-auto w-full mt-10 rounded-md shadow-md font-sans text-xl border border-gray-300">
              <input
                type="text"
                className="w-full rounded-l-md text-center p-4 outline-none"
                placeholder="What are you looking for?"
                onKeyUp={(event) => {
                  setQuery(event.target.value);
                }}
              ></input>
              <NavLink
                to={
                  state.shipName ? `/result?${encodeURI(state.shipName)}` : "/"
                }
                className="w-1/6 bg-yellow-400 text-center p-4 hover:bg-yellow-500 cursor-pointer rounded-r-md font-sans font-semibold"
              >
                Search
              </NavLink>
            </div>
            <>{query ? memoizedSearchSuggestion : null}</>
          </div>
        </div>
      </div>
    </>
  );
}
