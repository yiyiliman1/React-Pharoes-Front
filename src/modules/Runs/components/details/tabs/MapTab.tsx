import React, { useEffect, useState, FC } from 'react';
import Button from '@mui/material/Button';
import './map/js/csv2geojson.js';
// @ts-ignore
import { mapInit } from './map/js/main.js';
import logoSrc from './map/img/logo.png';

type mapTab = {
  projectId: string | undefined;
  runId: string | undefined;
}

export const MapTab: FC<mapTab> = ({ projectId, runId }) => {
  const [url, setUrl] = useState(`https://cnd2uxplmc.execute-api.eu-central-1.amazonaws.com/prod/projects/${projectId}/runs/${runId}/result/map-electricity?date=`);
  const urlDATE = `https://cnd2uxplmc.execute-api.eu-central-1.amazonaws.com/prod/projects/${projectId}/runs/${runId}/result/dates-map`;

  useEffect(()=>{
    mapInit(url, urlDATE);
  }, [url]);

  const insertScript = (src: string) => {
    const newScript = document.createElement("script");
    newScript.src = src;
    document.body.appendChild(newScript);
  };

  const handleUrlChange = (type: string, projectId: string | undefined, runId: string | undefined) => {
    if (type === "Electricity") {
      setUrl(`https://cnd2uxplmc.execute-api.eu-central-1.amazonaws.com/prod/projects/${projectId}/runs/${runId}/result/map-electricity?date=`)
    }
    if (type === "Fuel") {
      setUrl(`https://cnd2uxplmc.execute-api.eu-central-1.amazonaws.com/prod/projects/${projectId}/runs/${runId}/result/map-gas?date=`)
    }
    if (type === "Water") {
      setUrl(`https://cnd2uxplmc.execute-api.eu-central-1.amazonaws.com/prod/projects/${projectId}/runs/${runId}/result/map-water?date=`)
    }
  };

  return (
    <div className='map'>
      <div className="dataControlButtons">
        <Button variant="contained"
                sx={{ background: `${url.includes("electricity") ? "#cecdcd" : "#ffffff"}`, color: "#000000", marginRight: "5px", marginBottom: "5px" }}
                onClick={() => handleUrlChange("Electricity", projectId, runId)}>
          Electricity
        </Button>
        <Button variant="contained"
                sx={{ background: `${url.includes("gas") ? "#cecdcd" : "#ffffff"}`, color: "#000000", marginRight: "5px", marginBottom: "5px" }}
                onClick={() => handleUrlChange("Fuel", projectId, runId)}>
          Fuel
        </Button>
        <Button variant="contained"
                sx={{ background: `${url.includes("water") ? "#cecdcd" : "#ffffff"}`, color: "#000000", marginRight: "5px", marginBottom: "5px" }}
                onClick={() => handleUrlChange("Water", projectId, runId)}>
          Water
        </Button>
      </div>
      <div id="map"></div>
      <pre id="info"></pre>
      <div className="searchtab" id="searchtab1">
        <select id="mySelect" className="selectpicker">
          {/*<option value="mapRaster2017">2017</option>*/}
        </select>
      </div>
      <a href='https://www.pharoes.com/' target="_blank"><img className="map__logo" src={logoSrc}/></a>

    </div>
  )
}
