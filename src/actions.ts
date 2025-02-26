import type { EasyRecordCGInstance } from './main.js'
import type { EasyRecordCGBackground } from './EasyRecord-connection/index.js'
import { getBackgroundChoices, getCommandChoices } from './choices.js'

export function UpdateActions(self: EasyRecordCGInstance): void {
	self.setActionDefinitions({
		control_action: {
			name: 'Control',
			options: [
				{
					id: 'displayId',
					type: 'textinput',
					label: 'Display ID',
					default: '999',
				},
				{
					id: 'cmd',
					type: 'dropdown',
					label: 'Command',
					choices: [...getCommandChoices(), { id: 'toggle', label: 'Toggle' }],
					default: getCommandChoices()[0].id,
				},
			],
			callback: async (event, context) => {
				const disp = await context.parseVariablesInString(String(event.options.displayId!))
				const displayId = Number(disp)
				if (event.options.cmd === 'play') await self.conn.play(displayId)
				else if (event.options.cmd === 'stop') await self.conn.stop(displayId)
				else if (event.options.cmd === 'toggle') {
					if (self.conn.getState().isPlaying[disp]) await self.conn.stop(displayId)
					else await self.conn.play(displayId)
				} else if (event.options.cmd === 'update') await self.conn.update(displayId)
				else if (event.options.cmd === 'next') await self.conn.next(displayId)
			},
		},
		background_action: {
			name: 'Background',
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
				const displayid = await context.parseVariablesInString(String(event.options.displayId!))
				await self.conn.setBackground(Number(displayid), <EasyRecordCGBackground>event.options.background!)
			},
		},
	})
}
