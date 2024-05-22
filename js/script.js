const API_URL = "https://workspace-methed.vercel.app/";
const LOCATION_URL = "api/locations";

const citySelect = document.querySelector('#city');

const cityChoices = new Choices(citySelect, {
  itemSelectText: "",
});


const getData = async (url, cbSuccess, cbError) => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    cbSuccess(data);
  } 
  catch (error) {
    cbError(error);
  }
}

const getAndRenderLocations = getData(API_URL + LOCATION_URL, 
  (data) => {
     const locations = data.map((location) => ({
      value: location
    }))
    cityChoices.setChoices(locations, "value", "label", true)
  }, 
  (error) => console.log(error));


