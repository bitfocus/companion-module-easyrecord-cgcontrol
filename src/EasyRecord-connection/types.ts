import { type EasyRecordCGCmdType, type EasyRecordCGBackground } from './enums.js'

export interface EasyRecordCGState {
	channel: {
		[key: string]: {
			playing: boolean
			background: EasyRecordCGBackground
		}
	}
}

export type EasyRecordCGCmd = {
	type: EasyRecordCGCmdType
	display: string
	command: string
}
