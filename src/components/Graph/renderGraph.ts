import { createRoot } from "react-dom/client";
import Graph from "./Graph";

const renderGraph = (element: HTMLElement) => {
  const root = createRoot(element);
  root.render(Graph());
};

// (<any>window).renderGraph = renderGraph;

export default renderGraph;
