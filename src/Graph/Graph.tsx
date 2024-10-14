import React from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import "./index.scss";
import SideInfo from "./components/SideInfo";
import { NavigationPanel } from "./components/NavigationPanel";

cytoscape.use(dagre);

export type Node = {
  id: string;
  name: string;
  type: string;
  stage: string;
  inputs: string[];
  plan?: string;
  primary_key?: string[];
  timestamp?: string;
  schema?: {
    name: string;
    type: string;
  }[];
  post_processors?: {
    name: string;
    description: string;
  }[];
};

let backgroundColors = [
  "hsl(214, 30.7%, 74.6%)",
  "hsl(30, 74.8%, 79%)",
  "hsl(2, 55.8%, 79.6%)",
  "hsl(175, 25.1%, 80.9%)",
  "hsl(105, 28.7%, 74.2%)",
  "hsl(47, 73.8%, 82.05%)",
  "hsl(312, 20.2%, 78.65%)",
  "hsl(355, 73.8%, 89.5%)",
  "hsl(23, 21%, 74.3%)",
  "hsl(20, 7.8%, 84.9%)",
];

let stageColors = new Map();
let uniqueId = 0;

type GraphProps = {
  nodes: Node[];
};

function Graph({ nodes }: GraphProps): React.ReactElement {
  const [cy, setCy] = React.useState<cytoscape.Core>();
  const [selectedNode, setSelectedNode] =
    React.useState<cytoscape.EventObject>();

  React.useEffect(() => {
    if (!cy) return;
    cy.on("tap", "node", (event: cytoscape.EventObject) => {
      setSelectedNode(event);
    });
  }, [cy]);

  const cyNodes = React.useMemo(
    () =>
      nodes.map(function (node) {
        return { data: node };
      }),
    [nodes]
  );

  const cyEdges = React.useMemo(
    () =>
      nodes.flatMap((node) =>
        node.inputs.map((input) => ({
          data: { source: input, target: node.id },
        }))
      ),
    []
  );

  nodes.forEach((node) => {
    if (!stageColors.has(node.stage)) {
      stageColors.set(node.stage, backgroundColors[uniqueId++]);
    }
  });

  const handleClose = React.useCallback(() => setSelectedNode(undefined), []);

  return (
    <>
      <CytoscapeComponent
        className="cy"
        cy={(cy) => {
          setCy(cy);
        }}
        layout={{ name: "dagre" }}
        style={{
          height: "100%",
        }}
        elements={CytoscapeComponent.normalizeElements({
          nodes: cyNodes,
          edges: cyEdges,
        })}
        stylesheet={[
          {
            selector: "node",
            style: {
              "font-weight": "bold",
              label: "data(name)",
              "text-valign": "center",
              "text-halign": "center",
              width: "label",
              "padding-top": "10px",
              "padding-bottom": "10px",
              "padding-left": "10px",
              "padding-right": "10px",
              height: "label",
              "background-color": function (node) {
                return stageColors.get(node.data("stage"));
              },
            },
          },
          {
            selector: "edge",
            style: {
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
            },
          },
          {
            selector: 'node[type="stream"]',
            style: {
              shape: "roundrectangle",
            },
          },
          {
            selector: 'node[type="state"]',
            style: {
              shape: "rectangle",
            },
          },
          {
            selector: 'node[type="relation"]',
            style: {
              shape: "cut-rectangle",
            },
          },
          {
            selector: 'node[type="import"], node[type="export"]',
            style: {
              "font-weight": "normal",
              shape: "ellipse",
            },
          },
          {
            selector: 'node[type="query"]',
            style: {
              "font-weight": "normal",
              shape: "tag",
            },
          },
        ]}
      />
      {cy && (
        <NavigationPanel
          cy={cy}
          stageColors={stageColors}
          backgroundColors={backgroundColors}
        />
      )}
      {selectedNode && (
        <SideInfo event={selectedNode} handleClose={handleClose} />
      )}
    </>
  );
}

export default Graph;
