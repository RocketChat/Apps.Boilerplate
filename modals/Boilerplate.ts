import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { TextObjectType } from '@rocket.chat/apps-engine/definition/uikit/blocks';
import { IUIKitModalViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { AppEnum } from '../enum/App';
import { BlocksEnum } from '../enum/Blocks';
import { BoilerplateEnum } from '../enum/Boilerplate';
import { getUIData } from '../lib/persistence';

export async function boilerplateModal({ modify, read, user }: { modify: IModify, read: IRead, user: IUser }): Promise<IUIKitModalViewParam> {
	const viewId = BoilerplateEnum.VIEW_ID;

    // Gets the data from the persistence layer
    const uiData = (await getUIData(read.getPersistenceReader(), user.id)) || {};

	const block = modify.getCreator().getBlockBuilder();
	block.addSectionBlock({ text: block.newMarkdownTextObject(BoilerplateEnum.SELECT_TEXT) });

    // When user changes the selection, the ExecuteBlockActionHandler is run
    // The ExecuteBlockActionHandler will then persist UI data and call updateModalView
    block.addActionsBlock({
        blockId: BoilerplateEnum.BLOCK_ID,
        elements: [
            block.newStaticSelectElement({
                actionId: BoilerplateEnum.SELECT_ID,
                placeholder: block.newPlainTextObject(BoilerplateEnum.SELECT_TEXT),
                options: [{ text: { type: TextObjectType.PLAINTEXT, text: 'Yes' }, value: 'Yes' }, { text: { type: TextObjectType.PLAINTEXT, text: 'No' }, value: 'No' }],
                initialValue: uiData[BoilerplateEnum.SELECT_ID] || 'No',
            }),
        ],
    });

    // If the user has selected Yes, then the modal is updated and shows the following block
    if (uiData[BoilerplateEnum.SELECT_ID] === 'Yes') {
        block.addInputBlock({
            blockId: BoilerplateEnum.BLOCK_ID,
            element: block.newPlainTextInputElement({ actionId: BoilerplateEnum.INPUT_ID }),
            label: {
                type: TextObjectType.PLAINTEXT,
                text: BoilerplateEnum.INPUT_TEXT,
            },
        });
    }

	return {
		id: viewId,
		title: {
			type: TextObjectType.PLAINTEXT,
			text: AppEnum.DEFAULT_TITLE,
		},
        submit: block.newButtonElement({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: BlocksEnum.SAVE,
            },
        }),
		close: block.newButtonElement({
			text: {
				type: TextObjectType.PLAINTEXT,
				text: BlocksEnum.DISMISS,
			},
		}),
		blocks: block.getBlocks(),
	};
}
