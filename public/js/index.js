import { mapbox } from './mapbox.js';
import { login, logout, signup } from './login.js';
import { updateSetting } from './updateUser.js';
import { bookNow } from './checkout.js';
const mapBoxElement = document.getElementById('map');
const formElement = document.querySelector('.form--login');
const signupFormElement = document.querySelector('.form--signup');
const logoutElement = document.querySelector('.nav__el--logout');
const updateFormElement = document.querySelector('.form-user-data');
const updatePasswordElement = document.querySelector('.form-user-password');
const bookNowElement = document.getElementById('book-tour');

//if the element exists, then invoke following code.
//this is for map box

if (mapBoxElement) {
  const locations = JSON.parse(mapBoxElement.dataset.locations);
  mapbox(locations);
}
//this is for logging form
if (formElement) {
  formElement.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
//this is for signing in user
if (signupFormElement) {
  signupFormElement.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('passwordCon').value;
    const name = document.getElementById('name').value;
    console.log(name, email, password, passwordConfirm);
    login(name, email, password, confirmPassword);
  });
}

//this is for logging out form

if (logoutElement) {
  logoutElement.addEventListener('click', (event) => {
    event.preventDefault();
    logout();
  });
}
//this is for updating user via form input

if (updateFormElement) {
  updateFormElement.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('email', document.getElementById('email').value);
    formData.append('name', document.getElementById('name').value);
    formData.append('photo', document.getElementById('photo').files[0]);

    updateSetting(formData, 'data');
  });
}
//this is for updating password via form input
if (updatePasswordElement) {
  updatePasswordElement.addEventListener('submit', (event) => {
    event.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    updateSetting({ passwordCurrent, password, passwordConfirm }, 'password');
  });
}
//this is for checkout page
if (bookNowElement) {
  bookNowElement.addEventListener('click', (event) => {
    event.preventDefault();
    bookNowElement.innerHTML = 'Processing...';
    const { tourId } = event.target.dataset;
    console.log(tourId);
    bookNow(tourId);
  });
}
