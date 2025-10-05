import { useState } from "react";
import "./groups.scss";
import GroupCard from "../../components/groupCard/GroupCard";
import GroupCard2 from "../../components/groupCard/GroupCard2";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const Groups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [myGroupsIndex, setMyGroupsIndex] = useState(0);
  const [recommendedIndex, setRecommendedIndex] = useState(0);


 


  // Sample data for groups
  const myGroups = [
    { id: 1, name: "LNMIIT Developers", members: 120, img: "group1.png" },
    { id: 2, name: "AI & ML Enthusiasts", members: 98, img: "group2.png" },
    { id: 3, name: "Code Masters", members: 150, img: "group3.png" },
    { id: 4, name: "Blockchain Enthusiasts", members: 85, img: "group4.png" },
    { id: 5, name: "Hackathon Heroes", members: 130, img: "group5.png" },
    { id: 6, name: "Tech Wizards", members: 200, img: "group6.png" },
    { id: 7, name: "LNMIIT Designers", members: 75, img: "group7.png" },
    { id: 8, name: "Startup Hub", members: 95, img: "group8.png" },
    { id: 9, name: "Cyber Security Geeks", members: 105, img: "group9.png" },
    { id: 10, name: "Competitive Coders", members: 180, img: "group10.png" },
  ];


  const recommendedGroups = [
    { id: 11, name: "Tech Wizards", members: 200, img: "group6.png" },
    { id: 12, name: "LNMIIT Designers", members: 75, img: "group7.png" },
    { id: 13, name: "Startup Hub", members: 95, img: "group8.png" },
    { id: 14, name: "Cyber Security Geeks", members: 105, img: "group9.png" },
    { id: 15, name: "Competitive Coders", members: 180, img: "group10.png" },
  ];


  // Filter groups based on search input
  const filteredMyGroups = myGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const filteredRecommendedGroups = recommendedGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const visibleCount = 3; // Number of visible items in the carousel


  // **Looping Carousel Navigation for My Groups**
  const handleNextMyGroups = () => {
    setMyGroupsIndex((prevIndex) =>
      prevIndex >= filteredMyGroups.length - visibleCount ? 0 : prevIndex + 1
    );
  };


  const handlePrevMyGroups = () => {
    setMyGroupsIndex((prevIndex) =>
      prevIndex <= 0 ? filteredMyGroups.length - visibleCount : prevIndex - 1
    );
  };


  // **Looping Carousel Navigation for Recommended Groups**
  const handleNextRecommended = () => {
    setRecommendedIndex((prevIndex) =>
      prevIndex >= filteredRecommendedGroups.length - visibleCount ? 0 : prevIndex + 1
    );
  };


  const handlePrevRecommended = () => {
    setRecommendedIndex((prevIndex) =>
      prevIndex <= 0 ? filteredRecommendedGroups.length - visibleCount : prevIndex - 1
    );
  };


  return (
    <div className="groups">
      {/* Search Bar */}
      <div className="search-bar">
        <SearchOutlinedIcon className="searchIcon" />
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>


      {/* My Groups Section */}
      <div className="section">
        <h2>My Groups</h2>
        <div className="scroll-container">
          <button className="scroll-btn left" onClick={handlePrevMyGroups}>
            ❮
          </button>
          <div className="group-list">
            {filteredMyGroups
              .slice(myGroupsIndex, myGroupsIndex + visibleCount)
              .map((group) => (
                <GroupCard2 key={group.id} group={group} />
              ))}
          </div>
          <button className="scroll-btn right" onClick={handleNextMyGroups}>
            ❯
          </button>
        </div>
      </div>


      {/* Recommended Groups Section */}
      <div className="section">
        <h2>Recommended Groups</h2>
        <div className="scroll-container">
          <button className="scroll-btn left" onClick={handlePrevRecommended}>
            ❮
          </button>
          <div className="group-list">
            {filteredRecommendedGroups
              .slice(recommendedIndex, recommendedIndex + visibleCount)
              .map((group) => (
                <GroupCard key={group.id} group={group} />
                
              ))}
          </div>
          <button className="scroll-btn right" onClick={handleNextRecommended}>
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};


export default Groups;


