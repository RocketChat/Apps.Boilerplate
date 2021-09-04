import { IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { BoilerplateApp } from "../BoilerplateApp";
import { boilerplateModal } from "../modals/Boilerplate";

class ModalCommand {
    public async run({ app, context, read, modify }: { app: BoilerplateApp, context: SlashCommandContext, read: IRead, modify: IModify }): Promise<void> {
        const triggerId = context.getTriggerId();
        if (triggerId) {
            try {
                const modal = await boilerplateModal({ read, modify, user: context.getSender() });
                await modify.getUiController().openModalView(modal, { triggerId }, context.getSender());
            } catch (error) {
                console.log(error);
            }
        }
    }
}

export const modalCommand = new ModalCommand();
