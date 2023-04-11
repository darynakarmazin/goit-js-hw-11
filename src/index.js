import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { ApiFalleryImg } from './fetchFalleryImg.js';

const apiService = new ApiFalleryImg();

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnFindMore = document.querySelector('.load-more');

const typeFailure = 'failure';
const typeSuccess = 'success';
const typeInfo = 'info';

searchForm.addEventListener('submit', onSearch);
btnFindMore.addEventListener('click', onFindMore);

function onSearch(event) {
  event.preventDefault();

  apiService.query = event.target.elements.searchQuery.value;
  hiddBtn();
  apiService.resetPage();
  apiService
    .fetchFalleryImg()
    .then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        showError(error);
      }
      clearMarkup();
      appendMarkup(hits);
      createGallery();
      showMessage(typeSuccess, `Hooray! We found ${totalHits} images.`);
      showBtn();
    })
    .catch(showError);
}

function onFindMore() {
  apiService
    .fetchFalleryImg()
    .then(({ hits, totalHits }) => {
      appendMarkup(hits);
      createGallery();
      if (apiService.perPage * apiService.page > totalHits) {
        hiddBtn();
        showMessage(
          typeInfo,
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(showError);
}
function appendMarkup(hits) {
  gallery.insertAdjacentHTML('beforeend', createDataMarkup(hits));
}

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
    typeFailure,
    'Sorry, there are no images matching your search query. Please try again.'
  );
  clearMarkup();
}

function showBtn() {
  btnFindMore.hidden = false;
}
function hiddBtn() {
  btnFindMore.hidden = true;
}

function createGallery() {
  simpleLightBox = new SimpleLightbox('.gallery__item a', {
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
}

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });
