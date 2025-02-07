# discord-custom-profile

Add fancy things to your Discord profile using emotes!

![examples](res/examples.gif)

## Usage

- Install [Node.js](https://nodejs.org/en/) including `npm`
- Clone this repository, or [download](https://github.com/nathanfranke/discord-custom-profile/archive/refs/heads/main.zip) and extract the ZIP.
- **Windows**: Open Windows Terminal and `cd` to the repository folder.
- **Linux/MacOS**: Open a terminal and `cd` to the repository folder.
- Command:
  ```sh
  # Note: Everything is contained within discord-custom-profile/
  npm install
  npm start '{line one}' '<role_blue>[cool]<role_end>'
  ```
  
  Each line can have plain text mixed with segments. Each segment is wrapped in brackets. See [these examples](#examples).
  - `<image>` - Adds an image at `items/NAME.png`.
  - `{text}` - Large text, supports alphabetical characters and spaces.
  - `[role]` - Role text. Should be surrounded by `<role_COLOR>` and `<role_end>`, where `COLOR` is `red`, `green`, `blue`, or `yellow`.

## Examples

- ### Smart
  ```sh
  node index.js 'Cool' '' '{roles}' '<role_green>[Smart]<role_end>'
  ```
  ![smart role example](res/smart.png)

- ### Zodiac
  (Sorry, `libra` is the only zodiac sign included! Feel free to copy `items/libra.png` and change it.)<br>
  ```sh
  node index.js 'Cool' '' '{zodiac}<beta>' '<libra> Libra'
  ```
  ![zodiac example](res/zodiac.png)

- ### Smelly
  ```sh
  node index.js '{smelly}<verified>'
  ```
  ![smelly example](res/smelly.png)

- ### Bot
  ```sh
  node index.js '<bot>{ in csgo}'
  ```
  ![bot example](res/bot.png)
