import React from "react";

const BuildingZone = ({data, setMap, setLinks, links}) => {

  
  const buildingClicked = (e) => {
    e.preventDefault();
    const lat = Number(e.target.parentNode.dataset.lat);
    const lng = Number(e.target.parentNode.dataset.lng);

    const position = {};
    position.options = {
      center: { lat: lat, lng: lng},
      zoom: 10,
    };
    const link = {
      coords: { lat: lat, lng: lng }, // required: latitude & longitude
      // at which to display the marker
      title: `Life, the Universe and Area 51`, // optional
      url: `https://wikipedia.org/wiki/Area_51`, // optional
    }
    const newLink = [...links];
    newLink.push(link);
    // changes the location of the map based on coordinates
    setMap(position);
    setLinks(newLink)
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
      <li onClick={buildingClicked} data-lat={bld.
        lat} data-lng={bld.lng}>
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
