import React, { useState } from "react";
import "./hatDedication.scss";
import { FaInfoCircle, FaUserGraduate, FaHatCowboy } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import ProfPic from "../../assets/images/img1.png"
import Profile from "../../assets/images/img2.png"
import GoldHat from "../../assets/images/goldHat.png"


const fakeDedications = [
  {
    id: 1,
    giver: { name: "John Doe", profilePic: ProfPic },
    receiver: { name: "Ekamjot Singh", profilePic: Profile },
    message: "I wanted to express my sincere gratitude for your help and support. Your guidance and insights have been invaluable in helping me navigate this challenging situation. I truly appreciate you taking the time to share your knowledge and experience, and I am grateful for your willingness to lend a helping hand. Your support has made a significant difference, and I am confident that I can now move forward with greater clarity and confidence. Thank you again for everything.",
    hatImage: GoldHat,
    timestamp: "March 26, 2025",
  },
];


const alumniList = ["Ekamjot Singh", "Aman Verma", "Priya Sharma", "Rahul Mehta"]; // Mock alumni names for validation


const HatDedication = () => {
  const [dedications, setDedications] = useState(fakeDedications);
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  const handleDedication = () => {
    if (!receiver || !message) {
      setError("Please fill in all fields.");
      return;
    }


    if (!alumniList.includes(receiver)) {
      setError("You can only dedicate hats to alumni.");
      return;
    }


    const newDedication = {
      id: dedications.length + 1,
      giver: { name: "Rishika Manocha", profilePic: ProfPic },
      receiver: { name: receiver, profilePic: Profile },
      message: message,
      hatImage: GoldHat,
      timestamp: "Just now",
    };


    setDedications([newDedication, ...dedications]);
    setReceiver("");
    setMessage("");
    setError("");
  };


  return (
    <div className="hatDedication">
     
      {/* Profile Header */}
      <div className="header">
        <img src= {ProfPic} alt="Profile" className="profilePic" />
        <h2>Rishika Manocha</h2>
        <p>Hats Dedicated: {dedications.filter(d => d.giver.name === "Rishika Manocha").length}</p>
      </div>


      {/* Info Section */}
      <div className="infoSection">
        <FaInfoCircle className="infoIcon" />
        <h3>What is Hat Dedication?</h3>
        <p>
          <FaUserGraduate className="icon" /> Dedicate hats to alumni who have helped you in your academic or professional journey.  
        </p>
        <p>
          <FaHatCowboy className="icon" /> Hats symbolize appreciation and can include a personal message.  
        </p>
      </div>


      {/* Dedication Form */}
      <div className="dedicationForm">
        <h3>Dedicate a Hat</h3>
        {error && <p className="error"><MdErrorOutline className="errorIcon" /> {error}</p>}
        <input
          type="text"
          placeholder="Enter recipient's name (Alumni Only)"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
        <textarea
          placeholder="Write a dedication message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button onClick={handleDedication}>Dedicate</button>
      </div>


      {/*Dedications List */}
      <div className="dedicationsList">
        <h3>Dedications</h3>
        {dedications.length > 0 ? (
          dedications.map((dedication) => (
            <div className="dedicationItem" key={dedication.id}>
              <div className="dedicationHeader">
                <div className="dedicationInfo">
                  <img src={dedication.receiver.profilePic} alt="receiver" className="profileImage" />
                  <p className="dedicationText">
                    Dedicated to <strong>{dedication.receiver.name}</strong>
                    <br />
                    <span className="timestamp">{dedication.timestamp}</span>
                  </p>
                </div>
                <img src={dedication.hatImage} alt="Hat" className="hatImage" />
              </div>
              <p className="dedicationMessage">❝ {dedication.message} ❞</p>
             
            </div>
          ))
        ) : (
          <p>No dedications yet.</p>
        )}
      </div>
    </div>
  );
};


export default HatDedication;






















