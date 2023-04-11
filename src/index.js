import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { ApiFalleryImg } from './fetchFalleryImg.js';

const apiService = new ApiFalleryImg();

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnFindMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearch);
btnFindMore.addEventListener('click', onFindMore);

function onSearch(event) {
  event.preventDefault();

  apiService.query = event.target.elements.searchQuery.value;
  apiService.resetPage();
  apiService
    .fetchFalleryImg()
    .then(hits => {
      if (hits.length === 0) {
        showError(error);
      }
      clearMarkup();
      appendMarkup(hits);
      showMessage(
        'success',
        'Hooray! We found ${response.data.totalHits} images.'
      );
    })
    .catch(showError);
}

function onFindMore() {
  apiService.fetchFalleryImg().then(hits => appendMarkup(hits));
}
function appendMarkup(hits) {
gallery.insertAdjacentHTML('beforeend', createDataMarkup(hits));
};

function createDataMarkup(hits) {
  return (dataMarkup = hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
  
  <div class="gallery__item">
  <a class="gallery__link" href="${largeImageURL}">
  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
</div>
</a>
</div>
`;
      }
    )
    .join(' '));
}

function clearMarkup() {
  gallery.innerHTML = '';
}

function showMessage(type, message) {
  Notiflix.Notify[type](message);
}

function showError(error) {
  showMessage(
    'failure',
    'Sorry, there are no images matching your search query. Please try again.'
  );
  clearMarkup();
}

var lightbox = new SimpleLightbox('.gallery__item a', {
  captionsData: 'alt',
  captionDelay: 250,
});
