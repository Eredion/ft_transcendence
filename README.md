***
# Transcendence
***

## Table of Contents
```
1. [Summary](#Summary)
2. [Technologies](#Technologies)
3. [Instalation](#Instalation)
4. [Features](#Features)
```
# Summary
 Gif del proyecto

# Technologies :pencil2: 📐
* Backend: Ruby on Rails
* Frontent: backbone.js
* Data baste: postgres
* Monunted on: docker container
* Extra: html, css, scss...

# Instalation 🚀
```
$ git clone https://github.com/Eredion/ft_transcendence.git
$ Make sure your docker is running
$ cd ft_transcendance/
$ docker-compose up --build
$ wait until everything is built (around 10 mins)
$ Open your favourite browser and go to http://127.0.0.1
$ Enjoy!
```

# Features 

## Overview
In this subject you will need to build a website for the mighty pong contest. Your website will help user run pong tournament and play against each other. There will be an admin view, chat with moderators, real time multiplayer online
games. 
There will be guilds and wars!
You will need to follow thoses rules:

- Your website backend should be written in Rails 6.X.X
- You must use a postgresql database 12.1 and no other databases.
- The front end must be written with the help of https://backbonejs.org/ version 1.4.X
- Your website should be a single page app, but user should be able to use the back button on the browser https://en.wikipedia.org/wiki/Singlepage_application
- Your website must be usable on the latest version to date on Google Chrome, Firefox, Safari.
- There must be no unhandled errors or warning when browsing through the website.
- You can use as many gems as you want and any js library (BUT NO FRAMEWORK like vue.js, angular etc...)
- Everything should run with a single call todocker-compose up –build

## Security concerns
Because you are creating a fully-working website, there are a few security concerns that you will have to tackle

- Any password stored in your database must be encrypted
- Your website must be protected against SQL injections
- You must implement some kind of server-side validation for forms and any user input

## User Account
- A user must login using the oauth system of 42 intranet
- A user must be able to choose a unique name that will be displayed on the website
- A user has a number of victory and loss and other stats (ladder level, number of won tournaments, achievements etc...)
- A user must have an avatar generated or uploaded by the user
- A user must be able to activate a 2 factor authentication (like google authenticator or a sms etc...)
- A user can be in 1 guild at a time
- A user can add other users as friends, and see their current status (online, offline, in a game...)
- Each user has a match history (including duel, ladder or tournaments games) that can be consulted by anyone logged-in

## Chat
- Users must be able to create channels public/private or protected by a password
- Users must be able to send direct messages to other user
- Users must be able to block other user and therefore they will not see their messages anymore
- A user that create a new channel is automatically its owner until he leaves the channel
    ◦ owner of a channel can add/change/remove a password to access to the channel
    ◦ owner can select user to be administrator and is also administrator of the channel
    ∗ administrator can ban or mute users for a certain amount of time

- Through the chat interface users should be able to ask other player to do a Pong match
- Through the chat interface users must be able to see other players profiles

## Game
The main purpose of this website is to play pong against other players and show everyone how good you are!
Therefor we should be able to play pong directly on the website and live against an other player.
It can be in a canvas or it can be with 3d effects, it can be ugly but it must be a pong like the one from 1972.
If you want to, you can add power ups, different maps etc... but user must be able to play a default pong game without any added stuff.
The game must be responsive!
Other users can watch the game live without interfering in it.

## Guilds
- Users must be able to create guilds with unique names
- A guild must also have a unique anagram of 5 letters max that will be shown before the name of a user in the chat
- Each time a member of the guild wins a game, some points are added to the guild’s points
- There must be a ranking page of all guilds, visible to any logged-in user
- A guild has a owner and officers
- Guild can declare war to an other guild
    ◦ A war has a start date, an end date and a number of point that the guilds are ready to lose/win as prize for the war
    ◦ A war also has a timetable where random fights can be asked, it’s called a "War time"

∗ When the "War time" is active a member can ask to fight randomly any one from the other guild, if no one of the other guild answer the call after a certain amount of time, the match is automatically won.

∗ Guilds can set the maximum of unanswered match calls per "War time".

∗ There can be only one "War time" match at the same time, to avoid big guilds to flood small ones.

    ◦ Both guild must agree on all terms of the war and the type of match that will count in the war (with or without add-on etc...)
∗ If the guilds agree, any matchs played on ladder or during a tournament will count towards the war effort.

∗ If the guilds add add-ons, only the matchs using said add-ons will count towards the war effort.

∗ During a war, if a member of a guild duels someone from the other guild, the winner will earn war point for his guild.

   ◦ At the end of the war the guild with the highest number of war points will receive the prize from the other guild.
   ◦ A guild can be in one war only at a time.

- Each guild has a war history page, visible to any logged-in user.

## Tournament
There must a permanent ladder tournament with a match making system with a ladder system. (https://en.wikipedia.org/wiki/Ladder_tournament)
Users can play on the ladder, with a rating system, or play casually, without it affecting their rating. There also must be tournaments that can be created by admininstrators or automatically. Rules of said tournament (round robin, single/double eliminations, swiss...) is up to you. User will be allowed to register to the tournament in a timeframe before said tournament.
You can add incentives to tournaments, like title for the winner or other cool stuff.

## Admin
Some user can be appointed administrator of the website.

- They can create tournaments
- Destroy chat channels
- Ban users
- See any chat channels without being listed in it
- Give or remove rights in a chat channel to a user
- Give or remove rights in a guild to a user
