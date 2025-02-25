import type { EasyRecordCGInstance } from './main.js'
import { Backgrounds } from './enums.js'

export function UpdateActions(self: EasyRecordCGInstance): void {
	self.setActionDefinitions({
		control_action: {
			name: 'Control',
			options: [
				{
					id: 'displayId',
					type: 'textinput',
					label: 'Display ID',
					'default': "999",
				},
				{
				    id: 'cmd',
				    type: 'dropdown', 
			    	label: 'Command',
			    	choices:[
			    		{ id: 'play', label: 'Play' },
			        	{ id: 'stop', label: 'Stop' },
			        	{ id: 'update', label: 'Update' },
			        	{ id: 'next', label: 'Next' },
			        ],
			    	default: 'play'
        		},
			],
			callback: async (event, context) => {
				const displayid = await context.parseVariablesInString(String(event.options.displayId!));
				if(event.options.cmd === "play")
					await self.conn.play(Number(displayid))
				else if(event.options.cmd === "stop")
					await self.conn.stop(Number(displayid))
				else if(event.options.cmd === "update")
					await self.conn.update(Number(displayid))
				else if(event.options.cmd === "next")
					await self.conn.next(Number(displayid))				
			},
		},
		background_action: {
			name: 'Background',
			options: [
				{
					id: 'displayId',
					type: 'textinput',
					label: 'Display ID',
					'default': "999",
				},
				{
				    id: 'background',
				    type: 'dropdown', 
			    	label: 'Background',
			    	choices: [
						{ id: Backgrounds.Transparent , label: "Transparent" },
						{ id: Backgrounds.Green , label: "Green" },
						{ id: Backgrounds.Black , label: "Black" },
						{ id: Backgrounds.Image , label: "Image" },

					],
			    	default: Backgrounds.Transparent
        		},
			],
			callback: async (event, context) => {
				const displayid = await context.parseVariablesInString(String(event.options.displayId!));
				await self.conn.setBackground(Number(displayid), <Backgrounds>event.options.background!)
			},
		},
	})
}
