import axios from 'axios';

const API_KEY = '35290900-56ffde2696ef97590bed2c34b';
const URL = `https://pixabay.com/api/`;

export class ApiFalleryImg {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchFalleryImg() {
    const param = {
      params: {
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page: this.page,
      },
    };
    try {
      const response = await axios.get(URL, param);
      this.incrementPage();
      return response.data.hits;
    } catch (error) {
      console.error(error);
    }
  }
  incrementPage() {
    this.page = this.page + 1;
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
