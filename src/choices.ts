// This is a Companion layer file associating a Comm layer enum with
// a Companion artifact, DropdownChoice. In this file i18n can happen if
// needed
import { DropdownChoice } from '@companion-module/base'
import { EasyRecordCGBackground, EasyRecordCGCommands } from './EasyRecord-connection/index.js'

export function getBackgroundChoices(): DropdownChoice[] {
	return [
		{ id: EasyRecordCGBackground.Transparent, label: 'Transparent' },
		{ id: EasyRecordCGBackground.Green, label: 'Green' },
		{ id: EasyRecordCGBackground.Black, label: 'Black' },
		{ id: EasyRecordCGBackground.Image, label: 'Image' },
	]
}

export function getCommandChoices(): DropdownChoice[] {
	return [
		{ id: EasyRecordCGCommands.Play, label: 'Play' },
		{ id: EasyRecordCGCommands.Stop, label: 'Stop' },
		{ id: EasyRecordCGCommands.Update, label: 'Update' },
		{ id: EasyRecordCGCommands.Next, label: 'Next' },
	]
}
