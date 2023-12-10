let poseNet;
let model1;
let model2;
let poseInfoDiv;
let imageIndexDiv;

// Counter variables
let countdownFrom = 23;
let countdownTimer = 4000;
let countdownRunning = true;

let img;
let checkerr = true;
let musicStarted=false;
let model6;
let currentModel;
let switchInterval = 250; // Switch interval in milliseconds
let currentLabel = '';
let isClassifying = true; // Flag to control classification
let video;
let skeleton;
let pose;
let totalCountsNeeded = 3;
let GlobalBool = false;
let index = 0;
const Postures = {
    '0': "Tree-Posture",
    '1': "Warrior-Posture",
    '2': "Dog Posture",
    '3': "Mountain",
    '4': "Chair Posture",
    '5': "All Exercises Completed",


};
const array = ['a', 'v', 'c', 'd', 'e'];
let indexOfCurrentPosture = 0;



let currentPos = "NO Posture";


let currPoseCount = 15;  // User should stand in this position to complete the step
let yogaDetection = 0;

let sound;


let flag = true;
function preload(){
    sound=createAudio('Yoga-Postures/Chill - Cool Down Harmony.mp3');
}



function Start(){
    console.log("We are Starting");
    flag=true;
}
function  Stop(){
    console.log("Detection Stopped");
    imageIndexDiv.elt.innerText=0;
    flag=false;
}
function setup() {

    const container = createDiv();
    container.style('display', 'flex');


    poseNet = ml5.poseNet();

    // Create neural network instances
    model1 = ml5.neuralNetwork();
    model2 = ml5.neuralNetwork();

    currentModel = model1;


    // @Dhananjay  Add Here the code to put image of Tree Posture which is the first posture.





    const modelInfo1 = {
        model: `Yoga-Postures/Models/model (9).json`,
        metadata: `Yoga-Postures/Models/model_meta (8).json`,
        weights: `Yoga-Postures/Models/model.weights (16).bin`,
    };
    model1.load(modelInfo1, modelLoaded); // this loads the squarts posture.


    video = createCapture(VIDEO);
    video.size(640, 480);
    video.parent(container);
    video.hide();

    // Set up the canvas for pose detection
    const poseCanvas = createCanvas(640, 480);
    poseCanvas.parent(container);


    poseNet = ml5.poseNet(video, () => {
        console.log("MOdel Ready to so");
    });

    poseNet.on('pose', (results) => {
        if (results.length > 0) {
            pose = results[0]["pose"];
            skeleton = results[0].skeleton;
        }

    });

    // @ Dhananjay You Can Remove the below and give your styles.
    backgroundMusic = document.getElementById('backgroundMusic');
    poseInfoDiv = createDiv();
    poseInfoDiv.style('background-color', 'rgb(226,186,213)');
    poseInfoDiv.style('color', 'white');
    poseInfoDiv.style('padding', '10px');
    poseInfoDiv.style('text-align', 'center');
    poseInfoDiv.style('font-size', '75px');
    poseInfoDiv.style('font-weight', 'bold');
    poseInfoDiv.style('height','230px');


    poseInfoDiv.html(`Current Pose: ${Postures[indexOfCurrentPosture]}`);


    img = createImg(`Yoga-Postures/Models/Images/${indexOfCurrentPosture}.png`);
    img.size(480, 640);
    img.parent(container);
    poseInfoDiv.html(`Current Pose: ${Postures[indexOfCurrentPosture]}`);

    // Create a new div for image index and append it to the container
    imageIndexDiv = createDiv(`${currPoseCount}`);
    imageIndexDiv.parent(container);

    // Apply CSS styles to imageIndexDiv
    imageIndexDiv.style('background-color', 'rgb(226,186,213');
    imageIndexDiv.style('padding', '5px');
    imageIndexDiv.style('text-align', 'center');
    imageIndexDiv.style('font-size', '200px');

    imageIndexDiv.style('height','640');
    imageIndexDiv.style('width','640px');
     imageIndexDiv.style('font-weight','600');

    imageIndexDiv.style('font-family','Montserrat\', sans-serif');

}


function draw() {

    push();
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0, video.width, video.height);


    drawPose();




    fill(255);
    textSize(24);
    textAlign(CENTER, TOP);
    // text(`Current Pose: ${currentLabel}`, 10000, 100);
    // text(`Pose Timer: ${switchInterval / 1000}`, width / 2, 50);
}

function playMusic() {

    backgroundMusic.play();
}

function stopMusic() {

    backgroundMusic.pause();

    backgroundMusic.currentTime = 0;
}

function drawPose() {
    if (!musicStarted) {
        backgroundMusic.play();
        musicStarted = true; // Set the flag to true to avoid restarting the music
    }

    if (pose) {


        for (let i = 0; i < skeleton.length; i++) {
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            strokeWeight(8);
            stroke(244, 194, 194);
            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            fill(0);
            stroke(255);
            ellipse(x, y, 16, 16);
        }
    }
    pop();

}

function gotPoses(results) {

}
function displayAlert(message, alertType) {
    // Create the alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${alertType} alert-dismissible fade show my-5 m-6 `;
    alertElement.innerHTML = `
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        ${message}
    `;

    // Append the alert to the alert container
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = ''; // Clear previous alerts
    alertContainer.appendChild(alertElement);

    // Auto-dismiss the alert after a few seconds (optional)
    setTimeout(() => {
        alertElement.classList.add('fade');
    }, 5000); // Adjust the duration as needed
}
  

function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
function Final() {

    const usernameCookieValue = getCookieValue("username");

    const postData = {
        username:usernameCookieValue,
        pose_name:"Yoga Session",
        time:100
    };
  
    
    fetch('http://127.0.0.1:8000/report/poseReport', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
       

        return response.json();
    })
    .then(data => {
        
        
    })
    .catch(error => {
        console.error('Error:', error);
        
    });
}


function classifyPose() {



    if (indexOfCurrentPosture === 5) {
        console.log("Hello");
        img.elt.src=`Yoga-Postures/Models/Images/${indexOfCurrentPosture}.png`;

        checkerr = false;
        Final();

        return;
    }
    if (currPoseCount === 0 && checkerr) {
        console.log("Done Couneiig");
        checkerr=false;

       sound.play();
       flag=false;
       backgroundMusic.pause();
        setTimeout(()=>{
          sound.stop();
            currPoseCount = 15;
            backgroundMusic.play();
            indexOfCurrentPosture++;
            img.elt.src=`Yoga-Postures/Models/Images/${indexOfCurrentPosture}.png`
            flag=true;
            checkerr=true;
        },5000);



        // Dhananjay You can add Here the Code to put new text and Image on the page since we are moving to next model.

    }

    if (flag && checkerr) {




        if (isClassifying && pose) {


            isClassifying = false; // Disable classification during the switch

            let inputs = [];

            for (let i = 0; i < pose.keypoints.length; i++) {
                let x = pose.keypoints[i].position.x;
                let y = pose.keypoints[i].position.y;
                inputs.push(x);
                inputs.push(y);
            }

            currentModel.classify(inputs, gotResult);

        } else {
            setTimeout(() => {
                isClassifying = true; // Re-enable classification
                classifyPose();
            }, 100);
        }

    } else {

        setTimeout(()=>{
            classifyPose();
        },100);


    }

}

function gotResult(error, results) {


    if (error) {
        console.error(error);
        isClassifying = true;
        return;
    }



    if (results[0].confidence > 0.70) {
        currentLabel = results[0].label;
        console.log(currentLabel);

        if (currentLabel === array[indexOfCurrentPosture]) {
            currPoseCount--;

        }


         poseInfoDiv.html(`Current Pose: ${Postures[indexOfCurrentPosture]}<br>Pose Timer: ${currPoseCount}`);
        imageIndexDiv.elt.innerText = ` ${currPoseCount}`;
        setTimeout(() => { // so we wait it 1 sec for next detection.
            isClassifying = true;
            classifyPose();
        }, 1000);

    } else {
        setTimeout(classifyPose, 100);
    }

}



function switchModels() {


    if (currentModel === model1) {
        currentModel = model2;
        console.log('Switched to Model 2');
    } else {
        currentModel = model1;
        console.log('Switched to Model 1');
    }


    flag = true;
    isClassifying = true;
    classifyPose(); // No need

}

function modelLoaded() {
    console.log('Neural Network Model Loaded!');

    classifyPose();
}



