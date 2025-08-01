import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
  toggleButtonState,
} from "../scripts/validation.js";
import "../pages/index.css";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const editProfileBtn = document.querySelector(".profile__edit-btn");

const editProfileModal = document.querySelector("#edit-profile-modal");

const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");

const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");

const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const editProfileSubmitBtn =
  editProfileModal.querySelector(".modal__submit-btn");
const imageCaptionInput = newPostModal.querySelector("#image-caption-input");
const imageLinkInput = newPostModal.querySelector("#image-link-input");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const previewModal = document.querySelector("#preview-modal");
const previewCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

const previewImageEl = previewModal.querySelector(".modal__image");
const previewImageCaptionEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template");

const cardsList = document.querySelector(".cards__list");
// Avatar Modal
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarBtn = document.querySelector(".profile__avatar-btn");
// Delete Modal
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".delete__form");
const deleteCancelBtn = deleteModal.querySelector(".delete__cancel-btn");
const deleteXBtn = deleteModal.querySelector(".modal__close-btn_type_delete");
deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});
deleteXBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});
//overlay clicking
editProfileModal.addEventListener("mousedown", handleOverlayClick);
newPostModal.addEventListener("mousedown", handleOverlayClick);
previewModal.addEventListener("mousedown", handleOverlayClick);
avatarModal.addEventListener("mousedown", handleOverlayClick);
deleteModal.addEventListener("mousedown", handleOverlayClick);
const api = new Api({
  baseURL: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ddc71cd9-2827-40ad-a5be-fbb3f0a4404e",
    "Content-Type": "application/json",
  },
});
let selectedCard, selectedCardId;

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    profileAvatarEl.src = userInfo.avatar;
  })
  .catch((err) => {
    alert("Could not get cards or userinfo");
    console.error(err);
  });

/* function handleLike(evt, id, isLiked) {
  const btn = evt.target;
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      btn.classList.contains("card__like-button_active");
      btn.classList.toggle("card__like-button_active");
    })
    .catch(console.error);
} */

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");

  let isLiked = data.isLiked;

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-button_active");
  }
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  cardLikeBtnEl.addEventListener("click", (evt) => {
    const btn = evt.target;
    api
      .changeLikeStatus(data._id, data.isLiked) //false
      .then(() => {
        // btn.classList.contains("card__like-button_active");
        btn.classList.toggle("card__like-button_active");
        data.isLiked = !data.isLiked;
      })
      .catch(console.error);
  });
  cardDeleteBtnEl.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewImageCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}
previewCloseBtn.addEventListener("click", () => closeModal(previewModal));

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  const inputList = Array.from(
    newPostForm.querySelectorAll(settings.inputSelector)
  );
  resetValidation(newPostForm, inputList, settings); // clear errors
  toggleButtonState(inputList, newPostSubmitBtn, settings); // ensure button is correctly disabled
  openModal(newPostModal);
});
newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});
newPostSubmitBtn.addEventListener("click", () => {
  closeModal(newPostModal);
});
avatarBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  //submitBtn.textContent = "Saving...";
  //setButtonText(submitBtn, true);
  setButtonText(submitBtn, "Saving...");
  api
    .editAvatarInfo({
      link: avatarInput.value,
    })
    .then((data) => {
      avatarInput.value = "";
      profileAvatarEl.src = data.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      //submitBtn.textContent = "Save";
      //setButtonText(submitBtn);
      setButtonText(submitBtn, "Save");
      disableButton(submitBtn, settings);
    });
}
function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const deleteBtn = evt.submitter;
  setButtonText(deleteBtn, "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteBtn, "Delete");
    });
}
function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);
function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  //submitBtn.textContent = "Saving...";
  //setButtonText(submitBtn, true);
  setButtonText(submitBtn, "Saving...");
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      //submitBtn.textContent = "Save";
      //setButtonText(submitBtn);
      setButtonText(submitBtn, "Save");
    });
}
editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAddCardSubmit(evt, settings) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  //submitBtn.textContent = "Saving...";
  //setButtonText(submitBtn, true);
  setButtonText(submitBtn, "Saving...");
  api
    .addNewCard({
      name: imageCaptionInput.value,
      link: imageLinkInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      newPostForm.reset(); // Clear the form
      disableButton(newPostSubmitBtn, settings);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      //submitBtn.textContent = "Save";
      //setButtonText(submitBtn);
      setButtonText(submitBtn, "Save");
    });
}
newPostForm.addEventListener("submit", (evt) =>
  handleAddCardSubmit(evt, settings)
);
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}
function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.target);
  }
}

enableValidation(settings);
