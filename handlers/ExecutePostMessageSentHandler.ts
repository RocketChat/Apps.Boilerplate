import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { AppEnum } from '../enum/App';
import { ErrorsEnum } from '../enum/Errors';
import { notifyUser } from '../lib/message';

export class ExecutePostMessageSentHandler {
    constructor(
        private readonly app: IApp,
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly persistence: IPersistence,
        private readonly modify: IModify,
    ) {}

    public async run(message: IMessage): Promise<void> {
        const appUser = await this.read.getUserReader().getAppUser(this.app.getID());
        if (!appUser) {
            throw new Error(ErrorsEnum.ERROR_GETTING_APP_USER);
        }
        console.log(message.room.userIds?.indexOf(appUser.id) !== -1, message.sender.id, appUser.id);
        if (message.room.userIds?.indexOf(appUser.id) !== -1 && message.sender.id !== appUser.id) {
            await notifyUser({ app: this.app, read: this.read, modify: this.modify, room: message.room, user: message.sender, text: AppEnum.USER_MESSAGED_BOT });
        }
    }
}
