const Card = require('../../card/card')
const { Command } = require('discord.js-commando')

const winston = require('winston')

class ImageArtCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'art',
            aliases: ['a', 'art-image'],
            group: 'card',
            memberName: 'art',
            description: 'Displays the artist and full art from the card.',
            examples: [
                'art raza',
                'a secretkeeper'
            ],
            args: [
                {
                    key: 'cardName',
                    prompt: 'what card are you searching for?\n',
                    type: 'string'
                }
            ]
        })
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm' && !msg.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) { return }
        if (msg.channel.type !== 'dm' && !msg.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) {
            return msg.reply('sorry, I don\'t have permission to attach files here, so I can\'t show card art.').catch(winston.error)
        }

        if (!msg.channel.typing) { msg.channel.startTyping() }
        const card = await Card.findByName(args.cardName).catch(winston.error)
        if (msg.channel.typing) { msg.channel.stopTyping() }
        
        if (!card) { return msg.reply(`sorry, I couldn't find a card with a name like '${args.cardName}'`).catch(winston.error) }

        const filename = await card.getImage('art').catch(winston.error)
        if (!filename) { return msg.reply(`sorry, there was a problem getting the art for ${card.name}`).catch(winston.error) }

        return msg.say(`**${card.name}**\n**Artist**: ${card.artist}`, { file: { attachment: filename } }).catch(winston.error)
    }
}

module.exports = ImageArtCommand
