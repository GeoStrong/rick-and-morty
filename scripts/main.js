'use strict';
import { API_URL, CHARACTER_URL, LOCATION_URL, EPISODE_URL } from './config.js';
import * as helper from './helper.js';
import * as filter from './filter.js';

const header = document.querySelector('.header');
const characterContainer = document.querySelector(
  '.section-content__container'
);
const btnPrevious = document.querySelector('.previous');
const btnNext = document.querySelector('.next');
const btnMore = document.querySelector('.more');
const btnLess = document.querySelector('.less');
let resource = CHARACTER_URL;
let url = `${API_URL}${resource}`;
let filterObject = {};
let filterUrl = '';

const getLocationURL = function () {
  resource = LOCATION_URL;
  url = `${API_URL}${resource}`;
};

const getEpisodeURL = function () {
  resource = EPISODE_URL;
  url = `${API_URL}${resource}`;
};

filter.filterData.forEach((selectOption) => {
  selectOption[0].addEventListener('change', async function (event) {
    try {
      if (
        selectOption[1] === 'species' ||
        selectOption[1] === 'gender' ||
        selectOption[1] === 'status'
      ) {
        resource = CHARACTER_URL;
        filterObject = {
          name: filterObject.name,
          species: filterObject.species,
          gender: filterObject.gender,
          status: filterObject.status,
        };
      }

      if (selectOption[1] === 'type' || selectOption[1] === 'dimension') {
        resource = LOCATION_URL;
        filterObject = {
          name: filterObject.name,
          type: filterObject.type,
          dimension: filterObject.dimension,
        };
      }

      if (selectOption[1] === 'episode') {
        resource = EPISODE_URL;
        filterObject = {
          name: filterObject.name,
          episode: filterObject.episode,
        };
      }

      url = `${API_URL}${resource}`;
      const option = event.target.value;
      filterObject[event.target.id] = option;

      console.log(event.target);

      filterUrl = Object.entries(filterObject)
        .flatMap((entry) => {
          return entry[1] ? `${entry[0]}=${entry[1]}&` : [];
        })
        .join('');

      const newUrl = `${API_URL}${resource}${filterUrl}`;
      const data = await helper.getData(newUrl);
      if (!data) return;
      helper.getHash(`${newUrl}`);
      helper.displayData(characterContainer, data, resource);
      return (url = `${newUrl}&`);
    } catch (error) {
      helper.renderError(characterContainer, error.message);
    }
  });
});

const filterCharacter = [
  filter.filterSpecies,
  filter.filterGender,
  filter.filterStatus,
];
const filterLocation = [filter.filterType, filter.filterDimension];
const filterEpisode = [filter.filterEpisode];

const filterAction = function (filterContainer, action) {
  filterContainer.forEach((filter) => {
    if (action === 'show') filter.classList.remove('hidden');
    if (action === 'hide') filter.classList.add('hidden');
  });
};

[btnMore, btnLess].forEach((btn) =>
  btn.addEventListener('click', function () {
    let anotherButton = this === btnMore ? btnLess : btnMore;
    helper.displayCard(
      `${anotherButton === btnLess ? '' : 'none'}`,
      characterContainer
    );
    helper.displayElement(this, 'none');
    helper.displayElement(anotherButton, 'block');
  })
);

[btnNext, btnPrevious].forEach((btn) => {
  btn.addEventListener('click', function () {
    helper.btnMovement(
      `${this === btnNext ? 'next' : 'prev'}`,
      characterContainer,
      url
    );
    helper.displayElement(btnMore, 'block');
    helper.displayElement(btnLess, 'none');
    helper.scrollTo(header);
  });
});

['load', 'hashchange'].forEach((event) =>
  window.addEventListener(event, async function () {
    try {
      helper.renderLoading(characterContainer);
      const { hash } = window.location;
      if (
        hash.includes('location') ||
        hash.includes('type') ||
        hash.includes('dimension')
      ) {
        getLocationURL();
        filterAction(filterCharacter, 'hide');
        filterAction(filterLocation, 'show');
        filterAction(filterEpisode, 'hide');
        filter.filterSectionContainer.classList.add('location-filter');
      }

      if (hash.includes('episode')) {
        getEpisodeURL();
        filterAction(filterCharacter, 'hide');
        filterAction(filterLocation, 'hide');
        filterAction(filterEpisode, 'show');
        filter.filterSectionContainer.classList.add('episode-filter');
      }
      helper.displayData(
        characterContainer,
        await helper.getData(`${url}${helper.getPageNumber(this)}`),
        resource
      );
      helper.getBtnInfo(url, btnNext, btnPrevious);
    } catch (error) {
      helper.renderError(characterContainer, error.message);
    }
  })
);
