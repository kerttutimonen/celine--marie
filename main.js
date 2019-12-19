// When the window is loaded all the dynamic content is created and appended to the right places
// The pop up window when an image is clicked is not a template, it changes it's values simpy by rewriting it's values with a function

const categoryFolderTemplate = document.querySelector(".category-folder-template").content; //Template Mark up of the category folder (Folder icon and category name)
const artCategories = document.querySelector(".categories"); //Place to append the main menu categories/folders(the categories you see on the landing page)
const artPieceTemplate = document.querySelector(".art-piece-template").content; //Template for the art piece which has image of art and name 
const pathTemplate = document.querySelector(".path-template").content; //The template for the folder path to append, that is  an arrow and name of the clicked category/subcategory
const subCategoryTemplate = document.querySelector(".sub-category-template").content; //This is a template that is for subcategories, the main difference between categories and subcategories template is that subcategory template has a place to append the art pieces
const artPiecesCategories = document.querySelector(".art-pieces-categories"); //The container where it s displayed categories subcategories when a folder is open
const spinner = document.getElementById("spinner"); //preloader selected
const body = document.querySelector("BODY"); // The body element
const openFolderContainer = document.querySelector(".open-folder-container") //It is the container that shows up once a main category is open and basically containes all the content
const folderPath = document.querySelector(".path-to-the-folder"); //The folder path container
const backArrow = document.querySelector(".back-arrow"); //Arrow that allows to go back between the folders
const thisPCBtn = document.querySelector(".thispc") //It's the this pc option to click in the folder path
const infoPopUp = document.querySelector(".info-pop-up"); // the pop up window that shows up once an art piece is clicked
const photoContainer = document.querySelector(".photo-container") // The pop up window that shows up once a art piece is clicked
const closeImg = document.getElementById("closeImg"); //An X/close icon of the popup window window that shows up once a art piece 
let zIndexNew = 1; //The zindex is incremented on the elements that the windows that are clicked to be always on top

window.addEventListener("DOMContentLoaded", init) //Once the  HTML has loaded, it will call the init function

//A close button of the container that shows up once a category is clicked
document.querySelector(".closeBTn").onclick = function () {
  zIndexNew = 1;
  resetheightandWidth(openFolderContainer) //This function is is being called to reset the size of the open folder container
  resetheightandWidth(artPiecesCategories) //this function is is being called to reset the size of the container inside the open folder container where all the categeories/images displayed
  openFolderContainer.classList.add("d-none"); //It will close the open folder container
  while (folderPath.firstChild) { // this is checking if the folder path has any appended elements/children
    folderPath.removeChild(folderPath.firstChild); //If it does not have any more elements left inside the folderpath container the while loop will end and clear the folder path.
  }
}


const popupWindowOk = document.querySelector(".info-pop-up-ok") //OK Button inside the pop up Information window
popupWindowOk.onclick = function () {
  infoPopUp.classList.add("d-none"); // Once the OK button is clicked the modal/infoPopUp will be closed
}


const popupWindowClose = document.querySelector(".info-pop-up-closeBtn") //It's a close button of the Information popup window 
popupWindowClose.onclick = function () {
  infoPopUp.classList.add("d-none"); // Once the close button is clicked the modal/infoPopUp will be closed
}



closeImg.onclick = function () { //Close button of the modal that shows up once an art piece is clikced, that shows the larger version of the image
  const images = document.querySelectorAll(".art-piece") //selects all the art pieces that are already appended 
  photoContainer.style.display = "none"; //The pop up window that showed up as the image was clicked is closed
  infoPopUp.classList.add("d-none"); //If the popup window with image Information was not closed, it will be closed now
  images.forEach(img => { //For each method to go through all the art pieces
    img.classList.remove("active"); //Remove the class active from any art piece that has a class active, which was added once the image was clicked
  })
  resetheightandWidth(photoContainer) //resets the photoContainer width and height, back to normal, in case it was maximised to full screen
  resetheightandWidth(photo) // resets the heigh and with of the photo in case it was maximised to full screen
  nextFoto.style.visibility = "visible"; //The arrow that lets you see the next art piece visisbility is set back to being visisble
  previousPhoto.style.visibility = "visible"; // The arrow that lets you see the previous art piece visisbility is set back to being visisble
}

function init() { //The function that is called on window event
  spinner.removeAttribute('hidden'); //preloader shows up
  fetch("https://timidesign.org/kea/wordpress-excersize/wordpress/wordpress/wp-json/wp/v2/art_categories").then(res => { //fetching 
    return res.json() //Getting the response
  }).then(data => { //Takes json response 
    spinner.setAttribute('hidden', '') //Hides the spinnner/preloader
    cloneNotepad(); //Function that will copy notepadIcon and assign functionality for it to show contact information
    cloneNotepadAbout() //Function to append abuut page icon and assign functionality to show about page once it's clicked
    addVideobtn() // adds video btn clone and assigns functionality to show video once it's clicked
    data.forEach(category => { //handle the data from json
      getCategories(category, artCategories); //this function created the main categories that you see on the landing page
      createSubcategories(category, artPiecesCategories) //This function creates the html markup for categories with subcategories and art pieces inside and appends it to the  open folder container place-artPiecesCategories
    })

  }).then(() => {
    const subCategoryBtns = document.querySelectorAll(".subcategory-icon-and-name")
    subCategoryBtns.forEach(btn => {
      btn.onclick = function () {
        zIndexNew++;
        let canBeAddedTothePath = true;
        clickedFolder(btn, canBeAddedTothePath) //function that will display the correct folder and calls a function to change the path name
        path() //function that one a path btn is clicked the path will be cleared out untill the clicked button it's called here cause only here you can access all the added btns
      }
    })


    document.querySelectorAll(".category-folder").forEach(btn => btn.onclick = function () { //This is selecting already appeneded main categories on the landing page and adds onclick function
      while (folderPath.firstChild) { // this is checking if the folder path has any appended elements/children
        folderPath.removeChild(folderPath.firstChild); //If it does not have any more elements left inside the folderpath container the while loop will end and clear the folder path.
      }
      zIndexNew++;
      let canBeAddedTothePath = true; //A variable whose state is used to check if the name of the clicked item should be appended to the folder path or not
      clickedFolder(btn, canBeAddedTothePath) //Once a category is clicked it's name is being appended to the folder path and this function displays correct content according the clicked folder
      path() //This function is called to clear out the folder path until the clicked name on the folder path and it makes sure that the same name was not added again in the folder path
    })




    //This Pc button is added in html mark up, so once it's clicked the folder path place where the folder path is changed, when the clicked folder names are appended it will be cleared out, leaving just this pc displayed
    thisPCBtn.onclick = function () { //The button in the folder path that is for displaying in the open folder the elements that are on the landing page
      let canBeAddedTothePath = false; //The variable that is set to false that makes sure that the name of This pc would not be added to the folder path again
      clickedFolder(thisPCBtn, canBeAddedTothePath) //This function will display the correct content in the open folder container
      while (folderPath.firstChild) { //this is checking if the folder path has any appended elements/children
        folderPath.removeChild(folderPath.firstChild); //It will remove all the elements from the forlder path util this PC
      }
    }
  })

  backArrow.onclick = function () { //The button that let's you go back in the open folder
    const parent = document.querySelector(".art-pieces-categories"); //Selects the parent container where the categories/subactegories/art pieces are appended
    const artPieces = document.querySelectorAll(".artPieces"); //Selects all the art pieces
    const lastChildOfFolderPath = folderPath.querySelector(".pathNameAndIcon:last-child") //selects the last pathName on the folder path

    const allFolderPathWords = folderPath.querySelectorAll(".pathNameAndIcon") //selects all the appended folder path names, that where appended by clicking through folders
    folderPath.removeChild(lastChildOfFolderPath); //removes the last name in the folder path

    let folder; //variable that will contain the value of the name that is second to last in the folder path before removing the last name in the foler path
    if (allFolderPathWords.length == 1) { //Checks how many elements the folder path contains if it is 1 
      folder = thisPCBtn; //The folder will be equeal to this pc value, that is in the folder path
    } else {
      folder = allFolderPathWords[allFolderPathWords.length - 2]; //If there are more values in the array of the folder path, the folder will be equal to the second to last value in the folder path
    }
    let canBeAddedTothePath = false; //Since it is false the value will not be added to the folder path
    clickedFolder(folder, canBeAddedTothePath); //The fucntion that will show the correct content in the open folder container is called with either This pc button or second to last value in the folder path
  }
}



function cloneNotepad() { //This function is call in the init function to clone append the contact button to the open folder container, you can see this icon when you click on this pc or back arrow
  const clnContact = document.querySelector(".contact-page").cloneNode(true); //clones the contact btn from the landing page categories
  clnContact.classList.add("subcategory-file") //adds a class that helps to style the button to fit into open folder container
  clnContact.addEventListener("click", openContact); //Assign the same function as the one on the landing screen has
  artPiecesCategories.appendChild(clnContact); //Appends the clone to the openfolder container where the main categories are appended
  zIndexNew = 1;
}

function cloneNotepadAbout() { //This function is call in the init function to clone append the about button to the open folder container, you can see this icon when you click on this pc or back arrow
  const clnAboutbtn = aboutPagebtn.cloneNode(true); //clones the about btn from the landing page categories
  clnAboutbtn.classList.add("subcategory-file") //adds a class that helps to style the button to fit into open folder container
  clnAboutbtn.addEventListener("click", openAboutPage); //Assign the same function as the one on the landing screen has
  artPiecesCategories.appendChild(clnAboutbtn); //Appends the clone to the openfolder container where the main categories are appended
  zIndexNew = 1;
}


const videoPageBtn = document.querySelector(".video-page-btn") //Button on the landing screen that once clicked shows video vidow
const closeBTnvideo = document.querySelector(".closeBTnvideo"); //The close button of the video window
const videoContainer = document.querySelector(".open-video-container"); //the video window

videoPageBtn.onclick = function () { //once the video button on the landing page is clicked
  zIndexNew++;
  showVideo() //calls a function that will display the video widow by removing d-none class;
}


function showVideo() { //function that will remove display none class from video window
  videoContainer.classList.remove("d-none");
  videoContainer.style.zIndex = zIndexNew;
}

closeBTnvideo.onclick = function () { //The video window close button on click function
  zIndexNew = 1;
  videoContainer.classList.add("d-none"); //Adds a display none class to the video window

}


function addVideobtn() { //This function is call in the init function to clone append the video button to the open folder container, you can see this icon when you click on this pc or back arrow
  const videoPageBtncln = videoPageBtn.cloneNode(true); //clones the video btn from the landing page categories
  videoPageBtncln.classList.add("subcategory-file") //adds a class that helps to style the button to fit into open folder container
  videoPageBtncln.addEventListener("click", showVideo); //Assign the same function as the one on the landing screen has/show the video
  artPiecesCategories.appendChild(videoPageBtncln); //Appends the clone to the openfolder container where the main categories are appended
}


function path() {
  const pathNameBtns = document.querySelectorAll(".pathNameAndIcon") //Selects all the appened names to the folder path
  pathNameBtns.forEach(pathName => { //Goes through each folder path name
    pathName.onclick = function () { //Once a name in the folder path is clicked
      let canBeAddedTothePath = false; //This variable will set the the clicked name would not be added again
      let siblingNode = pathName.nextSibling; //Selects the sibling og the clicked name in the folder path

      clickedFolder(pathName, canBeAddedTothePath) ///function that will display the correct folder and folder path will not be changed since canBeAddedTothePath = false
      while (siblingNode) { //it will check if the clicked name in the path still has a sibling
        siblingNode = pathName.nextSibling; //Keeps selecting the next sibling
        folderPath.removeChild(siblingNode); //Deletes the sibling, that the folder path would only be until the clicked name in the folder bath
      }
    }
  })
}



function clickedFolder(folder, canBeAddedTothePath) {
  const artPiecePlaces = document.querySelectorAll(".artPieces") //Selects all the appended art pieces
  openFolderContainer.classList.remove("d-none"); //removes the display none class from the open folder container
  openFolderContainer.style.zIndex = zIndexNew;
  const folderName = folder.querySelector(".name").textContent.toLowerCase().split(' ').join(''); //makes sure that the name would be lower case and without gaps 
  if (canBeAddedTothePath == true) { //It is checking if the clicked button's name should be appended to the folder path
    getCustomPath(folderName) //Changes the file path by addind the name of the clicked folder
  }

  artPiecePlaces.forEach(artPlace => { //Iterates through all ar pieces 
    if (artPlace.classList.contains(folderName)) { //First checks for the artPlace if it has the class name as the clicked button name
      artPlace.querySelectorAll(".subcategory-icon-and-name").forEach(p => p.style.display = "flex") //returns display to all the subcategory folders
      if (artPlace.classList.contains("art-pieces-categories")) { //If the art place has the main class/Checks basically if it's the top hierarchy level
        artPlace.style.display = "flex"; //display the container
        artPlace.querySelectorAll(".subcategory-file").forEach(sub => sub.style.display = "flex"); //Display all the files(notepad, video)
      } else { //If it is not the top hierarchy folder
        artPlace.style.display = "flex"; //Change display property to flex from none
        artPiecesCategories.style.display = "block"; //Make sure that the top folder is displayed
        while ((artPlace = artPlace.parentElement) && !artPlace.classList.contains("art-pieces-categories")) //While it is not the top layer
          artPlace.style.display = "flex"; //Make sure that every top layer is being displayed, otherwise if any of artPlace parent element has display none property the elements won't be displayed
      }
    } else { //if the artPlace does not have the class as the clicked button name 
      artPlace.style.display = "none"; // do not display it
      artPlace.querySelectorAll(".subcategory-icon-and-name").forEach(p => p.style.display = "none") //and do not display anything inside the container
      artPlace.querySelectorAll(".subcategory-file").forEach(b => b.style.display = "none");

    }
  })
}

function getCustomPath(folder) { //This function will create custom folder paths
  const clnpathTemplate = pathTemplate.cloneNode(true); //Clones the path template
  clnpathTemplate.querySelector(".path-name").textContent = folder; //assigns the name of the clicked button/folder
  folderPath.appendChild(clnpathTemplate) //Appends the cln to the folder path place;

}



function getCategories(category, placeToAppend) { //Function that is called to create the main categories on the landing page (art/illustrations)
  let clnMenuFolder = categoryFolderTemplate.cloneNode(true); //Clones the template
  let categoryName = clnMenuFolder.querySelector(".category-name") //Adds a class 
  categoryName.textContent = category.title.rendered.toLowerCase() //Adds and formats the text to be lower case
  let imagesInsideFolderIcon = clnMenuFolder.querySelector(".images-inside-folder-icon"); //TheFolder icon
  let categoryFolder = clnMenuFolder.querySelector(".category-folder"); //The category folder container/folder icon and name of the category
  categoryFolder.onclick = function () { //Once the folder of category is clicked the openfolder container will be shown
    openFolderContainer.classList.remove("d-none"); //The open folder container is showed by removing display none class
  }
  placeToAppend.appendChild(clnMenuFolder); //The categories are appended to the art categories place in the landing page menu
}


//This function creates the categories with subcategories that then have a subcategory folder displayed and another folder with art pieces;
//This function creates a hierarchy with main categories as parent folders and subcategory and art piece list as well as a subcategory of the main category;
function createSubcategories(category, placeToAppend) { //This function is called in the init function with json data
  const clnsubCategoryTemplate = subCategoryTemplate.cloneNode(true); //Selects the subcategory template, because this template is appended in the open folder container
  //To assign the name, the function getTheName is called because sometime the name was either category.post_title or category.renedered, 
  //this function checks the path to the title in the json and returns the correct name for the category, that is also formated to be lowercase
  clnsubCategoryTemplate.querySelector(".subCategoryName").textContent = getThename(category); //Assign the name of the category/subcategory
  clnsubCategoryTemplate.querySelector(".subcategory").classList.add(getThename(category)); //Add the class with the same name as the category name
  const artSubcategory = clnsubCategoryTemplate.querySelector(".artSubcategory") //Select the place where subcategories will be appeneded
  artSubcategory.classList.add(getThename(category)) //Adds a class name as the category
  const artPiecesLists = artSubcategory.querySelector(".artPieces") //Selects the place where art pieces or subcategories will be appended
  artPiecesLists.classList.add(getThename(category)) //Adds the class name as the category

  if (category.subcategory_id) { //Checks if in the json the category/subcategory has subcategories
    category.subcategory_id.forEach(sub => { //For each subcategory
      const clnsubCategoryTemplate = subCategoryTemplate.cloneNode(true); //It will basicaly once again create another subcategory
      clnsubCategoryTemplate.querySelector(".subCategoryName").textContent = getThename(sub); //Gets the subcategory name
      clnsubCategoryTemplate.querySelector(".subcategory").classList.add(getThename(sub)); //Assigns the name of the subcategory
      const artSubcategoryInner = clnsubCategoryTemplate.querySelector(".artSubcategory"); //Selects a place where the subcategory folder will be appended
      artSubcategoryInner.classList.add(getThename(sub))
      const artPiecesListsInner = artSubcategoryInner.querySelector(".artPieces") //Select a place where the ar pieces will be appended
      artPiecesListsInner.classList.add(getThename(sub)) //Assign a class name of the subcateogry name
      getTheArtPieces(sub, artPiecesListsInner) //Appends all the art pieces that belong to the subcategory in the subcategory art piece place
      artPiecesLists.appendChild(clnsubCategoryTemplate) //Appends the subcategory 
    })
  } else if (category.art_category_id) { //If the category has ar piece list
    getTheArtPieces(category, artPiecesLists) //It will call a function that will append all the art pieces artPiecesLists
  }

  placeToAppend.appendChild(clnsubCategoryTemplate); //Appends category to the place it was assigned to
}


//This function is called when wanting to apped the art pieces, to either category artplace or subcategory art place
//Because main category Illustration has art pieces in the different path and type that the subcategories this function selects the correct path and 
//Calls a function that will generate and append art pieces to the correct place
function getTheArtPieces(category, placeToAppendTo) { // This function checks if the art pieces are array on an object with other objects and then need to convert it to array
  if (category.art_category_id) { //The main category Illustrations has the art pieces in json witha path to an array
    category.art_category_id.forEach(artPiece => { //Eahc of the art piece json data is then used
      showArtPieceList(artPiece, placeToAppendTo) //The function will clone and append the art pieces to the selected place for the art pieces

    })
  } else if (category.art_piece_id) { //The subcategories withtin art category had the art pieces in an object with other objects inside 
    const convertedArtArray = Object.keys(category.art_piece_id).map(i => category.art_piece_id[i]) //Object with art pieces that were objects as well was converted to array
    convertedArtArray.forEach(artPiece => { //The converted array then was used with for each loop and 
      showArtPieceList(artPiece, placeToAppendTo) //The art pieces were created and appended to the correct place
    })
  }
}



function showArtPieceList(piece, placeToAppendTo) {
  let artPieceCln = artPieceTemplate.cloneNode(true); //Clones a template of the art piece that includes(image, name, year, short description)
  artPieceCln.querySelector(".art-piece-name").textContent = piece.post_title.toLowerCase() //Name of the art piece
  artPieceCln.querySelector(".art-piece-large-icon").src = piece.featured_image.guid //Sets image sourse

  artPieceCln.querySelector(".art-piece-large-icon").setAttribute("alt", `${piece.post_title.toLowerCase()}`); //Sets the alt attribute to the image
  artPieceCln.querySelector(".descirption").textContent = piece.post_excerpt; //Set the description that is shown once the image is clicked
  artPieceCln.querySelector(".year").textContent = piece.year; //Sets the year that is displayed once image is clicked

  //This is a part that is ment to show the popup window when the art piece is clicked
  const artPiecePhotoandName = artPieceCln.querySelector(".art-piece") //Selects the art piece (image/name markup)
  artPiecePhotoandName.onclick = function () { //Once an image is clicked
    artPiecePhotoandName.classList.add("active"); //That clicked image gets a class of active
    switchBetweenImages(false); //The false passed as a parameter means that the art piece won't be pushed to the next one once an art piece is clicked
    infoPopUp.classList.remove("d-none"); //Shows the art piece information window
    photoContainer.classList.remove("d-none"); //Shows the modal with art piece in the larger version
    photoContainer.style.display = "flex"; //Set the display value the modal with art piece in the larger version
    photoContainer.style.zIndex = zIndexNew;
    infoPopUp.style.zIndex = zIndexNew + 2;
    popUpIwndows(artPiecePhotoandName) //This function reasigns values of the current ar tpiece that is displayed when switching between the art pieces

  }
  placeToAppendTo.appendChild(artPieceCln) // Place to append is div with artPieces inthe category or subcategory
}


//The fields in that will be changed in the popup information and the larger version of the art piece modal
const infoPopUpName = infoPopUp.querySelector(".art-piece-name")
const infoPopUpArtPieceInfo = infoPopUp.querySelector(".art-piece-info")
const infoPopupArtPieceYear = infoPopUp.querySelector(".art-piece-year")
const photoContainerPhotosrc = photoContainer.querySelector(".photo")
const photoHeader = photoContainer.querySelector(".photoHeader h4");


//this function will reasign values for the image.sr etc in the art piece modal once the art piece is clicked and the information popup window
function popUpIwndows(artPiecePhotoandName) {
  infoPopUp.classList.remove("d-none"); //Shows The infomation popup window
  photoContainer.zIndex = zIndexNew;
  infoPopUp.style.zIndex = zIndexNew + 2;
  infoPopUpName.textContent = artPiecePhotoandName.querySelector(".art-piece-name").textContent
  infoPopUpArtPieceInfo.textContent = artPiecePhotoandName.querySelector(".descirption").textContent
  infoPopupArtPieceYear.textContent = artPiecePhotoandName.querySelector(".year").textContent
  photoContainerPhotosrc.src = artPiecePhotoandName.querySelector(".art-piece-large-icon").src
  photoContainerPhotosrc.setAttribute("alt", `${artPiecePhotoandName.querySelector(".art-piece-name").textContent}`);
  photoHeader.textContent = artPiecePhotoandName.querySelector(".art-piece-name").textContent
}


const previousPhoto = document.querySelector(".arrowPreviousPhoto");
const nextFoto = document.querySelector(".arrowNextPhoto")

const arrowPhotos = document.querySelectorAll(".arrowPhoto");

arrowPhotos.forEach(arrow => { //Arrows that help to switch between the art pieces 
  arrow.onclick = function () {
    switchBetweenImages(true, arrow); //The true means that once the arrow is clicked the active class will be moved to the next art piece and the next or previous ar piece is displayed
  }
})


//This function is the "galery" where you can switch between the art pieces and according information is inserted to the information popup window and photo container
function switchBetweenImages(statusToMoveTheActiveClass, btn) {
  const images = document.querySelectorAll(".art-piece") //Selecting all the art pieces that were appeded
  const activeImg = findActiveImg(images); //Finds the art piece with the active class 
  const arrayOFtheImgWithinActiveImg = getTheImgArrayWithinActiveImg(activeImg); //Finds all the art pieces within the same category/subcategory
  let indexImg = arrayOFtheImgWithinActiveImg.indexOf(activeImg) // Gets the index/ position of the active img within an array of the images;
  if (statusToMoveTheActiveClass && btn.classList.contains("arrowPreviousPhoto")) { //If the status is true and the clicked button has class list or arrowPreviousPhoto 
    indexImg-- //The index will be minused
  } else if (statusToMoveTheActiveClass && btn.classList.contains("arrowNextPhoto")) { //If the status is true and the clicked button has class list or arrowNextPhoto 
    indexImg++ //The index will be incemented

  } else {
    console.log(false); //Else just return false
  }

  if (indexImg == 0) { //Checks the clicked image index if it is 0
    previousPhoto.style.visibility = "hidden"; //If the clicked image is first in it's collection, the arrow to switch to previous image will not be displayed
  } else if (indexImg == arrayOFtheImgWithinActiveImg.length - 1) { //ckecks if the index of the clicked image is last
    nextFoto.style.visibility = "hidden"; ////If the clicked image is last in it's collection, the arrow to switch to next image will not be displayed
  } else { //If the image nor last or first in the collection 
    //make the next arrow and previous arrow to be shown;
    nextFoto.style.visibility = "visible";
    previousPhoto.style.visibility = "visible";

  }

  //This part of the code takes the value of the indexImg depending wheather the previous photo or next photo arrow was clicked and changed the indexImg value
  arrayOFtheImgWithinActiveImg[indexImg].classList.add("active"); //Select the element that has the index of indexImg, which was either changed or not and add the class active
  popUpIwndows(arrayOFtheImgWithinActiveImg[indexImg]) //Call a function that will then change the values in the modal of displaying the larger version of art piece and information popup 

}

//This will find an art piece with the class active, that was assign to the art piece that was clicked on
const findActiveImg = (images) => {
  let activeImg;
  images.forEach(img => { //Goes through all the art pieces
    if (img.classList.contains("active")) { //check for art pieces with a class Active
      img.classList.remove("active"); //Find the image and remove the class active
      activeImg = img; //The declared variable is now assigned to be to the art piece
    }
  })
  return activeImg //returns the art piece will the active class
}

//This will return the array by selecting the parent of the art piece with the active class, and then select all the direct children with art-piece class 
const getTheImgArrayWithinActiveImg = (image) => {
  const parent = image.parentElement //Find the parent element of the img with a class active
  const parentArtPieces = parent.querySelectorAll(".art-piece") //Select all the art-piece eleements within the parent element
  const parentArtPiecesAray = Array.from(parentArtPieces) //Convert the node list of parentArtPieces to array, to be able to use array method indexOf
  return parentArtPiecesAray //Returns array of art pieces
}


//The function that will get the name/ post tytle according to the path in json
const getThename = (category) => {
  let nameOf;
  if (category.post_title) {
    nameOf = category.post_title.toLowerCase().split(' ').join('');
  } else if (category.title.rendered) {
    nameOf = category.title.rendered.toLowerCase().split(' ').join('');
  }
  return nameOf
}