CREATE DATABASE lnmiit_campus_connect;
USE lnmiit_campus_connect;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_type ENUM('student', 'alumni', 'faculty', 'other') NOT NULL,
    batch INT,
   
    company_name VARCHAR(255),
    role VARCHAR(255),
   
    city VARCHAR(100)  NOT NULL,
    state VARCHAR(100)  NOT NULL,
    country VARCHAR(100)  NOT NULL,
   
    department VARCHAR(255),
    designation VARCHAR(255),
   
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    instagram_url VARCHAR(500),
    facebook_url VARCHAR(500),
    personal_website VARCHAR(500),
   
    bio TEXT NOT NULL,
    about TEXT,
   
    profile_img VARCHAR(500),
    cover_img VARCHAR(500),
   
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    posts_count INT DEFAULT 0,
    dedications_count INT DEFAULT 0,
   
    is_blocked BOOLEAN DEFAULT FALSE,
   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    desc_text TEXT,
    img_url VARCHAR(500),
   
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,     -- who is reporting
    post_id INT NOT NULL,     -- which post is being reported
    reason TEXT,              -- optional: why reported (you can add later if needed)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);


CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
   
    comment_text TEXT NOT NULL,
   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE stories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
   
    img_url VARCHAR(500) NOT NULL,
   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
   
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE followers (
    id INT AUTO_INCREMENT PRIMARY KEY,
   
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
   
    CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);


CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
   
    user_id INT NOT NULL,
    post_id INT NOT NULL,
   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
   
    CONSTRAINT unique_like UNIQUE (user_id, post_id)
);


USE lnmiit_campus_connect;
SELECT * FROM users;












