import React from "react";
import { ZoomInIcon } from "../icons/ZoomInIcon";
import { default as FitIcon } from "../icons/FitIcon";
import { default as ZoomOutIcon } from "../icons/ZoomOutIcon";
import { default as SearchIcon } from "../icons/SearchIcon";

type NavigationPanelProps = {
  cy: cytoscape.Core;
  stageColors: Map<any, any>;
  backgroundColors: string[];
};

export const NavigationPanel = ({
  cy,
  backgroundColors,
  stageColors,
}: NavigationPanelProps) => {
  const zoomIn = () => {
    cy?.zoom({
      level: cy.zoom() + 0.1,
      renderedPosition: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
    });
  };

  const zoomOut = () => {
    cy?.zoom({
      level: cy.zoom() - 0.1,
      renderedPosition: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
    });
  };

  const fit = () => cy?.fit();
  return (
    <div className="navigation">
      <div id="streams">
        {Array.from(stageColors.keys()).map((stage, i) => (
          <div className="stage-item" key={backgroundColors[i]}>
            <div
              className="box"
              style={{ backgroundColor: backgroundColors[i] }}
            ></div>
            <span>{stage}</span>
          </div>
        ))}
      </div>
      <div className="nav-buttons">
        <div id="zoomIn" onClick={zoomIn}>
          <ZoomInIcon />
        </div>
        <div id="fit" onClick={fit}>
          <FitIcon />
        </div>
        <div id="zoomOut" onClick={zoomOut}>
          <ZoomOutIcon />
        </div>
        <div id="navigation-search">
          <input type="text" id="navigation-search-input" />
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};
