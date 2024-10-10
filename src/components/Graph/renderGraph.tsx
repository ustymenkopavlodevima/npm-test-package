import React from "react";
import ReactDOM from "react-dom/client";
import Graph, { Node } from "./Graph";

const renderGraph = (element: HTMLElement, nodes: Node[]) => {
  const root = ReactDOM.createRoot(element);
  root.render(<Graph nodes={nodes} />);
};

export default renderGraph;
