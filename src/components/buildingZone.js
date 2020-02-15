import React from "react";

const BuildingZone = ({data}) => {

  
  const buildingClicked = (e) => {
    e.preventDefault();
    console.log('this was clicked');
  };

  const zone = data.buildingzone;
  const listOfBuildings = data[zone].map(building => (
    <Building key={building.buildingid} bld={building} buildingClicked={buildingClicked}/>
  ));

  return (
    <div className="a-building-container">
      <h3>{data.buildingzone}</h3>
      <div className="a-building-name">
        <ul key={data.buildingname} className="a-building">
          {listOfBuildings}
        </ul>
      </div>
    </div>
  );
};

const Building = ({ bld, buildingClicked }) => {
  if (bld.black === 0) {
    return (
      <li onClick={buildingClicked}>
        <a href="#">
          {bld.buildingname}
        </a>
      </li>
    );
  } else {
    return <li key={bld.buildingid}>{bld.buildingname}</li>;
  }
};

export default BuildingZone;