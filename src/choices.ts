// This is a Companion layer file associating a Comm layer enum with
// a Companion artifact, DropdownChoice. In this file i18n can happen if
// needed
import { DropdownChoice } from '@companion-module/base'
import { EasyRecordCGBackground, EasyRecordCGCommand } from './EasyRecord-connection/index.js'

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
		{ id: EasyRecordCGCommand.Play, label: 'Play' },
		{ id: EasyRecordCGCommand.Stop, label: 'Stop' },
		{ id: EasyRecordCGCommand.Update, label: 'Update' },
		{ id: EasyRecordCGCommand.Next, label: 'Next' },
	]
}
