import React, { useState, useEffect } from "react";
import "./App.css";
import BuildingZone from "./components/buildingZone.js";
import Googlemap from './components/googleMaps.js';
const App = () => {
  // const [rawData, setRaw] = useState([]);
  const [rawData, setRaw] = useState([]);
  const [sortedData, setSortData] = useState([]);

  const [mapOption, setMapOption] = useState({});
  const [links, setLinkns] = useState([]);

  // using with localhost
  useEffect(() => {
    getBuildings();
    // sortBuildingsInAscending(rawData);
  }, []);

  const getBuildings = () => {
    fetch(
      "https://applefacilities.review.blueriver.com/index.cfm/_api/json/v1/scv/building/?andOpenGrouping&locationCode%5B0%5D=sqo&or&locationCode%5B2%5D=nwr&or&locationCode%5B4%5D=scv&or&locationCode%5B6%5D=sfo&closeGrouping&fields=buildingname,buildingabbr,lat,lng,black,buildingZone&active=1&cachedwithin=600"
    )
      .then(res => res.json())
      .then(res => {
        const { items } = res.data;
        const data = sortBuildingsInAscending(items);
        setRaw(items);
        setSortData(data);
      })
      .catch(err => console.log(err));
  };
  // returns an array sorted buidingzones in asc
  const sortBuildingsInAscending = data => {
    // creates an array of sorted objects with buildingzone properties
    // each property has a array of buildings by zone
    const buildingGroupsOrderedAsc = [
      ...data
        .reduce((acc, obj) => {
          let zone = obj.buildingzone;
          // exclude buildings withtout a buildingzone
          if (zone.length < 1) return acc;
          // buildings with buildingzone SFO, add to "Other Bay Area"
          if (zone === "SFO") {
            zone = "Other Bay Area";
          }
          const bld =
            acc.get(zone) ||
            Object.assign(
              {},
              {
                [zone]: []
              }
            );

          bld[zone].push(obj);
          bld.buildingzone = zone;
          return acc.set(zone, bld);
        }, new Map())
        .values()
    ]
      // sort the objects properties in the array by asc
      .sort((a, b) => {
        const zoneA = a.buildingzone;
        const zoneB = b.buildingzone;
        if (zoneA === "Other Bay Area") return 1;
        if (zoneB === "Other Bay Area") return -1;
        if (zoneA < zoneB) {
          return -1;
        }
        if (zoneA > zoneB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
    // Sort each buildingzone array in 'asc' order
    buildingGroupsOrderedAsc.forEach(item => {
      const bldzone = item.buildingzone;
      // sort each building alphabetically considering buildings with numbers
      item[bldzone].sort((a, b) => {
        var bldA = a.buildingname.toUpperCase(); // ignore upper and lowercase
        var bldB = b.buildingname.toUpperCase(); // ignore upper and lowercase
        return bldA.localeCompare(bldB, undefined, {
          numeric: true,
          sensitivity: "base"
        });
      });
    });

    return buildingGroupsOrderedAsc;
  };

  const addMarkers = links => map => {
    links.forEach((link, index) => {
      const marker = new window.google.maps.Marker({
        map,
        position: link.coords,
        label: `${index + 1}`,
        title: link.title,
      })
      marker.addListener(`click`, () => {
        window.location.href = link.url
      })
    })
  }

  const mapProps = {
    options: mapOption,
    onMount: addMarkers, 
    onMountProps: links 
  };

  return (
    <div className="container">
      <div className="googleMap">
        <Googlemap {...mapProps}/>
        <button onClick={() => setLinkns([])}>Reset map</button>
      </div>
      <h1>Index</h1>
      <hr></hr>
      {sortedData.length > 0 &&
        sortedData.map((buildingzone, index) => (
          <React.Fragment key={index}>
            <BuildingZone data={buildingzone} setMap={setMapOption} setLinks={setLinkns} links={links}/>
            <hr></hr>
          </React.Fragment>
        ))}
    </div>
  );
};

export default App;
