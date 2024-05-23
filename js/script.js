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
    <li class="vacancy__field">от ${parseInt(vacancy.salary).toLocaleString("fr")}₽</li>
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

const createDetailVacancy = ({logo, title, company, description, email, experience, type, format, salary, location}) => `
<article class="detail">
        <div class="detail__header">
          <img class="detail__logo" src="${API_URL}/${logo}" alt="Логотип компании ${company}">

          <p class="detail__company">${company}</p>
          
          <h2 class="detail__title">${title}</h2>
        </div>

        <div class="detail__main">
          <p class="detail__description">${description.replaceAll("\n", "<br>")}</p>

          <ul class="detail__fields">
            <li class="detail__field">от ${parseInt(salary).toLocaleString("fr")}₽</li>
            <li class="detail__field">${type}</li>
            <li class="detail__field">${format}</li>
            <li class="detail__field">${experience}</li>
            <li class="detail__field">${location}</li>
          </ul>
        </div>

        <p class="detail__resume">Отправляйте резюме на 
          <a class="blue-text" href="mailto:${email}">${email}</a>
        </p>
      </article>
`;


const renderModal = (data) => {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalMain = document.createElement("div");
  modalMain.classList.add("modal__main");
  modalMain.innerHTML = createDetailVacancy(data);
  
  const buttonClose = document.createElement("button");
  buttonClose.classList.add("modal__close");
  buttonClose.innerHTML = `<span class="icon icon_close"></span>`;

  modalMain.append(buttonClose);

  modal.append(modalMain);

  document.body.append(modal);

  document.body.addEventListener("click", ({ target }) => {
    if (target === target.closest(".modal") || target.closest(".modal__close")) {
      modal.remove();
    }

  });
}

const openModal = (id) => {
  getData(`${URL_VACANCIES}/${id}`, renderModal, renderError)
}

const renderError = (error) => console.log(error);

const getAndRenderLocations = () => getData(URL_LOCATIONS, renderLocations, renderError);
const getAndRenderVacancies = () => getData(URL_VACANCIES, renderVacancies, renderError);

const init = () => {
  getAndRenderLocations();
  getAndRenderVacancies();

  cardList.addEventListener("click", ({target}) => {
    const vacancyCard = target.closest(".vacancy");
    
    if (vacancyCard) {
      const vacancyId = vacancyCard.dataset.id;
      openModal(vacancyId);
    }
  })
}

init();


