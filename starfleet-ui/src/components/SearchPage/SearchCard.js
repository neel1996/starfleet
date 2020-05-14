import React, { useContext, useState } from "react";
import { animated, useTransition, useSpring } from "react-spring";
import { v4 as uuid } from "uuid";
import { SearchContext } from "../../context";
import { CHANGE_SHIPNAME } from "../../actionStore";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

export default function SearchCard(props) {
  const { name, model, image } = props.ship;
  const [animationToggle, setAnimationToggle] = useState(false);

  const { state, dispatch } = useContext(SearchContext);
  const history = useHistory();

  // const spring = useSpring({
  //   transform: animationToggle
  //     ? "translate3d(0,0,0) scale(1)"
  //     : "translate3d(-200px,0,0)",
  //   opacity: animationToggle ? "1.0" : "0.0",
  // });

  useEffect(() => {
    if (props) {
      setAnimationToggle(true);
    }

    return () => {
      setAnimationToggle(false);
    };
  }, [props]);

  let labelComponent = (lead, value) => {
    return (
      <div className="flex mx-auto text-left mx-2 my-2 p-4">
        <div className="text-lg font-sans font-bold border-b border-gray-400 border-dashed">
          {lead}
        </div>
        <div className="font-sans text-md text-left mx-4">{value}</div>
      </div>
    );
  };

  return (
    <>
      <div
        className="flex bg-gray-700 mx-auto my-4 rounded-md border-dotted p-6 w-full hover:shadow-lg hover:bg-blue-900 border-2 border-gray-800 cursor-pointer"
        onClick={() => {
          dispatch({ type: CHANGE_SHIPNAME, payload: name });
          history.push("/result");
        }}
      >
        <div
          style={{
            background: `url('${image}')`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
          className="w-1/5 rounded-md shadow-sm"
        ></div>
        <div className="block w-3/4 my-auto mx-auto justify-between text-gray-200">
          {labelComponent("Ship Name", name)}
          {labelComponent("Ship Model", model)}
        </div>
      </div>
    </>
  );
}
