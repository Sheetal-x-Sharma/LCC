import { useState } from "react";
import EventImage from "../../assets/images/eventimg.png"
import "./events.scss";

const Events = () => {
  const [activeTab, setActiveTab] = useState("current");

  // Sample Event Data
  const events = {
    past: [
      { id: 1, name: "AI Workshop", date: "10 Feb 2024", img: EventImage },
      { id: 2, name: "Hackathon 2024", date: "5 March 2024", img: EventImage },
    ],
    current: [
      { id: 3, name: "Blockchain Conference", date: "26 March 2025", img: EventImage},
    ],
    upcoming: [
      { id: 4, name: "Cybersecurity Summit", date: "10 April 2025", img: EventImage },
      { id: 5, name: "AI & ML Bootcamp", date: "20 April 2025", img: EventImage },
    ],
  };

  return (
    <div className="events">
      <h2>Events</h2>
      <div className="tabs">
        <button className={activeTab === "past" ? "active" : ""} onClick={() => setActiveTab("past")}>
          Past Events
        </button>
        <button className={activeTab === "current" ? "active" : ""} onClick={() => setActiveTab("current")}>
          Current Events
        </button>
        <button className={activeTab === "upcoming" ? "active" : ""} onClick={() => setActiveTab("upcoming")}>
          Upcoming Events
        </button>
      </div>

      <div className="event-list">
        {events[activeTab].length > 0 ? (
          events[activeTab].map((event) => (
            <div className="event-card" key={event.id}>
              <img src={event.img} alt={event.name} />
              <div className="event-info">
                <h3>{event.name}</h3>
                <p>{event.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-events">No events available</p>
        )}
      </div>
    </div>
  );
};

export default Events;
