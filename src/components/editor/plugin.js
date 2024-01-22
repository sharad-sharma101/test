

function handleFavClick(){
    // Get the product-media__favourite-icon element
const favIcon = document.querySelector('.product-media__favourite-icon');

// Add onclick event listener to the element
favIcon.addEventListener('click', function() {
  // Add the class 'added-to-favourite' to the element
  favIcon.classList.add('added-to-favourite');
});
}

const sliderContainer = document.querySelector('.recommendation-container__slider__wrapper');
const leftArrow = document.querySelector('.recommendation-container__slider-icon.left');
const rightArrow = document.querySelector('.recommendation-container__slider-icon.right');

let scrollPosition = 0;

rightArrow.addEventListener('click', function() {
    scrollPosition += 400; // Change this value to adjust the scroll amount
    sliderContainer.scroll({
      left: scrollPosition,
      behavior: 'smooth'
    });
  });

  
  leftArrow.addEventListener('click', function() {
    scrollPosition -= 400; // Change this value to adjust the scroll amount
    sliderContainer.scroll({
      left: scrollPosition,
      behavior: 'smooth'
    });
  });


  