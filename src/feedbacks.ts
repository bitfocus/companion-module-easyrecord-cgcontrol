import { combineRgb } from '@companion-module/base'
import type { EasyRecordCGInstance } from './main.js'
import { feedbackId } from './feedbackId.js'
import { getBackgroundChoices } from './choices.js'
import type { EasyRecordCGBackground } from './EasyRecord-connection/index.js'

export function UpdateFeedbacks(instance: EasyRecordCGInstance): void {
	instance.setFeedbackDefinitions({
		[feedbackId.IsPlaying]: {
			name: 'Change styld if display is currently active',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'displayId',
					type: 'textinput',
					label: 'Display ID',
					default: '999',
				},
			],
			callback: async (event, context) => {
				const disp = await context.parseVariablesInString(String(event.options.displayId!))
				return instance.state.channel[Number(disp)].playing
			},
		},
		[feedbackId.Background]: {
			name: 'Change style if selected background is active',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'displayId',
					type: 'textinput',
					label: 'Display ID',
					default: '999',
				},
				{
					id: 'background',
					type: 'dropdown',
					label: 'Background',
					choices: getBackgroundChoices(),
					default: getBackgroundChoices()[0].id,
				},
			],
			callback: async (event, context) => {
				const disp = await context.parseVariablesInString(String(event.options.displayId!))
				return instance.state.channel[Number(disp)].background === <EasyRecordCGBackground>event.options.background!
			},
		},
	})
}
