import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { BlockElementType, IButtonElement, TextObjectType } from '@rocket.chat/apps-engine/definition/uikit';
import { AppEnum } from '../enum/App';
import { BoilerplateEnum } from '../enum/Boilerplate';
import { notifyUser } from '../lib/message';

export class ExecutePreMessageSentPreventHandler {
    constructor(
        private readonly app: IApp,
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly persistence: IPersistence,
    ) {}

    public async run(message: IMessage): Promise<boolean> {
        return false;
    }
}
