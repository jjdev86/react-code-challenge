import React, { useState, useEffect } from "react";
import "./App.css";
import BuildingZone from "./components/building.js";

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       data: [],
//       buildings: []
//     };
//   }
//   componentDidMount() {
//     // fetch data from API
//     fetch(
//       "https://applefacilities.review.blueriver.com/index.cfm/_api/json/v1/scv/building/?andOpenGrouping&locationCode%5B0%5D=sqo&or&locationCode%5B2%5D=nwr&or&locationCode%5B4%5D=scv&or&locationCode%5B6%5D=sfo&closeGrouping&fields=buildingname,buildingabbr,lat,lng,black,buildingZone&active=1&cachedwithin=600"
//     )
//       .then(response => {
//         response.json().then(resolved => {
//           this.setState({ data: resolved.data.items }, () =>
//             this.sortFetchedData()
//           );
//         });
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   sortFetchedData() {
//     // buildingZones object will act as a hash to track each buildingZone
//     var buildingZones = {};
//     var sortedData = [];
//     var data = [...this.state.data];

//     //
//     data.forEach((bld, index) => {
//       var buildzone = bld.buildingzone;
//       // buildingzone with empty string edge case
//       if (!buildzone.length < 1) {
//         // edge case for SFO zone
//         if (buildzone === "SFO") {
//           // add SFO to Other Bay Area zone
//           buildingZones["Other Bay Area"].buildings.push(bld);
//         } else {
//           if (Object.keys(buildingZones).includes(buildzone)) {
//             buildingZones[buildzone].buildings.push(bld);
//           } else {
//             // create a object with buildingname and buildings property
//             var bldZone = {};
//             bldZone.buildingname = buildzone;
//             // .buildings to hold all buildings in buildingZone
//             bldZone.buildings = [bld];
//             buildingZones[buildzone] = bldZone;
//           }
//         }
//       }
//     });
//     // add all buildingZones objects to our array sortedData to be sorted
//     for (var prop in buildingZones) {
//       sortedData.push(buildingZones[prop]);
//     }

//     // first sort by buildingzone
//     // "Other" will be at the bottom
//     sortedData
//       .sort((a, b) => {
//         var bldA = a.buildingname.toUpperCase(); // ignore upper and lowercase
//         var bldB = b.buildingname.toUpperCase(); // ignore upper and lowercase
//         if (bldA === bldB) return 0;
//         if (bldA.includes("OTHER")) return 1;
//         if (bldB.includes("OTHER")) return -1;

//         if (bldA < bldB) {
//           return -1;
//         }
//         if (bldA > bldB) {
//           return 1;
//         }
//       })
//       .forEach((item, index) => {
//         // sort each building alphabetically considering buildings with numbers
//         item.buildings.sort((a, b) => {
//           var bldA = a.buildingname.toUpperCase(); // ignore upper and lowercase
//           var bldB = b.buildingname.toUpperCase(); // ignore upper and lowercase
//           return bldA.localeCompare(bldB, undefined, {
//             numeric: true,
//             sensitivity: "base"
//           });
//         });
//       });

//     this.setState({ buildings: sortedData, data: null }, () =>
//       console.log(this.state)
//     );
//   }

//   render() {
//     return (
//       <div className="container">
//         <h1>Index</h1>
//         <hr></hr>
//         {this.state.buildings.map((building, index) => (
//           <React.Fragment key={index}>
//             <BuildingZone data={building} />
//             <hr></hr>
//           </React.Fragment>
//         ))}
//       </div>
//     );
//   }
// }

// refactor class to use React Hooks

const App = () => {
  // setup our hook
  const [rawData, setRaw] = useState([]);
  const [sortedData, setSortData] = useState([]);

  useEffect(() => {
    fetch(
      "https://applefacilities.review.blueriver.com/index.cfm/_api/json/v1/scv/building/?andOpenGrouping&locationCode%5B0%5D=sqo&or&locationCode%5B2%5D=nwr&or&locationCode%5B4%5D=scv&or&locationCode%5B6%5D=sfo&closeGrouping&fields=buildingname,buildingabbr,lat,lng,black,buildingZone&active=1&cachedwithin=600"
    )
      .then(res => res.json())
      .then(res => {
        const { items } = res.data;
        const data = sortData(items);
        setRaw(items);
        setSortData(data);
      })
      .catch(err => console.log(err));
  }, []);

  const sortData = data => {
    // creates an array of sorted objects with buildingzone properties
    // each property has a array of buildings by zone
    const buildingGroupsOrderedAsc = [
      ...data
        .reduce((acc, obj) => {
          let zone = obj.buildingzone;
          // edge case for SFO, needs to be added to Other Bay Area
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
    ].sort((a, b) => {
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


    // data.forEach((bld, index) => {
    //   var buildzone = bld.buildingzone;
    //   // buildingzone with empty string edge case
    //   if (!buildzone.length < 1) {
    //     // edge case for SFO zone
    //     if (buildzone === "SFO") {
    //       // add SFO to Other Bay Area zone
    //       buildingZones["Other Bay Area"].buildings.push(bld);
    //     } else {
    //       if (Object.keys(buildingZones).includes(buildzone)) {
    //         buildingZones[buildzone].buildings.push(bld);
    //       } else {
    //         // create a object with buildingname and buildings property
    //         var bldZone = {};
    //         bldZone.buildingname = buildzone;
    //         // .buildings to hold all buildings in buildingZone
    //         bldZone.buildings = [bld];
    //         buildingZones[buildzone] = bldZone;
    //       }
    //     }
    //   }
    // });
    // // add all buildingZones objects to our array sortedData to be sorted
    // for (var prop in buildingZones) {
    //   sortedData.push(buildingZones[prop]);
    // }

    // first sort by buildingzone
    // "Other" will be at the bottom
    // sortedData
    //   .sort((a, b) => {
    //     var bldA = a.buildingname.toUpperCase(); // ignore upper and lowercase
    //     var bldB = b.buildingname.toUpperCase(); // ignore upper and lowercase
    //     if (bldA === bldB) return 0;
    //     if (bldA.includes("OTHER")) return 1;
    //     if (bldB.includes("OTHER")) return -1;

    //     if (bldA < bldB) {
    //       return -1;
    //     }
    //     if (bldA > bldB) {
    //       return 1;
    //     }
    //   })
    //   .forEach((item, index) => {
    //     // sort each building alphabetically considering buildings with numbers
    //     item.buildings.sort((a, b) => {
    //       var bldA = a.buildingname.toUpperCase(); // ignore upper and lowercase
    //       var bldB = b.buildingname.toUpperCase(); // ignore upper and lowercase
    //       return bldA.localeCompare(bldB, undefined, {
    //         numeric: true,
    //         sensitivity: "base"
    //       });
    //     });
    //   });

    // this.setState({ buildings: sortedData, data: null }, () =>
    //   console.log(this.state)
    // );
    // return sortedData;
  };

  return (
    <div className="container">
      <div className="googleMap">
        <h1>Google Map goes here</h1>
      </div>
      <h1>Index</h1>
      <hr></hr>
      {sortedData.map((building, index) => (
        <React.Fragment key={index}>
          <BuildingZone data={building} />
          <hr></hr>
        </React.Fragment>
      ))}
    </div>
  );
};

export default App;
