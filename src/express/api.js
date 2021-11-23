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

  async getArticles({offset, limit, userId, needComments, limitPopular, limitLastComments} = {}) {
    return this._load(`/articles`, {params: {offset, limit, userId, needComments, limitPopular, limitLastComments}});
  }

  async getArticle(id, needComments) {
    return this._load(`/articles/${id}`, {params: {needComments}});
  }

  async search({query}) {
    return this._load(`/search`, {params: {query}});
  }

  getCategory({categoryId, limit, offset, needComments}) {
    return this._load(`/categories/${categoryId}`, {params: {limit, offset, needComments}});
  }

  async getCategories({withCount}) {
    return this._load(`/categories`, {params: {withCount}});
  }

  async createArticle(data) {
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

  editCategory(id, data) {
    return this._load(`/categories/${id}`, {
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

  createCategory(data) {
    return this._load(`/categories`, {
      method: HttpMethod.POST,
      data
    });
  }

  removeCategory(id) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  removeArticle({id, userId}) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE,
      data: {
        userId
      }
    });
  }

  removeComment({id, userId, commentId}) {
    return this._load(`/articles/${id}/comments/${commentId}`, {
      method: HttpMethod.DELETE,
      data: {
        userId
      }
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
