import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { IUIKitResponse, TextObjectType, UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { BoilerplateEnum } from '../enum/Boilerplate';
import { getUIData, persistUIData } from '../lib/persistence';
import { boilerplateModal } from '../modals/Boilerplate';

export class ExecuteBlockActionHandler {
    constructor(
        private readonly app: IApp,
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly modify: IModify,
        private readonly persistence: IPersistence,
    ) {}

    public async run(context: UIKitBlockInteractionContext): Promise<IUIKitResponse> {
        const contextData = context.getInteractionData();

        // Gets previous uiData
        // Each change in the form runs this method, so we need to persist what we had before with the new changes
        let uiData = (await getUIData(this.read.getPersistenceReader(), contextData.user.id)) || {};

        const { actionId, value = '' } = contextData;
        const [action, subAction] = actionId.split('#');
        let data: any = {};

        switch (action) {
            case BoilerplateEnum.SELECT_ID:
                // Add the selected value to the data that will be added to uiData
                data = { [BoilerplateEnum.SELECT_ID]: value };
                break;
            default:
                return context.getInteractionResponder().successResponse();
        }

        // Update the uiData with the new data
        uiData = Object.assign(uiData, data);

        // Persists UI Data
        await persistUIData(this.persistence, contextData.user.id, uiData);

        // Update modal so it shows data that might be dependent on the user's selection
        const modal = await boilerplateModal({ modify: this.modify, read: this.read, user: context.getInteractionData().user });
        this.modify.getUiController().updateModalView(modal, { triggerId: context.getInteractionData().triggerId }, context.getInteractionData().user);
        return context.getInteractionResponder().successResponse();
    }
}
