
const apiKey = "AAPK016754a4ce7841328140b4df4893f6acbsTWyOX71XURmBbu3IYG818UB9laifsbNkP_ojMYs68S2MfYDG1wIEkUNx8o7yUE";

const map = L.map("map", {
minZoom: 2
}).setView([33.9, -81], 7.8);

// This will get set to a matched address and submitted with the report
var locationDescription = "None";

// Firebase initialization

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-analytics.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBF4rao8TaWXRpXkGHVKnjcWdgjfeoR09E",
  authDomain: "scwildlifereport.firebaseapp.com",
  projectId: "scwildlifereport",
  storageBucket: "scwildlifereport.appspot.com",
  messagingSenderId: "606312652555",
  appId: "1:606312652555:web:c445bfef29de56af730c0e",
  measurementId: "G-LSG12Z1XLV"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// TEST FIREBASE IMAGE UPLOAD
const storage = getStorage();

function imageSubmit(name) {
  const file = document.getElementById("upload").files[0];
  console.log(file);
  if (!file) return;
  const storageRef = ref(storage, 'report_uploads/'+name);
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
}

// Add event listener for submit button in report div
document.querySelector(".Submit").addEventListener("click", postReportFunction);

// Declare a variable for the feature which can be submitted with the report (gets updated when user clicks on map)
var feat = null;

// Add the base map layers
const basemapLayers = {
    Streets: L.esri.Vector.vectorBasemapLayer("ArcGIS:Streets", { apiKey: apiKey }).addTo(map),
    Navigation: L.esri.Vector.vectorBasemapLayer("ArcGIS:Navigation", { apiKey: apiKey }).addTo(map),
    Imagery: L.esri.Vector.vectorBasemapLayer("ArcGIS:Imagery", { apiKey: apiKey }).addTo(map),
    Topographic: L.esri.Vector.vectorBasemapLayer("ArcGIS:Topographic", { apiKey: apiKey }).addTo(map),
};

L.control.layers(basemapLayers, null, { collapsed: false }).addTo(map);

// define icons for display of each report type
let AnimalIcon =  L.icon({
    iconUrl: "../../img/print.svg",
    iconSize: [48, 48],
    name: "animal"
  });
let PlantIcon =  L.icon({
    iconUrl: "../../img/flower2.svg",
    iconSize: [48, 48],
    name: "plant"
  });
let InsectIcon =  L.icon({
    iconUrl: "../../img/butterfly.svg",
    iconSize: [48, 48],
    name: "insect"
  });
  let TestIcon =  L.icon({
    iconUrl: "../../img/logo.svg",
    iconSize: [48, 48],
    name: "default"
  });
  
// make a larger icon for it to switch to on mouseover
  let AnimalIconLarge =  L.icon({
    iconUrl: "../../img/print.svg",
    iconSize: [72, 72],
    name: "animal"
  });
let PlantIconLarge =  L.icon({
    iconUrl: "../../img/flower2.svg",
    iconSize: [72, 72],
    name: "plant"
  });
let InsectIconLarge =  L.icon({
    iconUrl: "../../img/butterfly.svg",
    iconSize: [72, 72],
    name: "insect"
  });
  let TestIconLarge =  L.icon({
    iconUrl: "../../img/logo.svg",
    iconSize: [72, 72],
    name: "default"
  });

  var allMarkers = new Array();

// Adding a hosted feature layer AGOL
var reports = L.esri
  .featureLayer({
      url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/SC_Reports_GEOJSON/FeatureServer/0",
      onEachFeature: function (feature) {
        if (feature.properties.Type == "Animal") {
           var newMarker = L.marker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
            icon: AnimalIcon
          })
          allMarkers.push(newMarker);
          return newMarker.addTo(map);
        } else if (feature.properties.Type == "Plant") {
          var newMarker = L.marker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
           icon: PlantIcon
         })
         allMarkers.push(newMarker);
         return newMarker.addTo(map);
        } else if (feature.properties.Type == "Insect") {
          var newMarker = L.marker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
           icon: InsectIcon
         })
         allMarkers.push(newMarker);
         return newMarker.addTo(map);
        } else {
          return L.marker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
            icon: AnimalIcon
          }).addTo(map);
        }
      }
    });

  // use querying to add to map instead of just directly adding the reports layer - this allows for better control of icons
  var queryReports = L.esri.query({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/SC_Reports_GEOJSON/FeatureServer/0"
  });
  
  queryReports.where("1=1");

  function runQueryReports() {  
    queryReports.run(function (error, featureCollection, response) {
      if (error) {
        console.log(error);
        return;
      }

      featureCollection.features.forEach((feat) => {
        var newMarker;
        if (feat.properties.Type == "Animal") {
          newMarker = L.marker([feat.geometry.coordinates[1],feat.geometry.coordinates[0]], {
            icon: AnimalIcon
          })
        } else if (feat.properties.Type == "Insect") {
          newMarker = L.marker([feat.geometry.coordinates[1],feat.geometry.coordinates[0]], {
            icon: InsectIcon
          })
        } else if (feat.properties.Type == "Plant") {
          newMarker = L.marker([feat.geometry.coordinates[1],feat.geometry.coordinates[0]], {
            icon: PlantIcon
          })
        } else {
          newMarker = L.marker([feat.geometry.coordinates[1],feat.geometry.coordinates[0]], {
            icon: PlantIcon
          })
        }
        allMarkers.push(newMarker);
        if (feat.properties.Photo != "") {
          newMarker.bindPopup(L.Util.template(
              "<div class='reportPopup'><p style='text-align:center'><strong>Species Report </strong></p> <strong> Type: </strong> {Type} <br>" +
              "<strong>Endangered:</strong> {Endangered} <br><strong> Invasive: </strong>{Invasive} <br>"+
              "<strong>Date:</strong> {DateString} <br> <strong>Species: </strong>{Species} <br> <strong>Notes: </strong>{Notes} <br>"+
              "<strong>Photo:</strong> <img src=https://firebasestorage.googleapis.com/v0/b/scwildlifereport.appspot.com/o/report_uploads%2F{Photo}?alt=media style='width:90px;height:85px'/> <br>",
              feat.properties
            ));
          } else {
            newMarker.bindPopup(L.Util.template(
              "<div class='reportPopup'><p style='text-align:center'><strong>Species Report </strong></p> <strong> Type: </strong> {Type} <br>" +
              "<strong>Endangered:</strong> {Endangered} <br><strong> Invasive: </strong>{Invasive} <br>"+
              "<strong>Date:</strong> {DateString} <br> <strong>Species: </strong>{Species} <br> <strong>Notes: </strong>{Notes} <br>"+
              "<br>",
              feat.properties
            ));
          }

        newMarker.on('mouseover', function (e) {
          if (newMarker.getIcon().options.name == "plant") {
            newMarker.setIcon(PlantIconLarge);
          } else if (newMarker.getIcon().options.name == "insect") {
            newMarker.setIcon(InsectIconLarge);
          } else if (newMarker.getIcon().options.name == "animal") {
            newMarker.setIcon(AnimalIconLarge);
          } else {
            newMarker.setIcon(TestIconLarge);
          }
        });
        newMarker.on('mouseout', function(e){
          if (newMarker.getIcon().options.name == "plant") {
            newMarker.setIcon(PlantIcon);
          } else if (newMarker.getIcon().options.name == "insect") {
            newMarker.setIcon(InsectIcon);
          } else if (newMarker.getIcon().options.name == "animal") {
            newMarker.setIcon(AnimalIcon);
          } else {
            newMarker.setIcon(TestIcon);
          }
        })
        return newMarker.addTo(map);
      })
    });
  };

  runQueryReports();

  const select = document.getElementById("whereClauseSelect");
  select.addEventListener("change", () => {
    if (select.value !== "") {
      allMarkers.forEach((marker) => {
        map.removeLayer(marker);
      });

      queryReports.where(select.value);
      runQueryReports();

    }
  });

// Add Geocoding functionality from ESRI Leaflet
const searchControl = L.esri.Geocoding.geosearch({
    position: "topright",
    placeholder: "Enter an address or place e.g. 20 Elm St",
    useMapBounds: true,
    providers: [
      L.esri.Geocoding.arcgisOnlineProvider({
        apikey: apiKey,
        nearby: {
          lat: 33.8361,
          lng: -81.1637
        }
      })
    ]
  }).addTo(map);

  const results = L.layerGroup().addTo(map);

  searchControl.on("results", (data) => {
    results.clearLayers();
    for (let i = data.results.length - 1; i >= 0; i--) {
      const lngLatString = `${Math.round(data.results[i].latlng.lng * 100000) / 100000}, ${
        Math.round(data.results[i].latlng.lat * 100000) / 100000
      }`;
      const marker = L.marker(data.results[i].latlng);
      locationDescription = `${data.results[i].properties.LongLabel}`;
      console.log(locationDescription);
      document.getElementById("locationDescription").innerHTML = locationDescription;
      marker.bindPopup(`<b>${lngLatString}</b><p>${data.results[i].properties.LongLabel}</p>`);
      results.addLayer(marker);
      marker.openPopup();
    }
  });

  // Add reverse geocoding as well 
  const layerGroup = L.layerGroup().addTo(map);

  map.on("click", function (e) {
    L.esri.Geocoding
      .reverseGeocode({
        apikey: apiKey
      })
      .latlng(e.latlng)
      .run(function (error, result) {
        if (error) {
          return;
        }

        const lngLatString = `${Math.round(result.latlng.lng * 100000) / 100000}, ${Math.round(result.latlng.lat * 100000) / 100000}`;
        locationDescription = `${result.address.Match_addr}`;
        console.log(locationDescription);
        document.getElementById("locationDescription").innerHTML = locationDescription;
        layerGroup.clearLayers();
        let marker = L.marker(result.latlng)
          .addTo(layerGroup)
          .bindPopup(`<b>${lngLatString}</b><p>${result.address.Match_addr}</p>`)
          .openPopup();
      });
  });

  // Add feature by clicking on map
  map.on("click", function (e) {
    // convert to GeoJSON
    //console.log("map clicked!");
    feat = L.marker(e.latlng).toGeoJSON();
    console.log(feat);
  });

  function postReportFunction() {

    if (feat != null) {
      if (locationDescription.includes("South Carolina") || locationDescription.includes("SC,")) {
        let Species = document.getElementById("species").value;
        if (Species != "") {
          let submitDate = document.getElementById("Date").value;
          if (submitDate != "") {
            let file = document.getElementById("upload").files[0];
            
            //console.log("posting report!");
            //console.log(feat);
            feat.properties.Type = document.getElementById("reportType").value;
            if ( document.getElementById("endangeredCheckbox").checked) {
              feat.properties.Endangered = "Yes";
            } else {
              feat.properties.Endangered = "No";
            }
            if ( document.getElementById("invasiveCheckbox").checked) {
              feat.properties.Invasive = "Yes";
            } else {
              feat.properties.Invasive = "No";
            }

            let fileExtension = file.name.split(".").pop();
            let randStr = (Math.random() + 1).toString(36).substring(7);
            let photoName = randStr+"."+fileExtension;

            feat.properties.DateString = (new Date(document.getElementById("Date").value)).toDateString().slice(0,15);
            feat.properties.LocationDescription = locationDescription;
            feat.properties.Species = document.getElementById("species").value;
            feat.properties.Notes = document.getElementById("Notes").value;
            feat.properties.Photo = photoName;

            reports.addFeature(feat, function (err, response) {
              if (err) {
                console.log("Error!");
                console.log(err);
                document.querySelector(".reportSubmitDialog").style.display = "block";
                document.querySelector("#reportSubmitResponseMsg").innerHTML = "Error submitting report!<br>Please check all the fields.";
                return;
              } else {
                document.querySelector(".reportSubmitDialog").style.display = "block";
                document.querySelector("#reportSubmitResponseMsg").innerHTML = "Report Successfully Submitted!";
                document.querySelector(".report").style.display = "none";
                if (file) {
                  imageSubmit(photoName);
                }
                // run queryReports again to re-load map
                runQueryReports();

              }
              console.log(response);
            })
          } else {
            // date has not been added
            document.querySelector(".reportSubmitDialog").style.display = "block";
            document.querySelector("#reportSubmitResponseMsg").innerHTML = "Please submt a date the report";      
          }
        } else {
          // species has not been added
          document.querySelector(".reportSubmitDialog").style.display = "block";
          document.querySelector("#reportSubmitResponseMsg").innerHTML = "Please submt a species name with the report";      
        }
      } else {
        // location with "South Carolina" or "SC," has not been selected
        document.querySelector(".reportSubmitDialog").style.display = "block";
        document.querySelector("#reportSubmitResponseMsg").innerHTML = "Please select a location that is in South Carolina";      
      }
    } else {
      // if feature on map has not been selected
      document.querySelector(".reportSubmitDialog").style.display = "block";
      document.querySelector("#reportSubmitResponseMsg").innerHTML = "Please select a location on the map to submit a report";
    }
  }
// Make Report button
document.querySelector("#makeReportButton").addEventListener("click", function(){
  if (document.querySelector(".report").style.display == "block") {
    document.querySelector(".report").style.display = "none";
  } else {
    document.querySelector(".report").style.display = "block";
  }
  
});
// Cancel Report button
document.querySelector(".Cancelbtn").addEventListener("click", function(){
  document.querySelector(".report").style.display = "none";
});
// Close Report Form Submit Dialog Button
document.querySelector("#closeReportSubmit").addEventListener("click", function(){
  document.querySelector(".reportSubmitDialog").style.display = "none";
});

// Autocomplete stuff
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].toUpperCase().includes(val.toUpperCase()) || val.toUpperCase().includes(arr[i].toUpperCase())) { // (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          //b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML = arr[i];
          
          /*insert a input field that will hold the current array item's value:*/
          ////b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          //console.log(b.innerHTML);
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.innerHTML;//this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });

  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

/*An array containing all the species names for autofill*/
var species_list = 
//Endangered Animals:
["American Swallow-tailed Kite","Bachman's Warbler",
"Carolina Heelsplitter", "Carolina Pygmy Sunfish", 
"Eastern Cougar", "Flatwoods Salamander", "Gopher Frog", "Gopher Tortoise", 
"Indiana Bat", 
"Rafinesque\'s Big-eared Bat", "Red-cockaded Woodpecker", "Shortnose Sturgeon", 
"Webster\'s Salamander", "West-Indian Manatee",

//Endangered Plants:
"American Chaffseed", "Black-spored Quillwort", "Bunched Arrowhead", "Canby\'s Dropwort", 
"Harperella", "Michaux\'s Sumac", "Mountain Sweet Pitcher Plant", 
"Persistent Trillium", "Pondberry", "Reflexed Blue-eyed Grass","Relic Trillium", 
"Rocky Gnome Lichen", "Rough-leaved Loosestrife", "Schweinitz\'s Sunflower", 
"Smooth Coneflower", "Golden Sedge", "Rock Gnome Lichen","White Irisette ",

//Endangered Insects/Bugs:
"Appalachian Snaketail", "Calvert's Emerald", 
"Diminutive Clubtail", "Towne's Clubtail",
"Rusty Patched Bumble Bee",

//Invasive Animals:
"Wild Boar/Swine/Pig","European Starling","House Sparrow","Rock Pigeon","House Finch", 
"Cattle Egret", "Eurasian Collared Dove","Ring Necked Pheasant","Tegu Lizard",

//Invasive Plants: 
"Bradford Pear/Callery Pear","Tree of Heaven", "Cogongrass","Fig Buttercup","Chinaberry", "Princess Tree", "Chinese Tallow Tree", "Mimosa/Silktree", 
"Paper Mulberry", "Chinese Parasol Tree", "White Mulberry", "White Poplar", "Camphortree", "Russian-Olive", "Sawtooth Oak", "Chinese Elm",
"Scotch Broom/English Broom", "Thorny-Olive", "Autumn-Olive", "Shrub Lespedeza", "Chinese Privet", "Japansese Knotweed", "Trifoliate Orange/Hardy Orange",
"Japanese Privet", "Nandina/Sacred Bamboo", "Multiflora Rose", "Glossy, Tall Glossy Privet", "European Privet", "Jasmine", 
"Macartney Rose", "Jerusalem Cherry", "Meadowsweet", "Saltcedar", "Roundleaf Chastetree", "Japanese Barberry", "Winged Euonymus", "Amur Privet",
"Amur Honeysuckle", "Leatherleaf Mahonia", "Wineberry/Wine Raspberry", "English Ivy", "Japanese Climbing Fern", "Japanese Honeysuckle",
"Kudzu", "Cherokee Rose", "Chinese Wisteria", "Bigleaf Periwinkle", "Common Periwinkle", "Chinese Yam", "Asian/Oriental Bittersweet",
"Sweet Autumn Virgin\'s Bower", "Purple Crownvetch", "Asian/Japanese Wisteria", "Fiveleaf Akebia/Chocolate Vine", "Porcelain Berry",
"Bushkiller", "Japanese Dodder", "Climbing Euonymus", "Japanese Hop", "Old World Climbing Fern", "Nepalese Browntop", "Japanese Stilt Grass",
"Chinese Silvergrass", "Common Reed", "Itchgrass", "Johnson Grass", "Weeping Love Grass", "Tall Fescue", "Dallis/Dallas Grass", "Bahia Grass",
"Vasey\'s Grass", "Torpedo Grass", "Golden Bamboo/Fishpole Bamboo", "Giant Reed", "Pampas Grass", "Deep-rooted Sedge", "Sericea/Chinese Bush Clover",
"Marsh Dewflower", "Tropical Soda Apple", "Nodding Thistle", "Bull Thistle", "Showy Rattlebox", "Queen Anne\'s Lace/Wild Carrot", "Scarlet Wisteria Tree",
"Garlic Mustard", "Spotted Knapweed", "Field Thistle", "Coco Yam/Taro", "Dayflower", "Monkey Grass", "Purple Loosestrife", "Witchweed", 
"Swordfern", "Crested Floating Heart","Dutch Elm Disease", "Chestnut Blight", "Beach Vitex","Hydrilla","Empress Tree","Giant Hogweed",

//Invasive Insects/Bugs:
"Asian Longhorned Tick", "Asian Longhorned Beetle","Emerald Ash Borer", "Hemlock Woolly Adelgid", "Asian Ambrosia Beetle",
"Brown Marmorated Stink Bug","Box Tree Moth", "Fire Ant", "Gypsy Moth", "Spotted Lanternfly",];

/*initiate the autocomplete function on the "myInput" element, and pass along the species_list array as possible autocomplete values:*/
autocomplete(document.getElementById("species"), species_list);




//document.addEventListener('DOMContentLoaded',createMap);//loading data onto page
