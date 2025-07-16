class Api {
  constructor({ baseURL, headers }) {
    this.baseURL = baseURL;
    this.headers = headers;
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  getInitialCards() {
    return fetch(`${this.baseURL}/cards`, {
      headers: this.headers,
    }).then(this._checkResponse);
  }
  addNewCard({ name, link }) {
    return fetch(`${this.baseURL}/cards`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._checkResponse);
  }

  getUserInfo() {
    return fetch(`${this.baseURL}/users/me`, {
      method: "GET",
      headers: this.headers,
    }).then(this._checkResponse);
  }
  editUserInfo({ name, about }) {
    return fetch(`${this.baseURL}/users/me`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._checkResponse);
  }
  editAvatarInfo(avatar) {
    return fetch(`${this.baseURL}/users/me/avatar`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({
        avatar: avatar.link,
      }),
    }).then(this._checkResponse);
  }
  deleteCard(id) {
    return fetch(`${this.baseURL}/cards/${id}`, {
      method: "DELETE",
      headers: this.headers,
    }).then(this._checkResponse);
  }
  changeLikeStatus(id, isLiked) {
    const method = isLiked ? "DELETE" : "PUT"; //true on server
    return fetch(`${this.baseURL}/cards/${id}/likes`, {
      method: method,
      headers: this.headers,
    }).then(this._checkResponse);
  }
}
export default Api;
