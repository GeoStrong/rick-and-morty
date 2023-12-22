'use strict';
import {
  TIMEOUT_SEC,
  HASH_SLICE,
  CHARACTER_URL,
  LOCATION_URL,
  EPISODE_URL,
  DATA_PER_PAGE,
} from './config.js';

const timeout = (second) => {
  try {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(`Request took too long! Timeout after ${second} second`)
        );
      }, second * 1000);
    });
  } catch (error) {
    throw error;
  }
};

export const getData = async (url) => {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    if (!response.ok) throw new Error(`(${response.status})`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const displayCard = (property = 'block', container) => {
  const sectionCard = container.querySelectorAll('.section-card');
  sectionCard.forEach((card) => {
    if (+card.dataset.number > DATA_PER_PAGE) {
      displayElement(card, property);
    }
  });
};

const clear = (container) => {
  container.innerHTML = '';
};

export const renderError = (container, message) => {
  clear(container);
  const html = `
    <div class="section__error">
      <h2 class="section__message">
        ${
          message === 'Failed to fetch'
            ? 'Failed to retrieve data'
            : 'NOTHING FOUND'
        }
      </h2>
      <p>
        ${
          message === 'Failed to fetch'
            ? 'Please check your connection and try again.'
            : 'Sorry, but nothing matched your search terms. Please try again with some different keywords.        '
        }
      </p>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
};

export const renderLoading = (container) => {
  const html = `
      <div class="loader-container">
        <div class="loading-spinner"></div>
      </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
};

const generateCharacterMarkup = (result, index, container) => {
  const html = `
          <div class="section-card removable" data-number=${index + 1} id=${
    result.id
  }>
              <div class="section-card__background-img">
                <img src="${result.image}" alt="background-image">
              </div>
              <div class="section-card__description">
                <h2 class="section-card__name">${result.name}</h2>
                <p class="section-card__paragraph">${result.species}</p>
              </div>
          </div>
        `;
  container.insertAdjacentHTML('beforeend', html);
};

export const generateLocationMarkup = (result, index, container) => {
  const html = `
          <div class="section-card location-card" data-number=${index + 1} id=${
    result.id
  }>
            <div class="section-card__location">
              <h2 class="section-card__name">${result.name}</h2>
              <p class="section-card__paragraph">${result.dimension}</p>
            </div>
          </div>
        `;
  container.insertAdjacentHTML('beforeend', html);
};

const generateEpisodeMarkup = (result, index, container) => {
  const html = `
          <div class="section-card episode-card" data-number=${index + 1} id=${
    result.id
  }>
            <div class="section-card__episode">
              <h2 class="section-card__name">${result.name}</h2>
              <p class="section-card__paragraph">${result.air_date}</p>
              <p class="section-card__episode">${result.episode}</p>
            </div>
          </div>
        `;
  container.insertAdjacentHTML('beforeend', html);
};

export const displayData = async (
  container,
  result,
  resource = CHARACTER_URL,
  action = true
) => {
  try {
    const data = await result;
    clear(container);
    data.results.forEach((result, index) => {
      if (resource === CHARACTER_URL)
        generateCharacterMarkup(result, index, container);
      if (resource === LOCATION_URL)
        generateLocationMarkup(result, index, container);
      if (resource === EPISODE_URL)
        generateEpisodeMarkup(result, index, container);
    });
    if (action) displayCard('none', container);
  } catch (error) {
    throw error;
  }
};

export const getHash = (url) => {
  let number = url.split('api/');
  window.location.hash = number[1];
};

const handleData = async (direction = '', url) => {
  try {
    const data = await getData(url);
    if (direction === 'next' && data.info.next !== null) {
      url = data.info.next;
      getHash(url);
    }
    if (direction === 'prev' && data.info.prev !== null) {
      url = data.info.prev;
      getHash(url);
    }
    return await getData(`${url}`);
  } catch (error) {
    throw error;
  }
};

export const getPageNumber = (element) => {
  let page;
  if (element) page = element.window.location.hash;
  if (!element) page = window.location.hash;
  return page.slice(HASH_SLICE).split('?')[1];
};

export const btnMovement = (direction, container, url) => {
  displayData(container, handleData(direction, `${url}${getPageNumber()}`));
};

export const scrollTo = (element) => {
  element.scrollIntoView({ behavior: 'smooth' });
};

export const displayElement = (element, property) => {
  element.style.display = property;
};

export const getBtnInfo = async (url, btnNext, btnPrevious) => {
  const newUrl = `${url}${getPageNumber()}`;
  const data = await getData(newUrl);
  if (!data.info.prev) {
    displayElement(btnPrevious, 'none');
  } else {
    displayElement(btnPrevious, 'block');
  }
  if (!data.info.next) {
    displayElement(btnNext, 'none');
  } else {
    displayElement(btnNext, 'block');
  }
};
