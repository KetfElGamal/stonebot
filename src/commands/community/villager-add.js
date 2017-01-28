import { Command } from 'discord.js-commando'
import MessageManager from '../../message-manager'
import Villager from '../../community/villager'

import { bnetId, bnetServer } from '../../command-arguments'
import winston from 'winston'

module.exports = class VillagerAddCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'villager-add',
            aliases: ['villagers-add', 'v-add', 'va', 'bnet-add', 'b-add', 'ba', '🏡'],
            group: 'community',
            memberName: 'villager-add',
            guildOnly: true,
            description: 'Adds your battle.net id to the community list.',
            details: '`<bnetServer>` can be one of `americas`, `na`, `europe`, `eu`, `asia`\n`<bnetId>` is your battle.net id.',
            examples: ['villager-add americas user#1234', 'villager-add europe user#1234', 'villager-add asia user#1234'],
            args: [ bnetServer, bnetId ]
        })
    }

    async run(msg, args) {
        if (!msg.channel.typing) { msg.channel.startTyping() }
        let result = await Villager.add(msg.guild.id, msg.author.id, args.bnetServer, args.bnetId).catch(winston.error)
        if (!result || typeof result !== 'string') { result = 'sorry, there was an error adding you to the list.' }
        if (msg.channel.typing) { msg.channel.stopTyping() }
        return msg.reply(result).catch(winston.error)
        await MessageManager.deleteArgumentPromptMessages(msg)
    }
}
