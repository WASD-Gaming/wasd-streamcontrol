# WASD StreamControl
A completely reworked version of StreamControl using electron. Outputs to a json file in the same format as StreamControl making it compatible with any HTML overlays that currently rely on stream control.

Some things to note:

The Clip Stream buttons do not work out of the box. They require the use of a custom OBS script I've developed that is currently in testing.

Player history populates with random placeholder info. It's not a bug but I'm too lazy to change it.

**YOU MUST SELECT A GAME FOR THE CHARACTER LIST TO POPULATE**. Even though the app saves the last selected game the characters will not populate until you select a game from the drop-down. This will eventually be fixed.

## Hotkeys
* Player 1 score up > F20
* Player 1 score down > F21
* Player 2 score up > F22
* Player 2 score down > F23
* Swap players > F19
* Save changes  > F24

## To-Dos
Various features I plan to add in no particular order:
- [ ] Start.gg support.
- [ ] Encorporate direct Tweeting from app including clip selection.
- [ ] Enable custom hotkeys.
- [ ] Custom tweet templates.

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

### Twitter Instructions
This feature is integrated into Challonge and requires the use of 'Cutom Fields' to work properly.
1. Create a REQUIRED Custom Field of type Text to collect a player's Twitter handle. (make sure it is the first question)
2. Click various buttons to generate tweets.

Suggested question text: **Twitter Handle (enter N/A if you don't have one or don't want to be tagged in a results post):**

## Build Instructions
1. yarn install
2. yarn start

To build a new portable exe run ```electron-builder --win portable```
