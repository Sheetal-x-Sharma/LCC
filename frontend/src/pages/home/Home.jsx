import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import { useState } from "react";

const Home = () => {
  const [newPost, setNewPost] = useState(null);

  return (
    <div className="home">
      <Stories />
      <Share onPostCreated={setNewPost} />
      <Posts newPost={newPost} />
    </div>
  );
};

export default Home;
