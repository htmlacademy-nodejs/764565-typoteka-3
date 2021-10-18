'use strict';

class SearchService {
  constructor(aticles) {
    this._aticles = aticles;
  }

  findAll(searchText) {
    return this._aticles.
      filter((aticle) => aticle.title.includes(searchText));
  }

}

module.exports = SearchService;
