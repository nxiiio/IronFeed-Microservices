-- users-ms
CREATE USER users_user WITH PASSWORD 'users_pass';
CREATE DATABASE users_db OWNER users_user;
GRANT ALL PRIVILEGES ON DATABASE users_db TO users_user;

-- workout-ms
CREATE USER workout_user WITH PASSWORD 'workout_pass';
CREATE DATABASE workout_db OWNER workout_user;
GRANT ALL PRIVILEGES ON DATABASE workout_db TO workout_user;

-- social-ms
CREATE USER social_user WITH PASSWORD 'social_pass';
CREATE DATABASE social_db OWNER social_user;
GRANT ALL PRIVILEGES ON DATABASE social_db TO social_user;

-- posts-ms
CREATE USER posts_user WITH PASSWORD 'posts_pass';
CREATE DATABASE posts_db OWNER posts_user;
GRANT ALL PRIVILEGES ON DATABASE posts_db TO posts_user;

