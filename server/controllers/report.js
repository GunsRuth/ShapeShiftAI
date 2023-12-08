import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import User from "../models/User.js";
import PoseReport from "../models/PoseReport.js";
import ExerciseReport from "../models/ExerciseReport.js";

// /* PoseReport */
export const poseReport = async (req, res) => {
  try {
    const {
      username,
      pose_name,
      time,
    } = req.body;

    const user = await User.findOne({ username: username });
    // console.log(user_document["_id"]);
    let calories=0;
    if (pose_name=="Surya Namaskar") {
      calories = time*0.08333333333;
    }else{
      calories = time*0.0588883333;
    }
    const newReport = new PoseReport({
      // user_id:"65722d21c71107395a42956d",
      user_id:user._id,
      pose_name,
      time ,
      calorie:calories
    });
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// /* exerciseReport */
export const exerciseReport = async (req, res) => {
  try {
    const {
      username,
      exercise_name,
      count,
    } = req.body;

    const user = await User.findOne({ username: username });
    let calories=0;
    if (exercise_name=="Squats") {
      calories = count*0.08333333333;
    }
    else if(exercise_name=="Lunges"){
      calories = count*0.0588883333;
    }
    else if(exercise_name=="Leg Raiser"){
      calories = count*0.0588883333;
    }
    else if(exercise_name=="Push Ups"){
      calories = count*0.0588883333;
    }
    else if(exercise_name=="Bending Toe Touch"){
      calories = count*0.0588883333;
    }
    
    const newReport = new ExerciseReport({
      user_id:user._id,
      exercise_name,
      count ,
      calorie:calories,
    });
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};