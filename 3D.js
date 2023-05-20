//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";



// Fetch DOM elements
const reqButton = document.getElementById('button-request');
const reqStatus = document.getElementById('request-status');
const inputPrompt = document.getElementById('input');

const image1 = document.querySelector('.imagePlaceholder img');
const image2 = document.querySelector('.imagePlaceholder1 img');
const image3 = document.querySelector('.imagePlaceholder2 img');



const imageArray = [image1, image2, image3];
// Create an array of facade model names
const facadeModels = ['facade1', 'facade2', 'facade3'];

// Keep track of the current facade model index
let facadeModelIndex = 0;

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;
let newObject;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'facade2';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/${objToRender}.glb`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);


function setUp() {

    for (let i = 0; i < imageArray.length; i++) {
        const image = imageArray[i];
        image.style.opacity = '0';
        image.style.transition = 'opacity 0.5s ease-in-out';
        
        // Delay setting display to 'none' after the fade-out effect
        setTimeout(() => {
          image.style.display = 'none';
        }, 300);
      }

    // Remove the existing object from the scene if it exists
    if (object) {
        fadeOutAndRemoveObject(object);
      }

}

// Function to load the facade model
function loadFacadeModel() {
    reqStatus.innerHTML = 'Generating Model...';

   
    // Get the current facade model name based on the index
    const objToRender = facadeModels[facadeModelIndex];

    // //Instantiate a loader for the .gltf file
    const loader = new GLTFLoader();
  
    // Remove the existing object from the scene if it exists
    if (object) {
      scene.remove(object);
    }
  
    // Load the new facade model
    loader.load(
      `models/${objToRender}.glb`,
      function (gltf) {
        // If the file is loaded, add it to the scene
        // object = gltf.scene;
        // scene.add(object);

        newObject = gltf.scene;

        // Set initial opacity to 0 to fade in
        newObject.traverse(function (child) {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = 0;
          }
        });
  
        scene.add(newObject);
  
        // Fade in the new model
        fadeInModel(newObject);
  
        // Fade out and remove the previous object
        fadeOutAndRemoveObject(object);
  
        // Set the current object to the new object
        object = newObject;



        let currentImage = imageArray[facadeModelIndex - 1];
        currentImage.style.display = 'block';

        // Delay the fade-in effect to synchronize with the model loading
        setTimeout(() => {
          currentImage.style.opacity = '1';
        }, 300);

        console.log(facadeModelIndex);
        reqStatus.innerHTML = 'Success!';
      },
      function (xhr) {
        // While it is loading, log the progress
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function (error) {
        // If there is an error, log it
        console.error(error);
      }
    );
  
    // Increment the facade model index for the next click
    if (facadeModelIndex <= 2) {
        facadeModelIndex++;
    } else {
        facadeModelIndex = 0;
    }
    
  }
  
  // Event listener for the button click
  reqButton.addEventListener('click', loadFacadeModel);
  inputPrompt.addEventListener('click', handleClick);

  function handleClick() {
    setUp();
  
    // Remove the event listener after it has been clicked
    inputPrompt.removeEventListener('click', handleClick);
  }

  const imagePlaceholders = document.querySelectorAll('.imageScroll .imagePlaceholder');
  const threshold = 75; // Adjust this value as needed

// Function to handle scroll event
function handleScroll() {
  // Get the current scroll position
  const scrollPosition = window.scrollX || window.pageXOffset;

  // Check if the scroll position exceeds the threshold
  if (scrollPosition > threshold) {
    // Hide the image placeholders with fade-out effect
    imagePlaceholders.forEach((placeholder) => {
      placeholder.classList.add('hidden');
    });
  } else {
    // Show the image placeholders
    imagePlaceholders.forEach((placeholder) => {
      placeholder.classList.remove('hidden');
    });
  }
}

// Add scroll event listener
window.addEventListener('scroll', handleScroll);

  


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = 4.5;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 0.8); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 0.8);
scene.add(ambientLight);


//This adds controls to the camera, so we can rotate / zoom it with the mouse
// if (objToRender === "facade3") {
//   controls = new OrbitControls(camera, renderer.domElement);
// }

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

    //I've played with the constants here until it looked good 
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
    renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the facade move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

// Function to fade in the model
function fadeInModel(model) {
    let opacity = 0;
  
    // Recursive function to gradually increase the opacity
    function fadeIn() {
      opacity += 0.02;
      model.traverse(function (child) {
        if (child.isMesh) {
          child.material.opacity = opacity;
        }
      });
  
      if (opacity < 1) {
        requestAnimationFrame(fadeIn);
      }
    }
  
    fadeIn();
  }
  
  // Function to fade out and remove the object
  function fadeOutAndRemoveObject(object) {
    let opacity = 1;
  
    // Recursive function to gradually decrease the opacity
    function fadeOut() {
      opacity -= 0.05;
      object.traverse(function (child) {
        if (child.isMesh) {
          child.material.opacity = opacity;
        }
      });
  
      if (opacity > 0) {
        requestAnimationFrame(fadeOut);
      } else {
        scene.remove(object); // Remove the object from the scene
      }
    }
  
    fadeOut();
  }

//Start the 3D rendering
animate();