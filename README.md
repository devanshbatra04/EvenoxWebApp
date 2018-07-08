# Eventox Web App

The repository contains all the code for the web app being developed for eventox.

##Deploying
* Clone the repository.
* In the terminal, run npm install to locally save the required dependencies.
* Start your local mongodb instance.
* start the server by running the command ```node app.js``` or ```nodemon app.js``` (**recommended**)

## Understanding the code

#### Models and Views:
* These folders as intuitive, contain the db models and ejs views for the app.
* the user model is specially mapped to passport, and requires extra care.
* ejs files are in factored in folders in views appropriately.
* headers and footers should be added to each new ejs file created. Header contains essential materialize style inclusion.
#### The public folder:
* contains all the static data.
* note that express does not allow serving static files from outside the public folder.
* use it to keep any scripts, styles or static html pages to be used in the project.


#####app.js
* Contains all the code on server for now (will be refactored soon)
* Dependencies : 
    * Express, body-parser: Self Explainatory
    * Mongoose : A library that makes our working with MongoDB easier.
    * passport and related libraries : A library that makes our authentication process **much** easier
    * ejs : we are be using ejs as the templating engine. 
    * nodemailer : a library for sending mails
    * fs : for managing files
    * html-pdf: converts html to pdf, required for rendering pdfs.
    * qrcode: for generating qr codes
* Auth:
    * implemented authorization using facebook and locally
    * used mongoose user models.
    * associated ejs files in views/Auth
* events, blog routes
    * restful routes to create, read, update, delete events. 
    * associated ejs files are in views/events and views/blog

    