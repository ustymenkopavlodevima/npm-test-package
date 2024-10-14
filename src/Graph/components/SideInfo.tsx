import React from "react";
import BinaryIcon from "../icons/BinaryIcon";
import BooleanIcon from "../icons/BooleanIcon";
import NotNullableIcon from "../icons/NotNullableIcon";
import NullableIcon from "../icons/NullableIcon";
import NumberIcon from "../icons/NumberIcon";
import PrimaryKeyIcon from "../icons/PrimaryKeyIcon";
import TextIcon from "../icons/TextIcon";
import TimeStampIcon from "../icons/TimeStampIcon";
import ArrowDownIcon from "../icons/ArrowDownIcon";

function generateTableField(field: { type: string; name: string }, node: any) {
  const { type, name } = field;
  const isNullable = !/NOT NULL/.test(type);
  const isPrimaryKey = node.data("primary_key").includes(name);
  const isTimestamp = name === node.data("timestamp");
  let fieldTypeIcon;
  switch (true) {
    case /\b(SMALLINT|INTEGER|BIGINT|DECIMAL|NUMERIC|REAL|DOUBLE|SMALLSERIAL|SERIAL|BIGSERIAL)\b/i.test(
      type
    ):
      fieldTypeIcon = <NumberIcon />;
      break;
    case /\b(CHARACTER|VARYING|VARCHAR|CHAR|BPCHAR|TEXT)\b/i.test(type):
      fieldTypeIcon = <TextIcon />;
      break;
    case /\b(BOOLEAN)\b/i.test(type):
      fieldTypeIcon = <BooleanIcon />;
      break;
    case isTimestamp:
      fieldTypeIcon = <TimeStampIcon />;
      break;
    case /\b(BYTEA)\b/i.test(type):
      fieldTypeIcon = <BinaryIcon />;
      break;
    default:
      fieldTypeIcon = <TextIcon />;
      break;
  }

  return (
    <li key={`${node.data("id")}${name}${type}`}>
      <div className="name">
        <div className="icon">{fieldTypeIcon}</div>
        <span style={{ fontWeight: isPrimaryKey ? "bold" : "normal" }}>
          {name}
        </span>
      </div>
      <div className="icons">
        <div>
          {isPrimaryKey ? (
            <PrimaryKeyIcon />
          ) : isTimestamp ? (
            <TimeStampIcon />
          ) : (
            <></>
          )}
        </div>
        <div>{isNullable ? <NullableIcon /> : <NotNullableIcon />}</div>
      </div>
    </li>
  );
}

type SideInfoProps = {
  event: cytoscape.EventObject;
  handleClose: () => void;
};

const SideInfo = ({ event, handleClose }: SideInfoProps) => {
  const [showPlan, setShowPlan] = React.useState<boolean>(false);
  const node = event.target;
  const type = node.data("type");

  const togglePlan = () => setShowPlan((prev) => !prev);

  return (
    <div id="sideinfo">
      <div className="sideinfo-name">
        <h2 id="table-name">{node.data("name")}</h2>
        <button id="close-info" onClick={handleClose}>
          X
        </button>
      </div>
      <div id="info-content">
        {["stream", "state", "relation"].includes(type) ? (
          <>
            <ul
              style={{ listStyle: "none", padding: "12px", margin: "auto" }}
              className="border-horizontal"
            >
              {node
                .data("schema")
                .map((field: { type: string; name: string }) =>
                  generateTableField(field, node)
                )}
            </ul>
            <div className="sideinfo-section" onClick={togglePlan}>
              <h3 id="plan-button">
                <ArrowDownIcon />
                <strong>Physical Plan</strong>
              </h3>
              {showPlan && (
                <div id="plan-content">
                  <p>
                    <strong>Type:</strong> ${node.data("type")}
                  </p>
                  <p>
                    <strong>Stage:</strong> ${node.data("stage")}
                  </p>
                  <p>
                    <strong>Id:</strong> ${node.data("id")}
                  </p>
                  <textarea
                    style={{ width: "100%" }}
                    rows={Math.max(7, node.data("plan").split("\n").length + 1)}
                    value={node.data("plan")}
                    readOnly
                  />
                </div>
              )}
            </div>
          </>
        ) : type === "query" ? (
          <div className="sideinfo-section">
            <p>
              <strong>Type:</strong> {node.data("type")}
            </p>
            <p>
              <strong>Id:</strong> {node.data("name")}
            </p>
            <p>
              <strong>Plan:</strong>
            </p>
            <textarea
              style={{ width: "100%" }}
              rows={node.data("plan").split("\n").length}
              value={node.data("plan")}
              readOnly
            />
          </div>
        ) : (
          <div className="sideinfo-section">
            <p>
              <strong>Name:</strong> {node.data("name")}
            </p>
            <p>
              <strong>Type:</strong> {node.data("type")}
            </p>
            <p>
              <strong>Id:</strong> {node.data("id")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideInfo;
