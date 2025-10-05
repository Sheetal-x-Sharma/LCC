

import React from "react";
import "./hallOfFame.scss";
import goldMedal from "../../assets/images/gold.png";
import silverMedal from "../../assets/images/silver.png";
import bronzeMedal from "../../assets/images/bronze.png";
import profilePic from "../../assets/images/profile.png"; // Replace with actual images
import {FaHatCowboy } from "react-icons/fa";


const fakeData = [
  { id: 1, name: "Alice Johnson", hats: 120, medal: goldMedal },
  { id: 2, name: "Bob Smith", hats: 100, medal: silverMedal },
  { id: 3, name: "Charlie Brown", hats: 80, medal: bronzeMedal },
  { id: 4, name: "David Lee", hats: 75 },
  { id: 5, name: "Emily Davis", hats: 65 },
  { id: 6, name: "Frank Thomas", hats: 60 },
  { id: 7, name: "Grace White", hats: 55 },
  { id: 8, name: "Henry King", hats: 50 },
  { id: 9, name: "Ivy Martin", hats: 45 },
  { id: 10, name: "Jack Wilson", hats: 40 },
  { id: 11, name: "Katherine Brown", hats: 38 },
  { id: 12, name: "Leo Scott", hats: 35 },
  { id: 13, name: "Monica Green", hats: 30 },
];


const HallOfFame = () => {
  return (
    <div className="hallOfFame">
      <h2>🏆 Hall of Fame 🏆</h2>
      <div className="topThree">
        {fakeData.slice(0, 3).map((user, index) => (
          <div className={`topCard rank-${index + 1}`} key={user.id}>
            <img src={user.medal} alt="medal" className="medal" />
            <img src={profilePic} alt="profile" className="profilePic" />
            <span className="userName">{user.name}</span>
            <span className="hats"><FaHatCowboy className="icon" /> {user.hats}</span>

          </div>
        ))}
      </div>
      <div className="scrollableList">
        {fakeData.slice(3, 13).map((user, index) => (
          <div className="listItem" key={user.id}>
            <span className="rank">#{index + 4}</span>
            <span className="name">{user.name}</span>
            <span className="hats"><FaHatCowboy className="icon" /> {user.hats}</span>

          </div>
        ))}
      </div>
    </div>
  );
};


export default HallOfFame;


















