import "./posts.scss";
import { useEffect, useState } from "react";
import axios from "../../axios"; // ✅ your custom axios
import Post from "../post/Post";

const Posts = ({ newPost, userId }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      let url = "/posts";
      if (userId) url += `?userId=${userId}`;

      const res = await axios.get(url);

      const data = userId
        ? res.data
        : [...res.data].sort(() => Math.random() - 0.5);

      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  useEffect(() => {
    if (newPost) setPosts((prev) => [newPost, ...prev]);
  }, [newPost]);

  const handleCommentAdded = (postId, newCount) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments_count: newCount } : p
      )
    );
  };

  const validPosts = posts.filter((p) => p && p.userId && p.name);

  return (
    <div className="posts">
      {validPosts.length > 0 ? (
        validPosts.map((post, index) => (
          <Post
            key={post.id || index}
            post={post}
            onCommentAdded={handleCommentAdded}
          />
        ))
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
};

export default Posts;
