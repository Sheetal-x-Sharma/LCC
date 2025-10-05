import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  FaPaperPlane,
  FaPaperclip,
  FaSmile,
  FaUser,
  FaFileImage,
  FaFileVideo,
  FaFilePdf,
} from "react-icons/fa";
import { BiBell, BiBellOff, BiBlock, BiCheck, BiFlag } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import "./chats.scss";
import ProfPic1 from "../../assets/images/profile.png";
import ProfPic7 from "../../assets/images/img1.png";


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);


  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachmentRef = useRef(null);
  

  const dummyChats = [
    { id: 1, name: "Rohan Gupta", lastMessage: "Sure, I can help!" },
    { id: 2, name: "Priya Kapoor", lastMessage: "Great project!", profileImage: ProfPic1 },
    { id: 3, name: "Akash Thapar", lastMessage: "Keep it up!" },
    { id: 4, name: "Raj Chopra", lastMessage: "Let's discuss your idea.", profileImage: ProfPic7 },
    { id: 5, name: "Raj Chopra", lastMessage: "Let's discuss your idea.", profileImage: ProfPic7 },
    { id: 6, name: "Raj Chopra", lastMessage: "Let's discuss your idea.", profileImage: ProfPic7 },
    { id: 7, name: "Raj Chopra", lastMessage: "Let's discuss your idea.", profileImage: ProfPic7 },
    { id: 8, name: "Raj Chopra", lastMessage: "Let's discuss your idea.", profileImage: ProfPic7 },
    { id: 9, name: "Raj Chopra", lastMessage: "Let's discuss your idea.", profileImage: ProfPic7 },
  ];


  const filteredChats = dummyChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "me" }]);
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "Thanks for your message!", sender: "other" }]);
      }, 1000);
      setInput("");
    }
  };


  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMessages([...messages, { text: `📎 ${file.name}`, sender: "me" }]);
      setShowAttachmentOptions(false);
    }
  };


  useEffect(() => {
    // Scroll to top first
    window.scrollTo(0, 0);
  
    // Then disable scroll
    document.body.style.overflow = "hidden";
  
    const handleClickOutside = (event) => {
      // Close emoji picker
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest(".emojiToggle")
      ) {
        setShowEmoji(false);
      }
  
      // Close menu dropdown
      if (
        showMenu &&
        !event.target.closest(".menuDropdown") &&
        !event.target.closest(".menuTrigger")
      ) {
        setShowMenu(false);
      }
  
      // Close attachment dropdown
      if (
        showAttachmentOptions &&
        attachmentRef.current &&
        !attachmentRef.current.contains(event.target) &&
        !event.target.closest(".attachment-wrapper")
      ) {
        setShowAttachmentOptions(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      // Enable scroll again when leaving chat page
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmoji, showMenu, showAttachmentOptions]);
    

  return (
    <div className="chatContainer">
      
      <div className="chatCard">
        {/* Sidebar */}
        <div className="chatList">
          <h3>Messages</h3>
          <input
            type="text"
            placeholder="Search..."
            className="chatSearch"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="chatPreviewsWrapper">
  {filteredChats.map((chat) => (
    <div className="chatPreview" key={chat.id}>
      <div className="avatar">
        {chat.profileImage ? (
          <img src={chat.profileImage} alt={chat.name} />
        ) : (
          chat.name[0]
        )}
      </div>
      <div className="info">
        <span><strong>{chat.name}</strong></span>
        <p>{chat.lastMessage}</p>
      </div>
    </div>
  ))}
</div>

        </div>


        {/* Main Chat Window */}
        <div className="chatWindow">
          <div className="chatHeader">
            <div className="userDetails">
              <div className="avatar">R</div>
              <span>Rohan Gupta</span>
            </div>
            <div className="chatActions">
              <div className="menuWrapper">
                <div className="menuTrigger" onClick={() => setShowMenu((prev) => !prev)}>
                  ⋮
                </div>
                {showMenu && (
                  <div className="menuDropdown">
                    <div className="menuItem" onClick={() => alert("Viewing Profile")}>
                      <FaUser className="iconStyle" /> View Profile
                    </div>
                    <div className="menuItem" onClick={() => setIsMuted((prev) => !prev)}>
                      {isMuted ? (
                        <BiBell className="iconStyle" />
                      ) : (
                        <BiBellOff className="iconStyle" />
                      )}
                      {isMuted ? "Unmute" : "Mute"}
                    </div>
                    <div className="menuItem" onClick={() => setIsBlocked((prev) => !prev)}>
                      {isBlocked ? (
                        <BiCheck className="iconStyle" />
                      ) : (
                        <BiBlock className="iconStyle" />
                      )}
                      {isBlocked ? "Unblock" : "Block"}
                    </div>
                    <div className="menuItem" onClick={() => alert("Reported")}>
                      <BiFlag className="iconStyle" /> Report
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>


          <div
  className="chatBody overflow-y-auto flex-1 px-4"
  style={{ maxHeight: "calc(100vh - 200px)" }} // Adjust height as needed
>
  {messages.map((msg, index) => (
    <div className={`message ${msg.sender}`} key={index}>
      <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
    </div>
  ))}
  {/* Auto-scroll anchor */}
  {/* <div ref={scrollRef} /> */}
</div>




          <div className="chatInput">
          <div className="attachment-wrapper" ref={attachmentRef}>
            <FaPaperclip
              className="icon"
              title="Attach"
              onClick={() => setShowAttachmentOptions((prev) => !prev)}
            />
            {showAttachmentOptions && (
              <div className="attachment-options">
                <FaFileImage onClick={() => fileInputRef.current.click()} />
                <FaFileVideo onClick={() => fileInputRef.current.click()} />
                <FaFilePdf onClick={() => fileInputRef.current.click()} />
              </div>
            )}
          </div>


            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />


<div className="emojiWrapper">
  <button className="emojiToggle" onClick={() => setShowEmoji((prev) => !prev)}>
    <BsEmojiSmile />
  </button>

  {showEmoji && (
    <div
      className="emoji-picker-wrapper"
      ref={emojiPickerRef}
      style={{ zIndex: 999, position: 'absolute' }}
    >
      <EmojiPicker onEmojiClick={(e) => onEmojiClick(e)} searchDisabled/>
    </div>
  )}
</div>



            <textarea
              className="chatInputBox"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
            />


            <button onClick={handleSend} className="sendbtn">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
    
  );
};


export default Chat;








