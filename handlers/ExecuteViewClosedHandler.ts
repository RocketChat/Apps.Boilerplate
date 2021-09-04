import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { UIKitViewCloseInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { clearUIData } from '../lib/persistence';

export class ExecuteViewClosedHandler {
    constructor(
        private readonly app: IApp,
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly modify: IModify,
        private readonly persistence: IPersistence,
    ) {}

    public async run(context: UIKitViewCloseInteractionContext) {
        const { user } = context.getInteractionData();
        await clearUIData(this.persistence, user.id);
        return { success: true } as any;
    }
}
