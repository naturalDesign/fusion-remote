# Description

Remote control for Autodesk Fusion 360. Allows to interact with viewer using Natural Language or Speech interface to perform conversation in chat-like mode.

## Use cases

- Presentations
- Hands-free
- Non-strict interactions
- Command line interface

## Supported platforms

### Current

#### Messengers

- Telegram: [Autodesk Fusion Remote](https://t.me/AutodeskFusionRemote_bot) bot
- Web interface
- api.ai [embedded](https://bot.api.ai/12f482ce-eb42-4136-90ee-eae8763614db)

#### CAD/PDM/PLM

- Autodesk Forge Viewer: [viewer-remote](https://github.com/naturalDesign/viewer-remote)

### Planned

#### Messengers

- Slack
- Facebook Messenger
- Skype
- Cortana (Microsoft)
- Siri (Apple)
- Amazon Alexa
- Android
- iPhone/iPad
- Windows Phone

#### CAD/PDM/PLM

- A360
- Autodesk Revit
- Solidworks
- OnShape

# Supported commands

## Camera control

### Syntax

Controls view cube. Just give the required point of view from one to three in any order:

`[front/back] [top/bottom] [left/right]`

### Samples

`set top, set bottom, top left`

## Update parameter value

Updates the values of defined parameters.

### Syntax

` set param_name to value `

### Samples

`set width 100, set depth to 200`

## Setting visual styles

### Parameters

You can use any of these words to set up an environment.

| id   | name                              | synonym           |
| ---- | --------------------------------- | ----------------- |
| 1    | Shaded                            |                   |
| 2    | Shaded with hidden edges          | shaded hidden     |
| 3    | Shaded with visible edges only    | shaded visible    |
| 4    | Wireframe                         |                   |
| 5    | Wireframe with hidden edges       | wireframe hidden  |
| 6    | Wireframe with visible edges only | wireframe visible |

Keywords could be attached to query too:

`set, visual, visual style`

## Message box

Just alert message box.

### Samples

say hi

## Zoom all

Fits all model to view

### Samples

` zoom all, fit `

# Installation and usage

Save plug-in locally and add it from the **Scripts and Add-ins** menu.

Launch it and set a tick to enable remote control.

Now you can close it by pressing **OK** button.

Open Telegram bot and type commands: [Autodesk Fusion Remote](https://t.me/AutodeskFusionRemote_bot) bot.
