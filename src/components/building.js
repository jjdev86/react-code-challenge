import React, { useState }from "react";

const BuildingDisplay = (props) => {
    const [building, setBuilding] = useState({});

    
    return (
        <div>
            <h3>{building.buildingname}</h3>
        </div>
    )
};