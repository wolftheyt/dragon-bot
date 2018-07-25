const Discord = require('discord.js');
const client = new Discord.Client();
var afkIds = []
var warnings = []
var bannedWords = ['fuck','fag','shit','asshole','cunt','cnut','bitch','dick','d1ck','pussy','b1tch','blowjob','cock','c0ck','nigg']

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
	var content = message.content
	var author = message.author
	var channel = message.channel
	var guild = message.guild
	var roles = guild.roles
	var dragonBotRole = roles.find('name','DragonBot')
	var ownerRole = roles.find('name','Owner')
	var devRole = roles.find('name','Developer')
	var adminRole = roles.find('name','Admin')
	var member = message.member
	var mention = message.mentions.members.first()
	var prefix = '.'
	var cursing = false
	if (mention && !member.roles.has(dragonBotRole.id)) {
		var found = false
		for (var i = 0;i < afkIds.length;i++) {
			if (afkIds[i] === mention.id) {
				found = afkIds[i]
			}
		}
		if (found) {
			var id = '<@' + found + '>'
			message.reply(id + ' is AFK right now!');
		}
	}
	var isAFK = false
	for (var i = 0;i < afkIds.length;i++) {
		if (afkIds[i] === author.id) {
			isAFK = true
			delete afkIds[i]
		}
	}
	if (isAFK) {
		channel.send('Welcome back ' + author + '! I have removed your AFK status')
	}
	if (content.substring(0,1) === prefix) {
		var args = content.substring(1).toLowerCase()
		var space = content.search(' ')
		var extraString = ''
		if (space && space >= 1) {
			extraString = args.substring(space + 1)
			args = args.substring(0,space-1)
		}
		switch(args) {
			case 'ping': channel.send('Pong!');
				break;
			case 'afk': channel.send('Set status of ' + author + ' to AFK');
				for (var i = 0;i < afkIds.length;i++) {
					if (afkIds[i] === author.id) {
						delete afkIds[i]
					}
				}
				afkIds.push(author.id);
				break;
			case 'kick' :
				if (member.roles.has(ownerRole.id) && mention) {
					channel.send('Kicked ' + mention.displayName + 'from the server!')
					mention.kick("You've been kicked by a staff member!")
				}
				break;
			case 'ban' :
				if (member.roles.has(ownerRole.id) && mention) {
					channel.send('Banned ' + mention.displayName + 'from the server!')
					guild.ban(mention)
				}
				break;
			case 'warn' :
				if (mention && (member.roles.has(ownerRole.id) || member.roles.has(devRole.id) || member.roles.has(adminRole.id))) {
					var space = extraString.search(' ')
					if (space && mention) {
						var warning = extraString.substring(space + 1)
						channel.send('Successfully warned ' + mention + ' for: ' + warning + '.')
						warnings.push([mention.id, warning, author.id])
					}
				}
				break;
			case 'warnlist' :
				var warningsEmpty = true
				if (warnings.length >= 1 && (member.roles.has(ownerRole.id) || member.roles.has(devRole.id) || member.roles.has(adminRole.id))) {
					for (var i = 0;i < warnings.length;i++) {
						let v = warnings[i]
						if (v) {
							warningsEmpty = false
							console.log('not empty')
							channel.send('Player: <@' + v[0] + '> | Reason: ' + v[1] + ' | Moderator: <@' + v[2] + '>')
						}
					}
				}
				if (warningsEmpty) {
					channel.send('There are no current warnings!')
				}
				break;
			case 'clearwarns' :
				if (mention && (member.roles.has(ownerRole.id) || member.roles.has(devRole.id) || member.roles.has(adminRole.id))) {
					for (var i = 0;i < warnings.length;i++) {
						var v = warnings[i]
						if (v) {
							if (v[0] === mention.id) {
								delete warnings[i]
							}
						}
					}
					channel.send('Successfully cleared warns of ' + mention)
				}
				break;
			case 'despacito2' : channel.send('https://www.youtube.com/watch?v=W3GrSMYbkBE')
				break;
		}
	}
	for (var i = 0;i < bannedWords.length;i++) {
		var search = (' ' + content.toLowerCase()).search(bannedWords[i])
		if (search >= 1) {
			cursing = true
		}
	}
	if (cursing) {
		channel.send(author + ', Watch your language!')
		message.delete()
	}
});

client.login(process.env.'NDcxNDI5MTQ0OTgzNTAyODU5.Djk-jQ.1O9trBBX-F3V2M90ooGWEVNBW0I');
