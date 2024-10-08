# WASD StreamControl
A completely reworked version of StreamControl using electron. Outputs to a json file in the same format as StreamControl making it compatible with any HTML overlays that currently rely on StreamControl.

Some things to note:

The Clip Stream buttons do not work out of the box. They require the use of a custom OBS script I've developed that is currently in testing.

Player history populates with random placeholder info on launch. It's not a bug but it's not important enough to xhange yet.

Stream queue currently only supports single event Startgg tournaments. I'm working out a way to better support multi-event tournaments but as I run a lot of single event online tournaments this was my priority.

Disclaimer: Code is messy at the moment. I've been focusing on "make X work" and not "what's the cleanest way to make X work". Feel free to contribute to code cleanup. I will eventually do a pass to clean things up.

## Hotkeys
* Player 1 score up > F20
* Player 1 score down > F21
* Player 2 score up > F22
* Player 2 score down > F23
* Swap players > F19
* Save changes  > F24

## To-Dos
Various features I plan to add in no particular order:
- [ ] Enable custom hotkeys.
- [ ] Custom tweet templates.
- [ ] Allow users to provide their own API keys.
- [ ] Allow users to select what stream to show matches for. (And potentially add pagination)
- [ ] Code cleanup.

## Usage Instructions
General usage of WASD StreamControl is pretty easy. Just select where you'd like your json files saved and use the program as you'd use the OG version of StreamControl.
1. File > Select Save Path...
2. ??
3. Profit.

### Match History Instructions
The 'Match History' tab is currently manual. In order to make it work follow the steps below:
1. Insert bracket URL on 'Match Info' page
2. Select game from drop down.
3. Select 1+ characters for each player.
4. Once the set as concluded click 'Save Set'

### Twitter (X) Instructions
For Startgg, this pulls from the linked X account on the player profile.

For Challonge, this feature requires the use of 'Cutom Fields' to work properly.
1. Create a REQUIRED Custom Field of type Text to collect a player's X handle. (make sure it is the first question)
2. Click various buttons to generate tweets.

Suggested question text: **Twitter/X Handle (enter N/A if you don't have one or don't want to be tagged in a results post):**

## Build Instructions
1. yarn install
2. yarn start

To build a new portable exe run ```electron-builder --win portable```
