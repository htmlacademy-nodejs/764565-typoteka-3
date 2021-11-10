'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`../constants`);
const TIMEOUT = 10000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  async getArticles({offset, limit, needComments} = {}) {
    return this._load(`/articles`, {params: {offset, limit, needComments}});
  }

  async getArticle(id, needComments) {
    return this._load(`/articles/${id}`, {params: {needComments}});
  }

  async search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  async creatArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
