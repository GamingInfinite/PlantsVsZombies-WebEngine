# Plants Vs. Zombies: UNOFFICIAL WEB ENGINE
<p align="center">
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="Typescript">
    <img src="https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white" alt="Svelte">
    <img src="https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white" alt="JSON">
    <img src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E" alt="Prettier">
    <br>
    <img src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="VSCode">
    <img src="https://img.shields.io/static/v1?style=for-the-badge&message=Snowpack&color=2E5E82&logo=Snowpack&logoColor=FFFFFF&label=" alt="Snowpack">
    <br>
    <a href="https://discord.gg/etYzjyV9qj"><img src="https://img.shields.io/discord/785704016054452264?color=%23420690&logo=discord&style=for-the-badge" alt="discord"></a>
    <a href="https://www.twitch.tv/VoidlingHub"><img src="https://img.shields.io/twitch/status/VoidlingHub?color=%23420690&style=for-the-badge"></a>
    <a href="https://twitter.com/VoidBaroness"><img src="https://img.shields.io/static/v1?style=for-the-badge&message=Twitter&color=1DA1F2&logo=Twitter&logoColor=FFFFFF&label="></a>
</p>

## ⚠️ DISCLAIMER ⚠️

Legal: This project is in no way affiliated with PopCap, EA, or any other company involved in the production of the official PvZ Series. Please support them by buying and playing PvZ (Not PvZ 2 because it has microtransactions and I get into why that's bad later) or PvZ GOTY edition.

Players: If you're somehow on this repo, good on you. You follow my GitHub account enough to check this shit out. For now, y'all basically have nothing to do except generate ideas in my twitch (and soon Youtube) streams, because the zombie apocalypse hasn't started yet.  That is to say that there's no real game right now.

Devs: If you have any plans of creating your own version with this as a base, go right ahead. Literally just fork the project and add your own spin to it. Just know that I'm gonna be keeping track of forks of this particular project, and if I think that you or your team did a good enough job or had a cool concept in mind, you have an opportunity for your content to become part of the next release of this engine. Your names will be credited in what I hope will become a hilarious chaotic mess of a credits roll, and many players that just play the base game will be able to experience what you put together.

Now with the disclaimers out of the way for various involved parties...

## About the Project

### Intro

Welcome one and all to the spectacle that is my brain and how it operates. As of the initial commit to this repository I've only worked like 4-5 hours on it and it has already blown wildly out of proportion in my head about what I want this to eventually become. Below you'll find a list of features that will either be checked or unchecked, and as you might have guessed, what's checked is completed, and what's unchecked is planned but is either on the table or is being done currently.

### An Actual About

This project started as me literally having played through the entirety of PvZ GOTY edition and saying "Wow, PvZ 2 really has been a terrible gameplay experience every time I've tried to play". For context, I've installed, played, and uninstalled this game about halfway through on about 4 seperate occasions. I installed it when the game launched, and to what I remember I had a fun time playing it, but somewhere along the way I felt it started to get boring. The time travel idea was interesting, but not enough to hold my interest. Even early on there were plants and abilities they were keeping behind a pay wall. So I decided to uninstall and maybe in a couple years it would get better, and I'd want to play it again.

#### Some time Passed...

and I installed it again, and now there was not only a paywall on some plants, there was effectively a gacha game mechanic where you could upgrade plants, and while in theory that seems cool because it keeps the early game plants viable while progressing through the game allowing a larger difficulty curve, it's kinda shitty because it is ALSO effectively locked behind a paywall, being a gacha mechanic that is rarely ever free, some of the better plants as well as some of the original plant cast is locked behind a paywall on top of that, but then the worst part is, they'd rearranged the story mode. As far as I can remember, in the early releases of this game had a linear story. You had to progress through each time period after beating the boss fight at the end. But on this second attempt, they'd restructured it to where the key wasn't specific, you could use it on ANY time period. You could effectively softlock yourself because the game didn't force you to use it on the one it wanted you to go to.

#### Anyway...

On the third attempt it was effectively the same thing, except they made the story mode where you literally get all the keys right at the beginning after beating Egypt, which, while a cool addition, still left a lot to the player to figure out about where they needed to go and what plants they realistically needed to get.

#### And on the fourth attempt...

Is the state PvZ 2 is in right now, which is full of the same microtransactions I mentioned before, but has restored the Story Mode to what I think it should've been, which is linear, going from time period to time period after the boss fight.

#### So basically...

I enjoyed playing through PvZ GOTY. It was very enjoyable, and I haven't even beaten all puzzles or minigames, or even gotten through the second playthrough. But I so enjoy PvZ 2s art design, but it gets caught in the microtransactional mess that the heads decided it needed to be.

#### So I've Sent Myself on A Quest

Sure I have other projects I should probably be working on, but this is a series that I see myself caring about, and I know that many others care about deeply. It's a game that a whole generation or two grew up with, and is something I definitely had fun with playing through the first game.

I will create an environment where, while you won't be able to play the original campaign from PvZ 1 or 2, you could absolutely take the time to fully recreate it, and we'll have fresh content for you to play through as well.

## Features

✅ = Done 🟨 = In Progress ❌ = Not Started
| Feature Name | Description |Status|
|:--------------------:|:---------------:|:----:|
|Maps|This is literally the fundemental way the game works as a stratedgy game like it wouldn't work without this. Basically I'm creating a way to programatically create maps, and to just let the artists do their thing by giving them a height and effectively infinite width to work with.| ✅ |
|Seed Selection and Usage|Yeah so this is basically in chronological order. I've found a neat Jsfiddle that showcases the dragging of elements on a canvas using mousedown and move and up to tell where on a canvas it should be drawing a thing in relative to the cursor which I will be using majority of for seeds and the shovel and other things that require clicking| ✅ |
|Plant Functionality|I mean obviously, this will always be a WIP part of the engine, as I add more plants to the base version of the engine, but I think I found a pretty elegant solution between having 4 different arrays to keep track of all necesssary information and 2 sets of functions per plant.|🟨|
|Plant Interactions|This only really matters for the shovel, and any plants that need to be clicked on in order to attack (eg. several plants in PvZ2). Also technically necessary for Wall-Nut first-aid.|🟨|
|JSON Standardization|It's so stupid that Typescript does not support inline JSON in Enums.  It would literally make my life so much easier because I just stuff all of the JSON information I need into one Enum and then I pull from one source instead of a million different arrays.  This one isn't even necessarily on me but I will do seperate JSON files for adventure mode levels, and Plants will literally have to be refactored when Typescript finally allows JSON Enums.|❌|

## Credits

PopCap Games: Responsible for creating the game that everyone loves.

EA Games: Responsible for at the very least creating PvZ2 which in a way inspired me to create this project.

GamingInfinite: Main Coder/Code Director

When artists start working on this they will get mentions here
