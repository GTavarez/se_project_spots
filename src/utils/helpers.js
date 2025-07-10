// export function setButtonText(
//   btn,
//   isLoading,
//   loadingText = "Saving...",
//   defaultText = "Save"
// ) {
//   if (isLoading) {
//     btn.textContent = `${loadingText}`;
//   } else {
//     btn.textContent = `${defaultText}`;
//   }
// }

export function setButtonText(btn, text) {
  btn.textContent = text;
}
