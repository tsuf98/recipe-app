## Recipe App

_This small example app created as a part of programming evaluation test._

This is a small application for managing recipes, features a google oauth-2 login and simple user managment.

I took the limited time, and the smaller scope of the task, and small data amount, into consideration- therefore refrained of certain optimizations that can be found on production-ready applications (i.e pagination, authorization levels, etc..) and instead described the right approach in a comment.

I made sure the routes are secure, and some can't be accessed by unauthenticated users, as well as limited the types and sizes of files that can be uploaded- even though more security measures need to be taken in a real production-ready app.

In this small app, the user can review different recipes, filter and search them on the main page. Logged users can also create recepies, update their recommendation preferences, edit and delete the recepies that were created by them.

The front-end is build out of react, using mui (and some tailwind) as a ui libraries, and can be found at the `./client` folder.

The back-end is build out of NestJs, using a remotly hosted mongoDB as a database, and can be found at the `./server` folder.

### To run the application server locally-

create an env file with the following properties:

```
MONGO_URL= # a connection string to mongoDB
JWT_SECRET= # jwt secret- can be generated as a short random string
GOOGLE_CLIENT_ID= # for the google oauth to work - get it here- https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_SECRET= # for the google oauth to work - get it here- https://console.cloud.google.com/apis/credentials
GOOGLE_CALLBACK_URL="/api/auth/google/callback" # can be kept
CLIENT_URL="/" # can be kept
```

install npm packages:

```
npm install
```

and run the application:

```
npm run start:dev
```

Testing the app, can be possible on:

```
npm run test
```

### To run the application client locally-

install npm packages:

```
npm install
```

and run the application:

```
npm run dev
```
