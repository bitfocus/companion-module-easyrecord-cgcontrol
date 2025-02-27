import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type EasyRecordCGConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { feedbackId } from './feedbackId.js'
import { EasyRecordCGConnection, type EasyRecordCGState, EasyRecordCGStateUtil } from './EasyRecord-connection/index.js'

export class EasyRecordCGInstance extends InstanceBase<EasyRecordCGConfig> {
	config!: EasyRecordCGConfig
	conn!: EasyRecordCGConnection
	state: EasyRecordCGState

	constructor(internal: unknown) {
		super(internal)
		this.state = EasyRecordCGStateUtil.Create()
	}

	async init(config: EasyRecordCGConfig): Promise<void> {
		this.config = config
		this.conn = new EasyRecordCGConnection()
		this.conn.on('stateChanged', (newState: EasyRecordCGState, paths: string[]) => {
			this.state = newState
			const changedFeedbacks = new Set<feedbackId>()
			for (const path of paths) {
				const playingMatch = path.match(/display.(\d+).playing/)
				if (playingMatch) {
					changedFeedbacks.add(feedbackId.IsPlaying)
				}
				const backgroundMatch = path.match(/display.(\d+).background/)
				if (backgroundMatch) {
					changedFeedbacks.add(feedbackId.Background)
				}
			}
			if (changedFeedbacks.size > 0) this.checkFeedbacks(...Array.from(changedFeedbacks))
		})

		this.conn.on('connected', () => {
			this.log('info', 'Connected to CG server! Competition code ' + this.config.competitionCode)
		})

		this.conn.on('disconnected', () => {
			this.log('info', 'Disconnected from CG server!')
		})

		this.conn.on('error', (error) => {
			this.log('error', `Error occurred: ${error}`)
		})
		await this.conn.connect(this.config.competitionCode)

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
	}

	async configUpdated(config: EasyRecordCGConfig): Promise<void> {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(EasyRecordCGInstance, UpgradeScripts)
