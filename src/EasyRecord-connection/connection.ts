import { WebSocket } from 'ws'
import { EventEmitter } from 'eventemitter3'
import { EasyRecordCGBackground, EasyRecordCGCmdType } from './enums.js'
import { type EasyRecordCGCmd, type EasyRecordCGState } from './types.js'
import * as State from './state.js'

type EasyRecordCGEvents = {
	stateChanged: [EasyRecordCGState, string[]]
	disconnected: []
	connected: []
	error: [string]
}

export class EasyRecordCGConnection extends EventEmitter<EasyRecordCGEvents> {
	#conn!: WebSocket
	#competitionCode!: string
	#state: EasyRecordCGState

	constructor() {
		super()
		this.#state = State.Create()
	}

	async connect(competitionCode: string): Promise<void> {
		this.#competitionCode = competitionCode

		// channel id can be any number, just as long as it is there
		const url = 'wss://easyrecord.se:8081?' + this.#competitionCode + '&name=CompanionCGModule' + '&id=999&type=11'

		this.#conn = new WebSocket(url)
		this.#conn.on('open', () => {
			this.emit('connected')
		})

		this.#conn.on('message', (message) => {
			console.log('debug', 'Received message:', JSON.stringify(message))
		})

		this.#conn.on('error', (error) => {
			this.emit('error', error)
		})

		this.#conn.on('close', () => {
			this.emit('disconnected')
		})
	}

	async play(displayId: number): Promise<void> {
		// This should be as a reaction from server, this is not implemented serverside
		this.#state.channel[displayId].playing = true
		this.emit('stateChanged', this.#state, ['display.' + displayId + '.playing'])

		await this.#sendCmd({
			type: EasyRecordCGCmdType.Control,
			display: this.#getDisplayString(displayId),
			command: 'play()',
		})
	}

	async stop(displayId: number): Promise<void> {
		// This should be as a reaction from server, this is not implemented serverside
		this.#state.channel[displayId].playing = false
		this.emit('stateChanged', this.#state, ['display.' + displayId + '.playing'])

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
		this.#state.channel[displayId].background = background
		this.emit('stateChanged', this.#state, ['display.' + displayId + '.background'])

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
		this.#conn.send(json)
	}
}
