import { EasyRecordCGBackground } from './enums.js'
import { type EasyRecordCGState } from './types.js'

export function Create(): EasyRecordCGState {
	return {
		channel: {
			'999': {
				playing: false,
				background: EasyRecordCGBackground.Transparent,
			},
		},
	}
}
