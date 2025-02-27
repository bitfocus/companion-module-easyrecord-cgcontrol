import type { EasyRecordCGInstance } from './main.js'
import type { EasyRecordCGBackground } from './EasyRecord-connection/index.js'
import { getBackgroundChoices, getCommandChoices } from './choices.js'
import { actionId } from './actionId.js'

export function UpdateActions(instance: EasyRecordCGInstance): void {
	instance.setActionDefinitions({
		[actionId.ControlAction]: {
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
				if (event.options.cmd === 'play') await instance.conn.play(displayId)
				else if (event.options.cmd === 'stop') await instance.conn.stop(displayId)
				else if (event.options.cmd === 'toggle') {
					if (instance.state.channel[disp].playing) await instance.conn.stop(displayId)
					else await instance.conn.play(displayId)
				} else if (event.options.cmd === 'update') await instance.conn.update(displayId)
				else if (event.options.cmd === 'next') await instance.conn.next(displayId)
			},
		},
		[actionId.BackgroundAction]: {
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
				await instance.conn.setBackground(Number(displayid), <EasyRecordCGBackground>event.options.background!)
			},
		},
	})
}
