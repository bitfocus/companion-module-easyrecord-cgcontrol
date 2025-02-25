import {type SomeCompanionConfigField } from '@companion-module/base'

export interface EasyRecordCGConfig {
	competitionCode: string 
	channelName: string
	channelId: number
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			id: 'username',
			type: 'textinput',
			label: 'Username',
			width: 2
		},
		{
			id: 'password',
			type: 'textinput',
			label: 'Password',
			width: 2
		},
		{
			id: 'blank1',
			type: 'static-text',
			label: '',
			value: '',
			width: 5
		},
		{
			id: 'competitionCode',
			type: 'textinput',
			label: 'Competition code',
			width: 4
		},
	]
}
  