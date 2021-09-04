import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';
import { BoilerplateApp } from '../BoilerplateApp';
import { ApiEnum } from '../enum/Api';

export class BoilerplateEndpoint extends ApiEndpoint {
    public path: string = ApiEnum.BOILERPLATE;

    constructor(public app: BoilerplateApp) {
        super(app);
    }

    // tslint:disable-next-line:max-line-length
    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persistence: IPersistence): Promise<IApiResponse> {
        return this.success();
    }
}
