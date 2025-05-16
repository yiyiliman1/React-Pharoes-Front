import Cookies from 'js-cookie';
import {COOKIES} from '../../../../../../../common/config/cookies';

export const mapInit = (url, urlDATE) => {
  mapboxgl.accessToken = "pk.eyJ1IjoicGFibG9hdHBoYXJvZXMiLCJhIjoiY2w2NmJ1MHF0MTYybjNrcDRwN3N6czRyMiJ9.fc3njkJJrn1_iOx3sqG6fQ";
  var map = new mapboxgl.Map({
    attributionControl: false,
    container: "map",
    //dark
    //style: "mapbox://styles/pabloatpharoes/cl6ns5yyx000516s5i4zujez2",
    //light
    //style: "mapbox://styles/pabloatpharoes/cl6ns86wz002b15mg26yqin3i",
    //hillshade
    style: "mapbox://styles/mapbox/cjaudgl840gn32rnrepcb9b9g", // the outdoors-v10 style but without Hillshade
    //3D TERRAIN
    //style: "mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y",
    center: [-81.85, 33.69],
    zoom: 7,
    maxZoom: 21,
    bearing: 0,
    pitch: 0,
    interactive: true,
  });
  const isElectricity = url.includes("electricity");
  const isFuel = url.includes("gas");
  const isWater = url.includes("water");
  var view1 = {
    bearing: 0,
    pitch: 0,
    speed: 0.05,
    curve: 1.3,
    zoom: 11,
  };
  var view2 = {
    bearing: -180,
    pitch: 80,
    speed: 0.02,
    curve: 0.4,
    zoom: 11.5,
  };

  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true,
    //anchor: "top",
    offset: [200, 0],
  });

  var popup0 = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true,
    //anchor: "top",
    offset: [0, 0],
  });

  var popupLine = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true,
    //anchor: "top",
    offset: [0, 0],
  });

  var nav = new mapboxgl.NavigationControl({
    showCompass: true,
    showZoom: true,
  });

  map.addControl(nav, "top-right");

  map.addControl(
    new mapboxgl.AttributionControl({
      // customAttribution: '© <a href="https://www.deepmoire.com/" target="_blank";">DeepMoiré</a>',
      customAttribution: '',
    })
  );

  function getAllIndexes(arr, val) {
    var indexes = [],
      i;
    for (i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);

    return indexes;
  }

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  function strip(number) {
    var string = number.toPrecision(16);
    return parseFloat(string);
  }

  map.on("load", function () {
    // //HILLSHADE
    // map.addSource("dem", {
    //   type: "raster-dem",
    //   url: "mapbox://mapbox.mapbox-terrain-dem-v1",
    // });
    map.addLayer(
      {
        id: "hillshading",
        source: "dem",
        type: "hillshade",
        // insert below waterway-river-canal-shadow;
        // where hillshading sits in the Mapbox Outdoors style
      },
      "waterway-river-canal-shadow"
    );

    //3D TERRAIN
    map.addSource("mapbox-dem", {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14,
    });
    // add the DEM source as a terrain layer with exaggerated height
    map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

    // add a sky layer that will show when the map is highly pitched
    map.addLayer({
      id: "sky",
      type: "sky",
      paint: {
        "sky-type": "atmosphere",
        "sky-atmosphere-sun": [0.0, 0.0],
        "sky-atmosphere-sun-intensity": 15,
      },
    });

    map.on("mousemove", (e) => {
      document.getElementById("info").innerHTML = JSON.stringify(e.lngLat.wrap());
    });

    d3.json(urlDATE).header("Authorization", `Bearer ${Cookies.get(COOKIES.Token)}`).get((err, dataDate) => {
      var dataR = [];
      var dataD = JSON.parse(dataDate);

      dataD.forEach(function (item, i) {
        dataR.push(item.replace("+", "%2B"));
      });

      dataR.forEach(function (item, index) {
        var newElement = document.createElement("option");
        newElement.textContent = item.replace("%2B", " ").replace("%", "");
        const dateArray = [newElement.textContent.split(" ")[0], newElement.textContent.split(" ")[1]]
        newElement.textContent = dateArray.join(" ");
        newElement.value = item;
        document.getElementById("mySelect").appendChild(newElement);
      });

      var dataTgen = [];
      var dataTgenLines = [];
      var dataTgenLinesDash = [];
      var dataTgenRound = [];

      function loadDataset(dataSel) {
        try {
          map.removeLayer("arrows");
          map.removeLayer("nodes");
          map.removeLayer("nodes-visible");
          map.removeLayer("nodes-moved");
          map.removeLayer("nodes-Round");
          map.removeLayer("cluster-count");
          map.removeSource("dataNodesMoved");
          map.removeSource("dataNodesRound");
          map.removeSource("dataNodes");
          map.removeLayer("lines");
          map.removeSource("dataLines");
          map.removeLayer("linesDash");
          map.removeSource("dataLinesDash");
          map.removeImage("arrow");
          //document.getElementById("loader").style.visibility = "visible";
        } catch (err) {
          //        alert("Error!");
        }

        var urlCall = url + dataSel;
        d3.json(urlCall).header("Authorization", `Bearer ${Cookies.get(COOKIES.Token)}`).get((err, dataIN) => {
          var data = JSON.parse(dataIN);
          console.log("dataa-water", data);
          if (err) return console.log(err);
          var dataNodes = isElectricity ? data.nodes : isFuel ? data.fuels : data.reservoirs;
          var dataLines = isElectricity ? data.lines : isFuel ? data.pipes : data.waterways;
          var dataCenter = data.center;
          map.flyTo({
            center: dataCenter,
          });

          var dataTry = [];
          var dataTryMoved = [];
          var dataTryRound = [];

          var pointsEx = dataNodes.features.map(function (d) {
            return d.geometry.coordinates;
          });
          var propEx = dataNodes.features.map(function (d) {
            return d.properties;
          });

          pointsEx.forEach(function (item, index) {
            //var options = { steps: 6, units: "kilometers", properties: propEx[index] };
            var point = turf.point(item, propEx[index]);

            var ranNum = Math.random() * 0.0003 * (Math.round(Math.random()) ? 1 : -1);
            var ranNum2 = Math.random() * 0.0003 * (Math.round(Math.random()) ? 1 : -1);
            var itemMoved = [item[0] + ranNum, item[1] + ranNum2];
            var pointMoved = turf.point(itemMoved, propEx[index]);
            var itemRound = [item[0].toFixed(3), item[1].toFixed(3)];
            var pointRound = turf.point(itemRound, propEx[index]);
            dataTry.push(point);
            dataTryMoved.push(pointMoved);
            dataTryRound.push(pointRound);
          });

          //         o	Purple for DC lines
          // o	Blue for voltages above 450 kV
          // o	Red for voltages between 350 and 450 kV
          // o	Orange for voltages between 350 and 250 kV
          // o	Green for voltages between 150 and 250 kV
          // o	Black for voltages below 150 kV
          // o	Dashed line for lines with ThermalRating equal to zero
          //Light grey for 0-50kV, medium grey for 50-100kV and dark grey (not black) for 100-150kV
          let dataLinesDash;
          dataLinesDash = { type: "FeatureCollection" };
          dataLinesDash.features = dataLines.features.filter(function (d) {
            if (isElectricity) {
              return d.properties.thermalRating == 0;
            } else if(isFuel) {
              return d.properties["Capacity [MW]"] == 0;
            } else {
              return d.properties["Total flows [m3/s]"] == 99999999999999;
            }
          });

          dataLines.features = dataLines.features.filter(function (d) {
            if (isElectricity) {
              return d.properties.thermalRating != 0;
            } else if(isFuel) {
              return d.properties["Capacity [MW]"];
            } else {
              return d.properties["Total flows [m3/s]"];
            }

          });

          dataTgenLines = dataLines;
          dataTgenLinesDash = dataLinesDash;

          var max = d3.max(dataLines.features, function (d) {
            if (isElectricity) {
              return d.properties["thermalRating"];
            } else if (isFuel) {
              return d.properties["Capacity [MW]"];
            } else {
              return d.properties["Total flows [m3/s]"]
            }
          }) + 0.01;

          var min = d3.min(dataLines.features, function (d) {
            if (isElectricity) {
              return d.properties["thermalRating"];
            } else if (isFuel) {
              return d.properties["Capacity [MW]"];
            } else {
              return d.properties["Total flows [m3/s]"]
            }
          });
          console.log(min + " + " + max);

          var AllFeatures = turf.featureCollection(dataTry);
          var AllFeaturesMoved = turf.featureCollection(dataTryMoved);
          var AllFeaturesRound = turf.featureCollection(dataTryRound);
          dataTgen = AllFeatures;
          dataTgenRound = AllFeaturesRound;
          console.log(AllFeatures);

          var colorFunction = [
            "match",
            ["get", "type"],
            "DC Line",
            "#EA10D8",
            /* other */["step", ["get", "toVoltage"], "#d9d9d9", 50, "#8c8c8c", 100, "#444445", 150, "#0B6B0B", 250, "#D58618", 350, "#EE1111", 450, "#20477E"],
          ];

          map.addSource("dataLines", {
            type: "geojson",
            data: dataLines,
          });

          map.addLayer(
            {
              id: "lines",
              type: "line",
              source: "dataLines",

              layout: {
                "line-cap": "square",
                //"line-join": "bevel",
              },
              paint: {
                "line-width": ["interpolate", ["linear"], ["get", `${isElectricity ? "thermalRating" : isFuel ? "Flow/Capacity [MW]" : "Total flows [m3/s]" }`],  min, 1, max, 10],
                "line-color": colorFunction,
              },
            }
            //"settlement-subdivision-label"
          );

          // CREATE ICONS LAYER
          var iconPath = [
            { id: "arrow", url: "arrow-white" },
            { id: "doubleArrow", url: "double-arrow" },
            { id: "doubleArrowBlack", url: "double-arrow-black" },
            { id: "doubleArrowWhite", url: "double-arrow-white" },
            ];
          const imagesUrl = "http://localhost:3000/src/modules/Runs/components/details//tabs/map/img/";

          Promise.all(
            iconPath.map(
              (value) =>
                new Promise((resolve, reject) => {
                  map.loadImage(imagesUrl + value.url + ".png", function (error, image) {
                    map.addImage(value.id, image);
                    resolve();
                  });
                })
            )
          ).then(
            map.addLayer({
              id: "arrows",
              type: "symbol",
              source: "dataLines",
              //minzoom: 14,

              layout: {
                "symbol-placement": "line",
                //"symbol-spacing": 10,
                "icon-rotate": ["case", ["<", ["get", `${isElectricity ? "activeFlow" : isFuel ? "Fuel Flow [MW]" : "Total flows [m3/s]"}`], 0], -90, 90],
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
                "icon-image": ["step", ["get", `${isElectricity ? "flowByRating" : isFuel ? "Flow/Capacity [MW]" : ""}`], "arrow", 0.05, "doubleArrowWhite", 0.7, "doubleArrow", 0.9, "doubleArrowBlack"],
                "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.1, 14, 0.5],
              },
            })
          );

          map.addSource("dataLinesDash", {
            type: "geojson",
            data: dataLinesDash,
          });

          map.addLayer(
            {
              id: "linesDash",
              type: "line",
              source: "dataLinesDash",

              layout: {
                "line-cap": "butt",
                //"line-join": "bevel",
              },
              paint: {
                "line-width": ["interpolate", ["linear"], ["zoom"], 7, 1, 12, 10],

                //"line-width": 30,
                "line-dasharray": [0.2, 0.7],
                "line-color": colorFunction,
              },
            }
            //"settlement-subdivision-label"
          );

          map.addSource("dataNodesMoved", {
            type: "geojson",
            data: AllFeaturesMoved,
            cluster: true,
            clusterMaxZoom: 13, // Max zoom to cluster points on
            clusterRadius: 10, // Radius of each cluster when clustering points (defaults to 50)
          });

          map.addLayer(
            {
              id: "nodes-moved",
              type: "circle",
              source: "dataNodesMoved",

              layout: {
                visibility: "none",
              },
              paint: {
                "circle-radius": 6,
                "circle-opacity": ["interpolate", ["linear"], ["zoom"], 12, 0, 15, 1],
                "circle-color": "#000",
              },
            }
            //"settlement-subdivision-label"
          );

          map.addSource("dataNodes", {
            type: "geojson",
            data: AllFeatures,
          });

          map.addLayer(
            {
              id: "nodes-visible",
              type: "circle",
              source: "dataNodes",

              layout: {
                visibility: "visible",
              },
              paint: {
                "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 2, 20, 10],
                "circle-opacity": ["interpolate", ["linear"], ["zoom"], 12, 0, 15, 1],
                "circle-color": "#000",
              },
            }
            //"settlement-subdivision-label"
          );

          // map.addLayer({
          //   id: "clusters",
          //   type: "circle",
          //   source: "dataNodesMoved",
          //   filter: ["has", "point_count"],
          //   paint: {
          //     // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          //     // with three steps to implement three types of circles:
          //     //   * Blue, 20px circles when point count is less than 100
          //     //   * Yellow, 30px circles when point count is between 100 and 750
          //     //   * Pink, 40px circles when point count is greater than or equal to 750
          //     "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
          //     "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
          //   },
          // });

          map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "dataNodesMoved",
            filter: ["has", "point_count"],
            paint: {
              "text-color": "#000",
            },
            layout: {
              visibility: "none",
              "text-variable-anchor": ["top", "bottom", "left", "right"],
              "text-radial-offset": 0.5,
              "text-justify": "auto",
              "text-field": "{point_count_abbreviated}",
              //"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": ["interpolate", ["linear"], ["zoom"], 4, 5, 20, 28],
            },
          });

          map.addLayer(
            {
              id: "nodes",
              type: "circle",
              source: "dataNodes",

              layout: {
                visibility: "visible",
              },
              paint: {
                "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 4, 20, 30],
                "circle-opacity": 0.0001,
                "circle-color": "#fff",
              },
            }
            //"settlement-subdivision-label"
          );

          map.addSource("dataNodesRound", {
            type: "geojson",
            data: AllFeaturesRound,
          });

          map.addLayer(
            {
              id: "nodes-Round",
              type: "circle",
              source: "dataNodes",

              layout: {
                visibility: "visible",
              },
              paint: {
                "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 2, 22, 17],

                "circle-opacity": ["interpolate", ["linear"], ["zoom"], 12, 1, 15, 0],
                "circle-color": "#000",
              },
            }
          );
        });
      }

      map.on("click", "nodes-Round", function (e) {
        var callP = e.features[0].properties;

        var keys = Object.keys(callP);

        var infoShow = [];

        keys.forEach(function (item, i) {
          //if (item == "linesFrom" || item == "linesTo")
          if (item == "linesFrom" || item == "linesTo" || item == "generators" || item == "storages" || item === "deposits" || item === "synthesis") {
            var parsed = JSON.parse(callP[item]);
            var info = "<h2 class='popA popCol'>" + item + "</h2>";
            infoShow.push(info);
            var keysSub = Object.keys(parsed[0]);
            for (i = 0; i < parsed.length; i++) {
              keysSub.forEach(function (itemA) {
                var infoSub = "<h2 class='popC popCol'>" + itemA + "</h2>" + "<h2 class='popD'>" + parsed[i][itemA] + "</h2>";
                infoShow.push(infoSub);
              });
            }
          } else {
            var info = "<h2 class='popA'>" + item + "</h2>" + "<h2 class='popB'>" + callP[item] + "</h2>";
            infoShow.push(info);
          }
        });

        var infoJoin = infoShow.join("<br>");
        popup0.setLngLat(e.lngLat).setHTML(infoJoin).addTo(map);
      });

      map.on("mouseenter", "nodes-Round", function (e) {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "nodes-Round", function () {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "nodes-moved", function (e) {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "nodes-moved", function () {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "lines", function (e) {
        map.getCanvas().style.cursor = "pointer";
      });

      // map.on("click", "lines", function (e) {
      //   var callP = e.features[0].properties;
      //   console.log(callP);
      //   var keys = Object.keys(callP);

      //   var infoShow = [];
      //   keys.forEach(function (item, i) {
      //     var info = "<h2 class='popA'>" + item + "</h2>" + "<h2 class='popB'>" + callP[item] + "</h2>";
      //     infoShow.push(info);
      //   });
      //   var infoJoin = infoShow.join("<br>");

      //   popupLine.setLngLat(e.lngLat).setHTML(infoJoin).addTo(map);
      // });

      map.on("mouseleave", "lines", function () {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "linesDash", function (e) {
        map.getCanvas().style.cursor = "pointer";
      });

      // map.on("click", "linesDash", function (e) {
      //   var callP = e.features[0].properties;
      //   console.log(callP);
      //   var keys = Object.keys(callP);

      //   var infoShow = [];
      //   keys.forEach(function (item, i) {
      //     var info = "<h2 class='popA'>" + item + "</h2>" + "<h2 class='popB'>" + callP[item] + "</h2>";
      //     infoShow.push(info);
      //   });
      //   var infoJoin = infoShow.join("<br>");

      //   popupLine.setLngLat(e.lngLat).setHTML(infoJoin).addTo(map);
      // });

      map.on("mouseleave", "linesDash", function () {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "nodes", function (e) {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "nodes", function () {
        map.getCanvas().style.cursor = "";
      });

      function popUpcomined(eClick, layer, dataset) {
        // Set `bbox` as 5px reactangle area around clicked point.
        const bbox = [
          [eClick.point.x - 5, eClick.point.y - 5],
          [eClick.point.x + 5, eClick.point.y + 5],
        ];
        // Find features intersecting the bounding box.
        const selectedFeatures = map.queryRenderedFeatures(bbox, {
          layers: [layer],
        });
        const fips = isElectricity ? selectedFeatures.map((feature) => feature.properties.name) : selectedFeatures.map((feature) => feature.properties.Name);
        const type = selectedFeatures.map((feature) => feature.geometry.type);
        var fipsUnique = fips.filter(onlyUnique);

        var fipsSort = fipsUnique.sort();

        if (type[0] == "Point") {
          var typeName = "NODES";
        } else {
          var typeName = "LINES";
        }

        var list = ["<h2 class='popLtit'>Type: " + typeName + "</h2>"];

        fipsSort.forEach(function (item, i) {
          var name = "<h2 class='popL'>" + item + "</h2>";
          list.push(name);
        });

        var infoJoin = list.join("<br>");

        if (fips.length == 0) {
        } else {
          popup0.setLngLat(eClick.lngLat).setHTML(infoJoin).addTo(map);
        }

        //map.setFilter('counties-highlighted', ['in', 'FIPS', ...fips]);

        $(".popL").click(function () {
          var nameSel = $(this).html();
          let featureSel;
          featureSel = { type: "FeatureCollection" };
          featureSel.features = dataset.features.filter(function (d) {
            return d.properties.name === nameSel || d.properties.Name === nameSel;
          });

          var callP = featureSel.features[0].properties;
          var keys = Object.keys(callP);
          var infoShow = [];

          keys.forEach(function (item, i) {

            if (item == "linesFrom" || item == "linesTo" || item == "generators" || item == "storages" || item === "deposits" || item === "synthesis") {
              var parsed = callP[item];

              var info = "<h2 class='popA popCol'>" + item + "</h2>";
              infoShow.push(info);
              var keysSub = Object.keys(parsed[0]);

              for (i = 0; i < parsed.length; i++) {
                keysSub.forEach(function (itemA) {
                  const callPItem = typeof parsed[i][itemA] === "number" ?
                    Math.ceil(parsed[i][itemA] * 1000000) / 1000000 :
                    parsed[i][itemA]
                  var infoSub = "<h2 class='popC popCol'>" + itemA + "</h2>" + "<h2 class='popD'>" + callPItem + "</h2>";
                  infoShow.push(infoSub);
                });
              }
            } else {
              const callPItem = typeof callP[item] === "number" ?
                Math.ceil(callP[item] * 1000000) / 1000000 :
                callP[item]
              var info = "<h2 class='popA'>" + item + "</h2>" + "<h2 class='popB'>" + callPItem + "</h2>";
              infoShow.push(info);
            }
          });
          var infoJoin = infoShow.join("<br>");

          popup.setLngLat(eClick.lngLat).setHTML(infoJoin).addTo(map);
        });
      }

      map.on("click", (e) => {
        popUpcomined(e, "lines", dataTgenLines);
      });

      map.on("click", (e) => {
        popUpcomined(e, "linesDash", dataTgenLinesDash);
      });

      var num = 0.1234567;
      console.log(num);
      console.log(num.toFixed(4));

      map.on("click", (e) => {
        popUpcomined(e, "nodes", dataTgen);
      });

      // map.on("click", (e) => {
      //   popUpcomined(e, "nodes-Round", dataTgenRound);
      // });

      loadDataset(dataR[0]);

      $("#mySelect").change(function (e) {
        e.preventDefault();

        var selProp = $(this).val();

        loadDataset(selProp);
      });
    })
  });
}
