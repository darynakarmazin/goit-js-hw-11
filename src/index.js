import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { ApiFalleryImg } from './fetchFalleryImg.js';

const apiService = new ApiFalleryImg();

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnFindMore = document.querySelector('.find-more');

searchForm.addEventListener('submit', onSearch);
btnFindMore.addEventListener('click', onFindMore);

function onSearch(event) {
  event.preventDefault();

  apiService.query = event.target.elements.searchQuery.value;
  apiService.resetPage();
  apiService.fetchFalleryImg().then(dataMarkup);
}

function onFindMore() {
  apiService.fetchFalleryImg().then(dataMarkup);
}
function dataMarkup(hits) {
  const dataMarkup = hits
    .map(hits => {
      return `
  <div class="photo-card">
  <img src="${hits.webformatURL}" alt="${hits.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${hits.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${hits.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${hits.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${hits.downloads}</b>
    </p>
  </div>
</div>
  `;
    })
    .join(' ');
  gallery.innerHTML = dataMarkup;
}
