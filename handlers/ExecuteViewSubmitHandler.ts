import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { BoilerplateApp } from '../BoilerplateApp';
import { BoilerplateEnum } from '../enum/Boilerplate';
import { clearUIData, persistUIData } from '../lib/persistence';

export class ExecuteViewSubmitHandler {
	constructor(
		private readonly app: BoilerplateApp,
		private readonly read: IRead,
		private readonly http: IHttp,
		private readonly modify: IModify,
		private readonly persistence: IPersistence,
	) {}

	public async run(context: UIKitViewSubmitInteractionContext) {
		const { user, view } = context.getInteractionData();
		switch (view.id) {
			case BoilerplateEnum.VIEW_ID: {
                console.log(view.state);
				break;
			}
		}
		return {
			success: true,
		};
	}
}
