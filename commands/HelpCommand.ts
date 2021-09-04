import { IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { notifyUser } from "../lib/message";
import { BoilerplateApp } from "../BoilerplateApp";

class HelpCommand {
    public async run({ app, context, read, modify }: { app: BoilerplateApp, context: SlashCommandContext, read: IRead, modify: IModify }): Promise<void> {
        const room = context.getRoom();
        const user = context.getSender();

        const text =
                `\`/boilerplate modal\` Opens a modal\n` +
                `\`/boilerplate help\` Shows help message`;

        await notifyUser({ app, read, modify, room, user, text });
    }
}

export const helpCommand = new HelpCommand();
