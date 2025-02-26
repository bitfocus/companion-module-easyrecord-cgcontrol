import { WebSocket } from 'ws'
import { EasyRecordCGBackground, EasyRecordCGCmdType } from './enums.js'
import { type EasyRecordCGCmd, type EasyRecordCGState } from './types.js'

type onCbkType = (key: string, value: any) => void

export class EasyRecordCGConnection {
	#conn!: WebSocket
	#competitionCode!: string
	#state: EasyRecordCGState

	#registeredHandlers: any = { stateUpdated: [] }
	constructor() {
		this.#state = {
			isPlaying: {},
			background: EasyRecordCGBackground.Transparent,
		}
	}

	on(event: string, fun: onCbkType): void {
		this.#registeredHandlers[event].push(fun)
	}

	async connect(competitionCode: string): Promise<void> {
		this.#competitionCode = competitionCode

		// channel id can be any number, just as long as it is there
		const url = 'wss://easyrecord.se:8081?' + this.#competitionCode + '&name=CompanionCGModule' + '&id=999&type=11'

		console.log('debug', 'Trying to connect to ' + url)
		this.#conn = new WebSocket(url)
		this.#conn.on('open', () => {
			console.log('info', 'Connected to CG server!')
			console.log('debug', url)
		})

		this.#conn.on('message', (message) => {
			console.log('debug', 'Received message:', JSON.stringify(message))
		})

		this.#conn.on('error', (error) => {
			console.log('error', `Error occurred: ${error}`)
		})

		this.#conn.on('close', () => {
			console.log('info', 'Client disconnected')
		})
	}

	getState(): EasyRecordCGState {
		return this.#state
	}

	async send(cmd: string): Promise<void> {
		this.#conn.send(cmd)
	}

	async play(displayId: number): Promise<void> {
		// This should be as a reaction from server, this is not implemented serverside
		this.#state.isPlaying[displayId] = true
		this.#registeredHandlers['stateUpdated'].forEach((fun) => fun('isPlaying', this.#state.isPlaying))

		await this.#sendCmd({
			type: EasyRecordCGCmdType.Control,
			display: this.#getDisplayString(displayId),
			command: 'play()',
		})
	}

	async stop(displayId: number): Promise<void> {
		// This should be as a reaction from server, this is not implemented serverside
		this.#state.isPlaying[displayId] = false
		this.#registeredHandlers['stateUpdated'].forEach((fun) => fun('isPlaying', this.#state.isPlaying))

		await this.#sendCmd({
			type: EasyRecordCGCmdType.Control,
			display: this.#getDisplayString(displayId),
			command: 'stop()',
		})
	}

	async update(displayId: number): Promise<void> {
		await this.#sendCmd({
			type: EasyRecordCGCmdType.Control,
			display: this.#getDisplayString(displayId),
			command: 'update()',
		})
	}

	async next(displayId: number): Promise<void> {
		await this.#sendCmd({
			type: EasyRecordCGCmdType.Control,
			display: this.#getDisplayString(displayId),
			command: 'next()',
		})
	}

	async setBackground(displayId: number, background: EasyRecordCGBackground): Promise<void> {
		// This should be as a reaction from server, this is not implemented serverside
		this.#state.background = background
		this.#registeredHandlers['stateUpdated'].forEach((fun) => fun('background', this.#state.background))

		await this.#sendCmd({
			type: EasyRecordCGCmdType.Control,
			display: this.#getDisplayString(displayId),
			command: 'background("' + background + '")',
		})
	}

	#getDisplayString(displayId: number): string {
		return this.#competitionCode + '.21.' + String(displayId)
	}

	async #sendCmd(cmd: EasyRecordCGCmd): Promise<void> {
		const json = JSON.stringify(cmd)
		console.log('SEND', json)
		this.#conn.send(json)
	}
}
