import { WebSocket } from 'ws'
import { EasyRecordCGBackground } from './enums.js'

const enum CmdType {
	Control = 'displayControl',
}

type EasyRecordCGCmd = {
	type: string
	display: string
	command: string
}

export class EasyRecordCGConnection {
	#conn!: WebSocket
	#competitionCode!: string

	constructor() {}

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

	async send(cmd: string): Promise<void> {
		this.#conn.send(cmd)
	}

	async play(displayId: number): Promise<void> {
		await this.#sendCmd({
			type: CmdType.Control,
			display: this.#getDisplayString(displayId),
			command: 'play()',
		})
	}

	async stop(displayId: number): Promise<void> {
		await this.#sendCmd({
			type: CmdType.Control,
			display: this.#getDisplayString(displayId),
			command: 'stop()',
		})
	}

	async update(displayId: number): Promise<void> {
		await this.#sendCmd({
			type: CmdType.Control,
			display: this.#getDisplayString(displayId),
			command: 'update()',
		})
	}

	async next(displayId: number): Promise<void> {
		await this.#sendCmd({
			type: CmdType.Control,
			display: this.#getDisplayString(displayId),
			command: 'next()',
		})
	}

	async setBackground(displayId: number, background: EasyRecordCGBackground): Promise<void> {
		await this.#sendCmd({
			type: CmdType.Control,
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
