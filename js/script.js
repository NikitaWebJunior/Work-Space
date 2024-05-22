const API_URL = "https://workspace-methed.vercel.app/";
const LOCATION_URL = "api/locations";
const VACANCIES_URL = "api/vacancy";

const URL_LOCATIONS = new URL(`${API_URL}${LOCATION_URL}`);
const URL_VACANCIES = new URL(`${API_URL}${VACANCIES_URL}`);

const citySelect = document.querySelector('#city');
const cardList = document.querySelector(".cards__list");

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

const createCard = (vacancy) => `
<article class="vacancy" tabindex="0" data-id="${vacancy.id}">
  <img class="vacancy__img" src="${API_URL}${vacancy.logo}" alt="Логотип компании ${vacancy.company}">

  <p class="vacancy__company">${vacancy.company}</p>

  <h3 class="vacancy__title">${vacancy.title}</h3>

  <ul class="vacancy__fields">
    <li class="vacancy__field">от ${+vacancy.salary.toLocaleString()}₽</li>
    <li class="vacancy__field">${vacancy.format}</li>
    <li class="vacancy__field">${vacancy.type}</li>
    <li class="vacancy__field">${vacancy.experience}</li>
  </ul>
</article>
`;

const createCards = (data) => {
  return data.vacancies.map(vacancy => {
    const li = document.createElement("li");
    li.classList.add("cards__item");
    li.insertAdjacentHTML("beforeend", createCard(vacancy));
    return li;
  })
}

const renderLocations = (data) => {
  const locations = data.map((location) => ({
    value: location
  }))
  cityChoices.setChoices(locations, "value", "label", true)
}

const renderVacancies = (data) => {
  cardList.textContent = "";
  const cards = createCards(data);
  cardList.append(...cards);
  // console.log(cards)
}

const renderError = (error) => console.log(error);

const getAndRenderLocations = () => getData(URL_LOCATIONS, renderLocations, renderError);
const getAndRenderVacancies = () => getData(URL_VACANCIES, renderVacancies, renderError);

const init = () => {
  getAndRenderLocations();
  getAndRenderVacancies();
}

init();


