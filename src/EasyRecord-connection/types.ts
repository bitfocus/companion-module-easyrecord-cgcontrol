import { type EasyRecordCGCmdType, type EasyRecordCGBackground } from './enums.js'

export type EasyRecordCGState = {
	isPlaying: { [key: string]: boolean }
	background: EasyRecordCGBackground
}

export type EasyRecordCGCmd = {
	type: EasyRecordCGCmdType
	display: string
	command: string
}
