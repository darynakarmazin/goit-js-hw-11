import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { ApiFalleryImg } from './fetchFalleryImg.js';
import { typeFailure, typeSuccess, typeInfo } from './message.js';

const apiService = new ApiFalleryImg();

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnFindMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearch);
btnFindMore.addEventListener('click', onFindMore);

function onSearch(event) {
  event.preventDefault();

  apiService.query = event.target.elements.searchQuery.value.trim();
  hiddBtn();
  apiService.resetPage();
  apiService
    .fetchFalleryImg()
    .then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        showError();
      } else {
        clearMarkup();
        appendMarkup(hits);
        createGallery();
        showMessage(typeSuccess, `Hooray! We found ${totalHits} images.`);
        showBtn();
      }
    })
    .catch(showError);
}

function onFindMore() {
  apiService
    .fetchFalleryImg()
    .then(({ hits, totalHits }) => {
      appendMarkup(hits);
      createGallery();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
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
  return hits
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
    .join(' ');
}

function clearMarkup() {
  gallery.innerHTML = '';
}

function showMessage(type, message) {
  Notiflix.Notify[type](message);
}

function showError() {
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

function toggleBtn() {
  btnFindMore.hidden = !btnFindMore.hidden;
}

function createGallery() {
  let simpleLightBox = new SimpleLightbox('.gallery__item a', {
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
}