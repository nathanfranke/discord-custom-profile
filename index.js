const { Jimp } = require('jimp');
const fs = require('fs');

const DEFAULT_MARGIN = 2;
const ICON_MARGINS = {
	beta: 4,
	bot: 4,
	system: 4,
	verified: 4,
};

(async () => {
	let args = process.argv.slice(2);

	let lines = [];

	for (let arg of args) {
		let segments = [];

		let end = (type) => {
			if (current_type !== type) {
				throw new Error(`Ending segment of wrong type (found ${type}, expected ${current_type}).`);
			}
			if (current_segment == '') {
				return;
			}
			segments.push({
				type: current_type,
				value: current_segment,
			});
			current_type = 'raw';
			current_segment = '';
		};
		let start = (type) => {
			end('raw');
			current_type = type;
		};

		let current_segment = '';
		let current_type = 'raw';
		for (let char of arg) {
			if (char === '<') {
				start('image');
				continue;
			} else if (char === '>') {
				end('image');
				continue;
			}
			if (char === '{') {
				start('large');
				continue;
			} else if (char === '}') {
				end('large');
				continue;
			}
			if (char === '[') {
				start('role');
				continue;
			} else if (char === ']') {
				end('role');
				continue;
			}
			current_segment += char;
		}

		end('raw');

		lines.push(segments);
	}

	console.log(`Configuration is valid: ${JSON.stringify(lines)}`);

	let emotes_path = __dirname + '/_emotes';
	await fs.promises.rm(emotes_path, { recursive: true, force: true });
	await fs.promises.mkdir(emotes_path);

	let emote_count = 0;
	let results = [];
	for (let line of lines) {
		let line_result = "";

		let _icon_progress = [];
		let _icon_margin = 0;
		let add_icon = async (icon) => {
			try {
				_icon_progress.push(await Jimp.read(`./items/${icon}.png`));
				_icon_margin = ICON_MARGINS[icon] || DEFAULT_MARGIN;
			} catch (e) {
				throw new Error(`Failed to load icon '${icon}'. It probably doesn't exist! ${e}`);
			}
		};
		let finish_icons = async () => {
			if (_icon_progress.length === 0) {
				return;
			}

			let full_width = 0;
			let height = 0;
			for (let icon of _icon_progress) {
				full_width += icon.width;
				height = Math.max(height, icon.height);
			}

			let full_image = new Jimp({
				width: height * Math.ceil(full_width / height),
				height,
			});

			{
				let x = 0;
				for (let icon of _icon_progress) {
					full_image.composite(icon, x, 0);
					x += icon.width;
				}
			}

			for (let x = 0; x < full_width - _icon_margin; x += height) {
				++emote_count;

				let emote = full_image.clone().crop({
					x,
					y: 0,
					w: height,
					h: height,
				});
				emote.write(`${emotes_path}/p${emote_count}.png`);

				line_result += `:p${emote_count}:`;
			}

			_icon_progress.length = 0;
		};

		for (let segment of line) {
			switch (segment.type) {
				case 'raw':
					await finish_icons();
					line_result += segment.value;
					break;
				case 'image':
					await add_icon(segment.value);
					break;
				case 'large':
					for (let char of segment.value) {
						if (char == ' ') {
							char = '_';
						} else if (char == char.toUpperCase()) {
							char = char.toLowerCase();
						}
						await add_icon(`large/${char}`);
					}
					break;
				case 'role':
					for (let char of segment.value) {
						if (char == ' ') {
							char = '_';
						} else if (char == char.toUpperCase()) {
							char = `${char.toLowerCase()}2`;
						}
						await add_icon(`role/${char}`);
					}
					break;
			}
		}
		await finish_icons();

		results.push(line_result);
	}

	if (emote_count >= 8) {
		console.log();
		console.log("***** ERROR! *****");
		console.log("Too many emotes! Discord only allows 7 emotes in your profile.");
		console.log();
		console.log("Continuing in 5 seconds...");
		await new Promise(res => setTimeout(res, 5000));
	}

	console.log();
	console.log("Done!");
	console.log("Step 1) Upload the emotes in '_emotes/' to your server.");
	console.log("Step 2) Copy the following text to your Discord profile:");
	console.log();
	console.log("~~~");
	console.log(results.join("\n"));
	console.log("~~~");
	console.log();
})();
