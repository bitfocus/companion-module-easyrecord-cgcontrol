import { combineRgb } from '@companion-module/base'
import type { EasyRecordCGInstance } from './main.js'

export function UpdateFeedbacks(self: EasyRecordCGInstance): void {
	self.setFeedbackDefinitions({
		ChannelState: {
			name: 'Display is currently playing',
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
				return self.conn.getState().isPlaying[Number(disp)]
			},
		},
	})
}
