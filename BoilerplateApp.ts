import {
    IAppAccessors,
    IConfigurationExtend,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IMessage, IPostMessageSent, IPreMessageSentPrevent } from '@rocket.chat/apps-engine/definition/messages';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { IUIKitInteractionHandler, IUIKitResponse, UIKitBlockInteractionContext, UIKitViewCloseInteractionContext, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { BoilerplateCommand } from './commands/BoilerplateCommand';
import { BoilerplateEndpoint } from './endpoints/BoilerplateEndpoint';
import { ErrorsEnum } from './enum/Errors';
import { SchedulerEnum } from './enum/SchedulerEnum';
import { ExecuteBlockActionHandler } from './handlers/ExecuteBlockActionHandler';
import { ExecutePostMessageSentHandler } from './handlers/ExecutePostMessageSentHandler';
import { ExecutePreMessageSentPreventHandler } from './handlers/ExecutePreMessagePreventHandler';
import { ExecuteViewClosedHandler } from './handlers/ExecuteViewClosedHandler';
import { ExecuteViewSubmitHandler } from './handlers/ExecuteViewSubmitHandler';
import { dialogModal } from './modals/DialogModal';
import { boilerplateProcessor } from './processors/boilerplateProcessor';
import { settings } from './settings';

export class BoilerplateApp extends App implements IUIKitInteractionHandler, IPreMessageSentPrevent, IPostMessageSent {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    /*
    Extend Configuration
    Adds settings
    Sets up API endpoints
    Adds slashcommands
    Sets up the scheduler startup settings and processors
    */
    protected async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
        // Settings
        await Promise.all(settings.map((setting) => configuration.settings.provideSetting(setting)));

        // API endpoints
        await configuration.api.provideApi({
            visibility: ApiVisibility.PRIVATE,
            security: ApiSecurity.UNSECURE,
            endpoints: [
                new BoilerplateEndpoint(this),
            ],
        });

        // SlashCommands:
        await configuration.slashCommands.provideSlashCommand(new BoilerplateCommand(this));

        // Scheduler processors:
        configuration.scheduler.registerProcessors([
            {
                id: SchedulerEnum.BOILERPLATE,
                processor: boilerplateProcessor
            }
        ]);
    }

    /* PreMessage Events */
    // Checks if we should run the executePreventor
    public async checkPreMessageSentPrevent(message: IMessage, read: IRead, http: IHttp): Promise<boolean> {
        return true;
    }
    // If checkPrevent returns true, executePrevent is run, which then either prevents or doesn't prevent the message
    public async executePreMessageSentPrevent(message: IMessage, read: IRead, http: IHttp, persistence: IPersistence): Promise<boolean> {
        try {
            const handler = new ExecutePreMessageSentPreventHandler(this, read, http, persistence);
            return await handler.run(message);
        } catch (err) {
            this.getLogger().log(`${ err.message }`);
            return false;
        }
    }

    /* PostMessage Events */
    // Checks if we should run the postMessageHandler
    public async checkPostMessageSent(message: IMessage, read: IRead, http: IHttp): Promise<boolean> {
        // Check if the message is a direct message
        return message.room.type === RoomType.DIRECT_MESSAGE && message.room.userIds?.length === 2;
    }
    // If checkPostMessageSent returns true, executePostMessageSent is run
    public async executePostMessageSent(message: IMessage, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<void> {
        try {
            const handler = new ExecutePostMessageSentHandler(this, read, http, persistence, modify);
            handler.run(message);
        } catch (err) {
            this.getLogger().log(`${ err.message }`);
        }
    }

    /* UIKit Interaction Handlers */
    // UIKit action handler
    // Runs when the user clicks a uikit action button (not close/submit buttons), or changes something on an action block within a modal view
    public async executeBlockActionHandler(context: UIKitBlockInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
        try {
            const handler = new ExecuteBlockActionHandler(this, read, http, modify, persistence);
            return await handler.run(context);
        } catch (err) {
            console.log(err);
            this.getLogger().log(`${ err.message }`);
			const alert = await dialogModal({ text: ErrorsEnum.OPERATION_FAILED, modify });
			return context.getInteractionResponder().openModalViewResponse(alert);
        }
    }
    // UIKit Modal Submit
    public async executeViewSubmitHandler(context: UIKitViewSubmitInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify) {
		try {
			const handler = new ExecuteViewSubmitHandler(this, read, http, modify, persistence);
			return await handler.run(context);
		} catch (err) {
			this.getLogger().log(`${ err.message }`);
			const alert = await dialogModal({ text: ErrorsEnum.OPERATION_FAILED, modify });
			return context.getInteractionResponder().openModalViewResponse(alert);
		}
	}
    // UIKit Modal Close
    public async executeViewClosedHandler(context: UIKitViewCloseInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify) {
        try {
            const handler = new ExecuteViewClosedHandler(this, read, http, modify, persistence);
            return await handler.run(context);
        } catch (err) {
            console.log(err);
            this.getLogger().log(`${ err.message }`);
			const alert = await dialogModal({ text: ErrorsEnum.OPERATION_FAILED, modify });
			return context.getInteractionResponder().openModalViewResponse(alert);
        }
    }
}
