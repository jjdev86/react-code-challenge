import React from "react";

const BuildingZone = props => {
  const listOfBuildings = props.data.buildings.map(building => (
    <Building key={building.buildingid} bld={building} />
  ));

  return (
    <div className="a-building-container">
      <h3>{props.data.buildingname}</h3>
      <div className="a-building-name">
        <ul key={props.data.buildingname} className="a-building">
          {listOfBuildings}
        </ul>
      </div>
    </div>
  );
};

const Building = ({ bld }) => {
  if (bld.black === 0) {
    return (
      <li key={bld.buildingid}>
        <a href="https://applefacilities.review.blueriver.com">
          {bld.buildingname}
        </a>
      </li>
    );
  } else {
    return <li key={bld.buildingid}>{bld.buildingname}</li>;
  }
};

export default BuildingZone;
