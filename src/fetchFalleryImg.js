import axios from 'axios';

export class ApiFalleryImg {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchFalleryImg() {
    const param = {
      params: {
        key: '35290900-56ffde2696ef97590bed2c34b',
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page: this.page,
      },
    };
    const url = `https://pixabay.com/api/`;
    try {
      const response = await axios.get(url, param);
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
