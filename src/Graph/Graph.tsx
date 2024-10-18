import React from "react";
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

  React.useEffect(() => {
    const cyInstance = cytoscape({
      container: document.getElementById("cy"),
      layout: { name: "dagre" },
      elements: {
        nodes: cyNodes,
        edges: cyEdges,
      },
      style: [
        {
          selector: "node",
          style: {
            "font-weight": "bold",
            label: "data(name)",
            "text-valign": "center",
            "text-halign": "center",
            width: (node: cytoscape.NodeSingular) => {
              return node.data("name").length * 10;
            },
            "padding-top": "10px",
            "padding-bottom": "10px",
            "padding-left": "15px",
            "padding-right": "10px",
            "background-color": function (node: cytoscape.NodeSingular) {
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
        {
          selector: "node.semitransp",
          //@ts-expect-error works
          style: { opacity: "0.5" },
        },
      ],
    });
    cyInstance.on("tap", "node", (event: cytoscape.EventObject) => {
      setSelectedNode(event);
    });
    setCy(cyInstance);
  }, [cyEdges, cyNodes]);

  nodes.forEach((node) => {
    if (!stageColors.has(node.stage)) {
      stageColors.set(node.stage, backgroundColors[uniqueId++]);
    }
  });

  const handleClose = React.useCallback(() => setSelectedNode(undefined), []);

  const handleSearch = React.useCallback(
    (searchQuery: string) => {
      cy?.nodes().forEach((node) => {
        const label = node.data("name").toLowerCase();
        if (label.includes(searchQuery.toLowerCase())) {
          node.removeClass("semitransp");
        } else node.addClass("semitransp");
      });
    },
    [cy]
  );

  return (
    <>
      <div id="cy" />
      {cy && (
        <NavigationPanel
          cy={cy}
          stageColors={stageColors}
          backgroundColors={backgroundColors}
          handleSearch={handleSearch}
        />
      )}
      {selectedNode && (
        <SideInfo event={selectedNode} handleClose={handleClose} />
      )}
    </>
  );
}

export default Graph;
