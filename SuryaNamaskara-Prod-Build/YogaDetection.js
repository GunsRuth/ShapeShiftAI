let poseNet;
let model1;
let model2;
let model3;
let img;
let imageIndexDiv;

let checkerr = true;
let musicStarted = false;
let model6;
let currentModel;
let switchInterval = 250; // Switch interval in milliseconds
let currentLabel = '';
let isClassifying = true; // Flag to control classification
let video;
let skeleton;
let pose;


let GlobalBool = true;
let BoxBool=true;
let index = 0;
const Postures = {
    '0': "Pranamasana",
    '1': "Hastauttanasana",
    '2': "Hastapadasana",
    '3': "Ashwa Sanchalanasana",
    '4': "Dandasana",
    '5': " Ashtanga Namaskara ",
    '6': "Bhujangasana",
    '7': " Adho Mukha Svanasana",
    '8': "Ashwa Sanchalanasana",
    '9': "Hastapadasana",
    '10': "Hastauttanasana",
    '11': "Tadasana",

};
const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'd', 'c', 'b', 'a'];

// we will have 12 postures and three models to detect them,
let indexOfCurrentPosture = 0;


let currentPos = "NO Posture";


let currPoseCount = 12;  // User should stand in this position to complete the step
let yogaDetection = 0;

let sound;


let flag = true;

function preload() {
    sound = createAudio('SuryaNamaskara-Prod-Build/Models/Chill - Cool Down Harmony.mp3');
}


function Start() {
    console.log("We are Starting");
    flag = true;
}

function Stop() {
    console.log("Detection Stopped");
    flag = false;
}

function setup() {

    const container = createDiv();
    container.style('display', 'flex');





    poseNet = ml5.poseNet();

    // Create neural network instances
    model1 = ml5.neuralNetwork();
    model2 = ml5.neuralNetwork();
    model3 = ml5.neuralNetwork();

    currentModel = model1;


    // @Dhananjay  Add Here the code to put image of Tree Posture which is the first posture.


    const modelInfo1 = {
        model: `SuryaNamaskara-Prod-Build/Models/model (10).json`,
        metadata: `SuryaNamaskara-Prod-Build/Models/model_meta (9).json`,
        weights: `SuryaNamaskara-Prod-Build/Models/model.weights (17).bin`,
    };
    model1.load(modelInfo1, modelLoaded); // this loads the squarts posture.


    const modelInfo2 = {
        model: `SuryaNamaskara-Prod-Build/Models/model (11).json`,
        metadata: `SuryaNamaskara-Prod-Build/Models/model_meta (10).json`,
        weights: `SuryaNamaskara-Prod-Build/Models/model.weights (18).bin`,
    }
    model2.load(modelInfo2, modelLoaded1());

    const modelInfo3 = {
        model: `SuryaNamaskara-Prod-Build/Models/model17.json`,
        metadata: `SuryaNamaskara-Prod-Build/Models/model17_meta.json`,
        weights: `SuryaNamaskara-Prod-Build/Models/model17.weights.bin`,
    }
    model3.load(modelInfo3, modelLoaded2());


    video = createCapture(VIDEO);
    video.size(640, 480);
    video.parent(container);

    video.hide();

    // Set up the canvas for pose detection
    const poseCanvas = createCanvas(640, 480);
    poseCanvas.parent(container);


    poseNet = ml5.poseNet(video, () => {
        console.log("Model Ready to so");
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

    img = createImg(`SuryaNamaskara-Prod-Build/Models/Images/${indexOfCurrentPosture}.png`);
    img.size(640, 480);
    img.parent(container); // Set the parent of the image to the container


    imageIndexDiv = createDiv(`${currPoseCount}`);
    imageIndexDiv.parent(container);

    // Apply CSS styles to imageIndexDiv
    imageIndexDiv.style('background-color', 'rgb(226,186,213');
    imageIndexDiv.style('padding', '5px');
    imageIndexDiv.style('text-align', 'center');
    imageIndexDiv.style('font-size', '260px');

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
        // Add Lop Feature its Necessary -> Cuts Is there , Check this once,

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
function  Final(){
    // @ Dhananjay can Send Backend Data from Here.
    // Like Sending the session data.
    // Wow Omkar Appreciate it
    // keep doing this bro.
    
    const usernameCookieValue = getCookieValue("username");

    const postData = {
        username:usernameCookieValue,
        pose_name:"Surya Namaskar",
        time:360
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
    if (GlobalBool && BoxBool) {


        if (indexOfCurrentPosture === 12  ) {
            console.log("Completed the SuryaNamaskar Session");
            poseInfoDiv.html(`All Postures Done Congratulations`);
            img.elt.src='SuryaNamaskara-Prod-Build/Models/Images/12.png';

            // @ Dhananjay Add the request to send the Data to Backend -> Session Data Storage
            alert("All Postures Completed");
            checkerr = false;
            GlobalBool=false;
            BoxBool=false;
             Stop();
             Final();

            return;
        }


        if (currPoseCount === 0 && checkerr) {
            // this runs when we are moving  to next posture.
            console.log("Done Counting");
            checkerr = false;
            backgroundMusic.pause();
            GlobalBool = false;
            BoxBool=false;
            setTimeout(() => {
                sound.play();

            }, 500);
            flag = false;
            currPoseCount = 12;
            indexOfCurrentPosture++;
            img.elt.src=`SuryaNamaskara-Prod-Build/Models/Images/${indexOfCurrentPosture}.png`;
            poseInfoDiv.html(`Current Pose: ${Postures[indexOfCurrentPosture]}`);
            imageIndexDiv.elt.innerText=currPoseCount;

            // user can see what to perform next and wait,
            setTimeout(() => {
                sound.stop();
                flag = true;

                backgroundMusic.play(); //   ** Add Loop Here
                checkerr = true;
                BoxBool=true;
                checkerr=true;

                //  Add the code to Render the Image of next Posture, Dont Render Text Here Jsut Render the image here.

            }, 5000);

            if (indexOfCurrentPosture === 4 || indexOfCurrentPosture===5 || indexOfCurrentPosture===8) {
                console.log(indexOfCurrentPosture);
                switchModels();
            }
            else{
                isClassifying=true;
                GlobalBool=true;
            }


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

            setTimeout(() => {
                classifyPose();
            }, 100);


        }
    } else {

        setTimeout(() => {
            classifyPose();
        }, 100);

    }
}

    function gotResult(error, results) {


        if (error) {
            console.error(error);
            isClassifying = true;
            return;
        }


        if (results[0].confidence > 0.80) {
            currentLabel = results[0].label;
            console.log(currentLabel);

            if (currentLabel === array[indexOfCurrentPosture]) {
                currPoseCount--;

            }

            if (currPoseCount >= 0 && GlobalBool && BoxBool) {

                poseInfoDiv.html(`Current Pose: ${Postures[indexOfCurrentPosture]}`);
                imageIndexDiv.elt.innerText=currPoseCount;
            }
            setTimeout(() => { // so we wait it 1 sec for next detection.
                isClassifying = true;
                classifyPose();
            }, 1000);

        } else {
            setTimeout(classifyPose, 100);
        }

    }


    function switchModels() {
        console.log("INside the posture working");
        if (indexOfCurrentPosture === 4) {

            console.log("Switched to Model -2")
            currentModel = model2;
        }
        if (indexOfCurrentPosture === 5) {

            console.log("Switched to Model-3")
            currentModel = model3;
        }
        if (indexOfCurrentPosture === 8) {

            console.log("Switched to Model-1");
            currentModel = model1;
        }
// Add the array as Model Array Indexing .
        currPoseCount=12;
        checkerr = true;
        flag = true;
        isClassifying = true;
        GlobalBool=true;


    }

    function modelLoaded() {
        console.log('Neural Network Model Loaded!');

        classifyPose();
    }

    function modelLoaded1() {
        console.log("Neural Network Model Loaded!");

    }

    function modelLoaded2() {
        console.log("Neural Network Model Loaded");
    }




