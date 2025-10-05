

import { useState } from "react";
import "./friends.scss";
import img1 from "../../assets/images/img1.png"; // Sample profile image

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";


const Friends = () => {
  const [searchTerm, setSearchTerm] = useState("");


  const friendsList = [
    { id: 1, name: "Sheetal Sharma", batch: "Batch of 2022", img: img1 },
    { id: 2, name: "Shel Rhai", batch: "Batch of 2022", img: img1 },
    { id: 3, name: "Vil Cay", batch: "Batch of 2022", img: img1 },
    { id: 4, name: "Jenny Lincoln", batch: "Batch of 2019", img: img1},
    { id: 5, name: "Bob Ray", batch: "Batch of 2019", img: img1},
    { id: 6, name: "Aman Verma", batch: "Batch of 2023", img: img1 },
    { id: 7, name: "Nidhi Sharma", batch: "Batch of 2021", img: img1 },
    { id: 8, name: "Rahul Gupta", batch: "Batch of 2020", img: img1 },
    { id: 9, name: "Ananya Singh", batch: "Batch of 2019", img: img1 },


  ];


  const filteredFriends = friendsList.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="friends">
      <div className="container">
        <h2>Friends</h2>
        <div className="searchBar">
            <SearchOutlinedIcon className="searchIcon" />
            <input
                type="text"
                className="searchInput"
                placeholder="Search friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="friendsList">
          {filteredFriends.map((friend) => (
            <div className="friendCard" key={friend.id}>
              <img src={friend.img} alt={friend.name} className="friendImg" />
              <div className="friendInfo">
                <span className="friendName">{friend.name}</span>
                <span className="friendBatch">{friend.batch}</span>
              </div>
              <div className="buttons">
                <button className="messageBtn">Message</button>
                <button className="removeBtn">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Friends;








