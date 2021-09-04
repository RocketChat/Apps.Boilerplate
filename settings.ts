import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';
import { SettingEnum } from './enum/Setting';
export const settings: Array<ISetting> = [
    {
        id: SettingEnum.YOUR_SETTING_NAME,
        type: SettingType.STRING,
        packageValue: '',
        required: false,
        public: false,
        i18nLabel: SettingEnum.YOUR_SETTING_NAME,
        i18nDescription: SettingEnum.YOUR_SETTING_DESCRIPTION,
    },
];
