// use caps for a visuel distinction of variables not to be changed
// ECMAScript 2015 introducing let and const keywords changed the norm of naming convention for upper or lower case
const API_KEY = 'NB6OlK8OUcOClwOwlW7MDC495scShCID'
// The Document method querySelector() returns the first Element within the document that matches the specified selector, or group of selectors. If no matches are found, null is returned.
// fyi you can also negate class selectors by using not
// grab the search-input class in html and css
const searchEl = document.querySelector('.search-input')
// set up new variable for search hint
// we can grab the search input's value from html
const hintEl = document.querySelector('.search-hint')
// short for videos element
// grab videos class and then append our newly created video to it
const videosEl = document.querySelector('.videos')
// for our clear search button
// fyi, we cannot use innerHTML on input / form elements
// innerHtml applies to every object that can contain HTML (divs, spans, but many other and also form controls).
const clearEl = document.querySelector('.search-clear')

// when we use query selector, it's best practice to just store it once & @ the top of your doc
// we only need to use these method at the start of the script

// stackoverflow source:
// https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
// this selects a random value from an array
const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex]
}

// below code is a great way to think about JS
// isolated pieces of functionality, packaged up into functions
// usually functions that do 1 or 2 things, not too hefty

// below, we are taking in the source attribute, creates us a video element, attaches the source, sets autoplay and looping video
function createVideo(src) {
  const video = document.createElement('video')

  video.src = src
  //autoplay attribute
  video.autoplay = true
  // video loops
  video.loop = true
  // create and set a new class using JavaScript
  // caution: it overwrites classes!
  video.className = 'video'
  return video
}

// 1. reveal loading spinner by adding a class to the body
// 2. change the loading hint to 'see more'
// 3. let user know of an error if necessary
// our function below deals with showing and hiding our loading state

const toggleLoading = state => {
  console.log('we are loading', state)
  // in here we toggle the page loading state between loading and not loading

  // when the loading class name is added to the body, the opacity toggles to 1 from 0
  // if else, opacity goes back to usual 0
  if (state) {
    document.body.classList.add('loading')
    // disables input for users whilst searching
    searchEl.disabled = true
  } else {
    document.body.classList.remove('loading')
    // here, we enable input again
    searchEl.disabled = false 
    searchEl.focus()
  }
}

// we will be working with mp4 videos
// they are more performant in terms of file size
// they will also be easier to load and have more control
// a lof of gif images you see online are actually videos
// gifs are not the most compact file type

// we will need to log whatever is typed in the input so that we can send it to the GIPHY API query
// each time something is typed, we run an event

// this new function takes searchTerm as an argument
// the web page will only run the wrapped code when we run the searchGiphy function
// in the line below, we call to the searchGiphy function and log out the searchTerm
const searchGiphy = searchTerm => {
  // this is the body of our function
  // here we toggle our loading screen to the user knows something is happening
  toggleLoading(true)
  // you can concatenate either with a plus sign or comma
  console.log('search for', searchTerm)
  // AJAX = Asynchronous JavaScript And XML
  // web applications can send and retrieve data from a server asynchronously without interfering with the display and behaviour of the existing page
  // here, we put our url into a fetch (fetch method)
  // this is called a promise
  // we use .then() to handle the response
  // NEXT, we wrap the fetch block of code in its own function
  // the purpose of the function is to search from giphy, get us our video, and appent it onto the page
  // we use grave accents in our template string below in order to embed our API_KEY and searchTerm variables
  // for each search we make, the searchTerm portion will be different
  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=r&lang=en`
  )
    .then(response => {
      // convert response to json
      return response.json()
    })
    .then(json => {
      // 'json' is a JavaScript object
      // call randomChoice function to give us back a random result from the array of images
      const gif = randomChoice(json.data)
      // the original mp4 src
      // here, we look inside of the images 
      // and explore the api data response to find an mp4
      const src = gif.images.original.mp4
      // here, we use our createVideo function, which we give the source attribute to
      // and it gives us back a video
      const video = createVideo(src)
      // append child lets us insert an element at the end of the html
      videosEl.appendChild(video)
      // here we listen out for the 'loadeddata' aka video event to fire
      // when it's loaded we'll display it on the page using a class that triggers a transition effect from CSS
      video.addEventListener('loadeddata', event => {
        // this toggle the fade in effect of our videos
        video.classList.add('visible')
        // here we add a 'has-results' class to toggle the close button
        // innerHTML property modifies content of an element
        // we use grave accents to be embed a variable inside this string
        // the string below is called a template string
        hintEl.innerHTML = `Hit enter to continue searching "${searchTerm}"`
        document.body.classList.add('has-results')
        // here we toggle the loading state off
        toggleLoading(false)
      })
    })
    // when our code above has finished and when its done the fetch, grab the gif, put it onto the page, we then toggle the loading state off again
    .catch(error => {
      // lastly, we use .catch() to do something in case our fetch fails
      // here, we toggle the loading state so that it's disabled
      toggleLoading(false)
      hintEl.innerHTML = `Nothing found for "${searchTerm}"`
    })
}

// the event keyword gives us a snapshot of all the data related to our event
// below, we've separated our keyup function
// we can call to that function in various places in our code
// const doSearch = event => {
// execute search when enter key is pressed
// find the "key" via console.log(event)
// or test with an if loop
// if (event.key === 'Enter') {
// console.log('pressed enter')
// }
// }
// everytime the key goes up, this function runs
const doSearch = event => {
  // here, we grab the search term and the search input's value
  const searchTerm = searchEl.value
  // we want our search hint to appear when we start typing / have a search term
  // we also want the hint to transform to the word being typed in that moment
  // (as long as its 3+ charachters)
  if (searchTerm.length > 2) {
    hintEl.innerHTML = `Hit enter to search ${searchTerm}`
    // use body tag for the page
    // create a new class named show-hint
    // enable the body page to use an effect from CSS
    document.body.classList.add('show-hint')
  } else {
    // above, we create an if...else statement
    // do opposite of if and hint fades away
    document.body.classList.remove('show-hint')
  }
  // 3+ character minimum to search PLUS enter key hit, then we search...
  if (event.key === 'Enter' && searchTerm.length > 2) {
    // ... by calling to the searchGiphy function and pass along the searchTerm with it
    searchGiphy(searchTerm)
  }
  // this replaces the query in our fetch above
}

const clearSearch = event => {
  // remove body class and toggles results class off
  document.body.classList.remove('has-results')
  // below, we reset all the content on our video and hint element
  videosEl.innerHTML = ''
  hintEl.innerHTML = ''
  // set the value to be an empty string
  searchEl.value = ''
  // call focus on the search element (input)
  // The HTMLElement.focus() method sets focus on the specified element, if it can be focused.
  // The focused element is the element which will receive keyboard and similar events by default.
  searchEl.focus()
}

// add more interactivity and UI to our site
// listen for keyup events globally across the whole page
// we use the document keyword and attach the addEventListener to it
document.addEventListener('keyup', event => {
  if (event.key === 'Escape') {
    // call the clear search function that we isolated above
    clearSearch()
  }
})

// below are callbacks
// one the events below have occurred, it calls to the function at the end
// those functions are executed as we've designed them to up above

// after a click, clear search function is ran
clearEl.addEventListener('click', clearSearch)

// our keybinding (listener) in this case is 'keyup'
// once keyup occurs, we will run a function
// searchEl.addEventListener('keyup', () => {
// test the function out with the console log and a 'text example' string
// value is an attribute that we can have on inputs that sets the text inside of it
// console.log(searchEl.value)
// to keep the code tidy, we are naming our function doSearch and calling it above
// })
searchEl.addEventListener('keyup', doSearch)
