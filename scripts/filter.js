'use strict';

export const filterSectionContainer = document.querySelector(
  '.section-filter__container'
);
export const filterSpecies = document.querySelector('.filter-species');
export const filterGender = document.querySelector('.filter-gender');
export const filterStatus = document.querySelector('.filter-status');
export const filterType = document.querySelector('.filter-type');
export const filterDimension = document.querySelector('.filter-dimension');
export const filterEpisode = document.querySelector('.filter-episode');
export const filterName = document.querySelector('.filter-name');

export const filterData = [
  [filterSpecies, 'species'],
  [filterGender, 'gender'],
  [filterStatus, 'status'],
  [filterType, 'type'],
  [filterDimension, 'dimension'],
  [filterEpisode, 'episode'],
  [filterName, 'name'],
];
