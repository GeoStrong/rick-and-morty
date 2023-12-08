'use strict';

import { API_URL, CHARACTER_URL, LOCATION_URL, EPISODE_URL } from './config.js';
import * as helper from './helper.js';

const sectionContainer = document.querySelector('.section');
const resourceContainer = document.querySelector(
  '.section-resource__container'
);
const btnBack = document.querySelector('.back');
const childElements = document.querySelectorAll('.section__child');
const locationData = {
  results: [],
};
let url = `${API_URL}${CHARACTER_URL.replace('?', '')}`;

const getEpisodes = async function (ep) {
  try {
    const data = await helper.getData(ep);
    return `
    <div class="section-character__series section-character__follow">
      <a href="#${data.url.split('api/')[1]}">
        <h4 class="section-character__series--header">
        ${data.episode}
        </h4>
        <p class="section-character__series--title">
          ${data.name}
        </p>
        <p class="section-character__series--date">
          ${data.air_date}
        </p>
      </a>
    </div>
    `;
  } catch (error) {
    console.error(error);
    helper.renderError(container, error.message);
  }
};

const generateCharacterMarkup = async function (result, index, container) {
  try {
    const html = `
      <div class="section-character removable" id="${index}">
        <div class="section-character__first">
          <div class="section-character__profile">
            <div class="section-character__avatar" style="background-image: url(${
              result.image
            })">
            </div>
            <h2 class="section-character__name">${result.name}</h2>
          </div>
        </div>
        <div class="section-character__second">
          <div class="section-character__information">
            <h3 class="section__header">Informations</h3>
            <div class="section-character__info">
              <h4 class="section-character__info--header">Gender</h4>
              <p class="section-character__info--description">${
                result.gender
              }</p>
            </div>
            <div class="section-character__info">
              <h4 class="section-character__info--header">Species</h4>
              <p class="section-character__info--description">${
                result.species
              }</p>
            </div>
            <div class="section-character__info">
              <h4 class="section-character__info--header">Origin</h4>
              <p class="section-character__info--description">${
                result.origin.name
              }</p>
            </div>
            <div class="section-character__info">
              <h4 class="section-character__info--header">Type</h4>
              <p class="section-character__info--description">${
                result.type ? result.type : 'unknown'
              }</p>
            </div>
            <div class="section-character__info section-character__follow">
              <a href="#${result.location.url.split('api/')[1]}" >
                <h4 class="section-character__info--header">Location</h4>
                <p class="section-character__info--description">${
                  result.location.name
                }</p>
              </a>  
            </div>
          </div>
          <div class="section-character__episode">
            <h3 class="section__header">Episodes</h3>
            <div class="section-character__scroll">
              ${await Promise.all(result.episode.map((ep) => getEpisodes(ep)))}
            </div>
          </div>
        </div>
      </div>
  `;
    container.insertAdjacentHTML('beforeend', html);
  } catch (error) {
    helper.renderError(container, error.message);
  }
};

const generateResourceMarkup = async function (
  result,
  index,
  container,
  resource = 'location'
) {
  const html = `
    <div class="section-resource ${
      resource === 'location' ? 'location' : 'episode'
    } removable" id="${index}">
      <div class="section-resource__row">
        <h2 class="section-resource__name section-resource__name--title">${
          result.name
        }</h2>
        <div class="section-resource__first">
          <h4 class="section-character__info--header">${
            resource === 'location' ? 'Type' : 'Episode'
          }</h4>
          <p class="section-character__info--description">${
            resource === 'location' ? result.type : result.episode
          }</p>
        </div>
        <div class="section-resource__second">
          <h4 class="section-character__info--header">${
            resource === 'location' ? 'Dimension' : 'Date'
          }</h4>
          <p class="section-character__info--description">${
            resource === 'location' ? result.dimension : result.air_date
          }</p>
        </div>
      </div>
      <h3 class="section__header">${
        resource === 'location' ? 'Residents' : 'Cast'
      }</h3>
    </div>
      `;
  container.insertAdjacentHTML('afterbegin', html);
};

const getLocationURL = function () {
  url = `${API_URL}${LOCATION_URL.replace('?', '')}`;
};

const getEpisodeURL = function () {
  url = `${API_URL}${EPISODE_URL.replace('?', '')}`;
};

const displayChildElements = function (action) {
  childElements.forEach((child) => {
    if (action === 'hide') child.classList.add('hidden');
    if (action === 'show') child.classList.remove('hidden');
  });
};

const deleteChild = function (container) {
  const removableElement = container.querySelectorAll('.removable');
  removableElement.forEach((element) => {
    const parent = element.parentNode;
    parent.removeChild(element);
  });
};

const displayAllCharacters = async function (result, container) {
  let characters;
  if (result.residents) characters = result.residents;
  if (result.characters) characters = result.characters;
  characters.forEach(async (resident) => {
    locationData.results = [];
    const data = await helper.getData(resident);
    locationData.results.push(data);
    await helper.displayData(container, locationData, CHARACTER_URL, false);
  });
  if (characters.length === 0) {
    const h2 = document.createElement('h2');
    h2.textContent = 'There is no residents in this location';
    h2.classList.add('empty');
    resourceContainer.appendChild(h2);
  }
};

const displayFullInfo = async function (url, id, container) {
  try {
    if (!id || !isFinite(id)) return;
    const data = await helper.getData(`${url}${id}`);
    if (url.includes('character')) {
      generateCharacterMarkup(data, data.id, container);
    }
    if (url.includes('location')) {
      generateResourceMarkup(data, data.id, container, 'location');
      displayAllCharacters(data, resourceContainer);
    }
    if (url.includes('episode')) {
      generateResourceMarkup(data, data.id, container, 'episode');
      displayAllCharacters(data, resourceContainer);
    }
    displayChildElements('hide');
    btnBack.classList.remove('hidden');
  } catch (error) {
    console.error(error);
    helper.renderError(sectionContainer, error.message);
  }
};

sectionContainer.addEventListener('click', async function (event) {
  try {
    let card;
    let hash;
    if (url === url) {
      card = event.target.closest('.section-card');
      hash = 'character';
    }
    if (window.location.hash.includes('location')) {
      getLocationURL();
      card = event.target.closest('.location-card');
      hash = 'location';
    }
    if (window.location.hash.includes('episode')) {
      getEpisodeURL();
      card = event.target.closest('.episode-card');
      hash = 'episode';
    }
    if (!card) return;
    window.location.hash = `${hash}/${card.id}`;
    displayFullInfo(url, card.id, this);
  } catch (error) {
    console.error(error);
    helper.renderError(sectionContainer, error.message);
  }
});

btnBack.addEventListener('click', function () {
  window.history.back();
  deleteChild(sectionContainer);
  displayChildElements('show');
  this.classList.add('hidden');
  const removeEmpty = resourceContainer?.querySelector('.empty');
  if (!removeEmpty) return;
  resourceContainer?.removeChild(removeEmpty);
});

resourceContainer.addEventListener('click', function (event) {
  const card = event.target.closest('.section-card');
  if (!card) return;
  window.location.hash = `${CHARACTER_URL.replace('?', '')}${card.id}`;
});

window.addEventListener('load', async function () {
  const id = window.location.hash.split('#')[1];
  if (!id) return;
  if (id.includes('location')) {
    getLocationURL();
  }
  if (id.includes('episode')) {
    getEpisodeURL();
  }
  displayFullInfo(url, id.split('/')[1], sectionContainer);
});

window.addEventListener('hashchange', () => {
  if (location.hash.includes('?')) return;
  window.location.reload();
});
