// This whole js file is basically for minimise and maximise buttons functionality and close
const contactPage = document.querySelector(".open-contact-page");
const contactIcon = document.querySelector(".contact-page");
const close = document.querySelector(".closeBTnContact");
const aboutPagebtn = document.querySelector(".about-page-btn");


// Contact page button that will display the contact page and close button that will close the window
contactIcon.addEventListener("click", openContact);
close.addEventListener("click", closeContact)

function openContact() {
    zIndexNew++;
    contactPage.classList.remove("d-none")
    contactPage.style.zIndex = zIndexNew;
}

function closeContact() {
    resetheightandWidth(contactPage)
    contactPage.classList.add("d-none")
    zIndexNew = 1;

}

// Maximize button
const maximizeBtn = document.querySelector(".maximize");
const minimizeBtn = document.querySelector(".minimize");



// Function that will change to width and height to chosen values, this function will be called once a maximise button will be called
function changeWindowheightAndWith(targetwindow, width, height) {
    targetwindow.style.width = `${width}%`;
    targetwindow.style.height = `${height}vh`;
}


// Reseting the window to it's original size, this function will be called once a minimise button is clicked
function resetheightandWidth(targetwindow) {
    targetwindow.style.width = "";
    targetwindow.style.height = "";
}


// Open Folder maximise button
maximizeBtn.onclick = function () {
    changeWindowheightAndWith(openFolderContainer, 100, 100) //make the main container openfolder expand to full width and height
    changeWindowheightAndWith(artPiecesCategories, "", 80) //Make the inner container inside the open folder container to enlarge to a 80vh, the container that has categories and art piecces displayed
}

// Open Folder minimise button resets the width and height
minimizeBtn.onclick = function () {
    resetheightandWidth(openFolderContainer) /
        resetheightandWidth(artPiecesCategories)
}

// Buttons of the contact page
const maximizeNotepad = document.querySelector(".maximizeNotepad");
const minimizeNotepad = document.querySelector(".minimizeNotepad");
maximizeNotepad.onclick = function () {
    changeWindowheightAndWith(contactPage, 100, 100)
}
minimizeNotepad.onclick = function () {
    resetheightandWidth(contactPage)
}

//Pop up window of the art piece clicked
const photo = photoContainer.querySelector(".photo");
const enlarge = document.querySelector(".enlarge");
let clicks = 0;
enlarge.onclick = function () {
    clicks++
    changeWindowheightAndWith(photoContainer, 100, 100)
    changeWindowheightAndWith(photo, "", 85)
    enlarge.src = "./icons/minimize_arrows.svg";

    if (clicks == 2) {

        resetheightandWidth(photoContainer)
        resetheightandWidth(photo)
        enlarge.src = "./icons/full-screen-selector.svg";
        clicks = 0;
    }
}


// ABOUT page
const aboutPage = document.querySelector(".open-about-page");
const closeBtnAbout = document.querySelector(".closeBTnAbout");
const maximizeNotepadAbout = document.querySelector(".maximizeNotepadAbout");
const minimizeBtnAbout = document.querySelector(".minimizeNotepadAbout");

aboutPagebtn.onclick = function () {
    zIndexNew++;
    openAboutPage()
}

const openAboutPage = () => {
    aboutPage.classList.remove("d-none");
    aboutPage.style.zIndex = zIndexNew
}

closeBtnAbout.onclick = function () {
    aboutPage.classList.add("d-none");
    zIndexNew = 1;
}

minimizeBtnAbout.onclick = function () {
    resetheightandWidth(aboutPage);

}

maximizeNotepadAbout.onclick = function () {
    changeWindowheightAndWith(aboutPage, 100, 100)

}