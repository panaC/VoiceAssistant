# BookAssistant

The aim project is an audiobook reader developpement at destination of an visually impaired association.
Based on Google Assistant with [Google Actions](https://developers.google.com/actions/) and [Diagflow](https://dialogflow.com/)

[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](/LICENSE)

## Architecture

The project consists of 2 main parts:
 - `webpub-server` which provides the webpub manifest as well as the audio files (back-end)
 - `server-actions` which is the front-end management software for the assistant.

![archi](docs/img/archi.png)

### webpub-server

webpub-server is a Node-Js application developed in Typescript.
It contains an Express based HTTP server, which exposes an OPDS-FEED/WEBPUB API and requires to be hosted upstream of an HTTPS reverse proxy.

In concrete terms, its objective is to provide, in the form of a REST API, a document in the standard JSON format allowing navigation and/or search of webpub events. More specifically, audiobook manifests. 

 - The server is designed according to a CRUD architecture:
 - Create: Route Post to add a new audiobook to the database (information in Webpub manifest format)
 - Read : Route Get which provides an OPDS navigation flow, then the webpub manifests itself during a search
 - Update: Route Put to update a manifest Webpub
 - Delete: Delete Route to delete a manifest webpub

The server is based on a dedicated database.

#### database

The server developed for this prototype is based on a NoSQL MongoDB database.

#### authentification

not implemented yet
In development on `auth` branch

### action-server

Actions-server is a Node-JS application developed in Typescript. This application uses the Actions-on-Google library provided by Google. This library acts as an intermediary between the "intents" (actions) and the Http Express server. It allows you to analyse/extract the Actions format sent by Google's servers and to respond with a response format specific to Google Actions.

This server, like the "webpub-server", must be placed behind a reverse https proxy, which is very important for encrypting the exchanged data.

#### Google

Google's tools are composed of 2 services:
  - Actions: which is the interface tool between the Google Assistant and our application, it is through it that information flows
  - DialogFlow: Google tools for chatbot creation, based on NLP technology. This tool allows you to understand the sentences expressed by the user and translate them into "intent". For example: for the reading of the novel "red and black", we can say it in several ways: I want to listen to red and black or Put the red and black of stendhal. With this tool that we program, the captured title will only be: red and black, no matter what the turn of the sentence. It is thanks to this kind of method that chatting with chatbots becomes more and more natural.

A Google account is required to install "Actions-server". This account gives access to the DialogFlow console
