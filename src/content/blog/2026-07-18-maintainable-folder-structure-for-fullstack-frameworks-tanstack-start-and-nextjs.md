---
title: Maintainable Folder Structure for Fullstack Frameworks, Tanstack Start & NextJS
description: My personal preferred folder structure for fullstack platforms to
  keep my project maintainable and clean by separating the frontend from backend
  while still having the smooth integration what the framework provides.
date: 2026-07-18
draft: true
lastModified: 2026-07-18
---
When working with any full stack framework, a problem arose for me with the passage of time and that was the increasing complexity and hard to maintain maintainability of the code where the backend and frontend code would be soo mixed together, I would prefer not to touch it any more. Just like the "if its working, don't touch it" meme. 

Therefore I came up with my custom folder structure called the back&front separate folder structure. In this folder structure what we do is create 3 directories under the source `src` folder:

- Backend (to include all the code that runs only on the server "backend")
- Frontend (to include all the code about UI and code that runs on the client "browsers" etc.)
- Routes (to include all the route files, that glues together code from frontend and backend).

Lets understand with an example. Suppose we are creating a full stack todo app (yeah cause this todo thing better to understand stuff). Users should be able to add new to-dos, and more. For it we will need several stuff:

- Database Schema, Queries 
- Server Actions (to be called from the client)
- Authentication (with better auth or something)
- Middleware to check if a user is authenticated or not
- Email notification for reminding last minute tasks
- Todos, Landing & Auth Pages

We can start with creating the backend folder `src/backend` to include all the backend related code. Inside `backend` folder we will add directories as below:



&nbsp;