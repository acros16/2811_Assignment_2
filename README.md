# 2811_Assignment_2
Angular chat server project - assignment 2. 2811ICT Web Programming.
# Git repository organisation
This git repository was organised in a way such that any additions to the code would be easily comitted and not cause any conflicts. This was done by simply keeping the Angular folder locally and adding/comitting/pushing whenever a new feature was added. This allows for consistency in directories and files between both the repository available on a user's computer and the origin.
# Data Structures
The data for users are stored in a mongodb database. This database can be easily added to or deleted from by super admins with a form input within the chat app. It contains a list of users with their respective usernames and permission value (0-2). Although this database stores user data, a .JSON file is still used for user authentication at login due to the nature of using a server that is turned on and off (wiping data). Whenever the mongodb server is initialized, it starts with an empty database, therefore not allowing any logins as no users exist.

When logging in a user, the client passes a struct containing the username and password to the server to verify. A struct is also used when creating a new group and contains a group name, an array of admins and an array of members.
# Client / Server Responsibilities
Both the client and server have several functions executing, allowing them to share the workload of running the chat room. The server primarily focuses on the initial startup, routing, socket processes, login authentication and mongodb functions. The server communicates with the mongodb server and handles all user data, as it would be unsafe to have such information on the client side. The client focuses on displaying all relevant information to the user that is received from the server, and taking in input to give to the server. It also contains the socket, auth and mongodb services, which effectively communicate with the server with the HttpClient, Socket.io and mongodb modules.
# Routes / Parameters / Returns / Purpose
('/api/login') - This route takes in a struct containing a username and password as a string. It is used to verify if a user exists and checks their entered password. It returns back true or false depending on the success of the login.

('/api/groups') - This route takes in a username and is used to check if a user is in an existing group. It returns a boolean depending if the user is found.

('/api/group/delete/:groupname') - This route takes in a group name and deletes it. It returns true upon succesful deletion of the group and prints to the console the name of the deleted group.

('/api/group/create') - This route creates a new group and takes in a new group name. If no group name is specified, it returns false. It initializes a struct containing the group name and two arrays; one for admins and members. It then pushes this new group to the array of existing groups and returns true.

('/api/add') - This route is a mongodb function and is used to add a new user to the mongo database. It takes in a struct containing a new username and their respective permission value (0-2). After it adds the user to the collection, it returns true.

('/api/remove') - This route is another mongodb function and is used to remove an existing user from the mongo database. It takes in a username and searches the collection for a match. Once found, it is removed from the collection and returns true.

('/api/read') - This route is another mongodb function and is used to read existing data within the mongo database. It takes in a username and fetches the document matching that username. It returns the document in a JSON format.
# Angular Architecture - Components / Services / Modules / Routes
Components:

Chat - This is the primarily component for the actual chat room service. It directs user's messages and images via the socket service sendMessage() and sendImage() functions. It displays both the current chat history and input spaces for both messages and images. The user also has the option to change the current profile image. This component is displayed within the home component.

Channels - This component is a small component inserted into the home component described below. It displays the available channels for the current group.

Home - This component displays everything shown on the screen when a user logs in apart from the channels and chatroom itself. It displays available groups and channels, as well as input spaces to add new groups or channels (if the user has sufficient permissions). It also displays a navigation bar for the user to sign out or refresh the home page, as well as a welcome message to the right.

Login - This component allows the chat room app to authenticate a user. It checks if a user exists and if they have the valid password(a universal password is used). Once a user has logged in, they are routed to the home/chat component immediately. This component uses the auth.service. This component is the default route when users connect to localhost:3000.

Services:
All the services provided are used to communicate between the angular based client side with the node js based server side with post requests.

group - This service is used to call the api routes for all the group functions. It includes 3 functions: createGroup(data), deleteGroup(groupName) and getGroups(data). It uses the HttpClient importable.
user - This service is used to call the api routes for both the authentication and mongodb functions. It includes 4 functions: login(data), add(data), remove(data) and read(data).
socket - This service allows users to communicate with each other in the chat room by routing their messages through sockets and displaying existing messages by feeding data to components with the subscribe function. It is called by the chat component. It is also used to route image source links between the client and server to be able to send images between clients. It contains 4 functions: sendMessage(), sendImage(), getMessages() and getImages().

Modules:
The app.module.ts contains the AppComponent, HomeComponent, ChannelsComponent, LoginComponent and ChatComponent. It also imports the BrowserModule, FormsModule and HttpClientModule for use in its various components. It also calls the RouterModule to set express routes to the Login and Chat components. It also imports the HttpClient, Browser, AppRouting and Forms modules. 

This project uses NPM installs of socket.io, mongodb, path and express.
