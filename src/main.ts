import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type EasyRecordCGConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { EasyRecordCGConnection } from './EasyRecord-connection/index.js'

export class EasyRecordCGInstance extends InstanceBase<EasyRecordCGConfig> {
	config!: EasyRecordCGConfig
	conn!: EasyRecordCGConnection

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: EasyRecordCGConfig): Promise<void> {
		this.config = config
		this.conn = new EasyRecordCGConnection()
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
