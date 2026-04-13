class_name WordGrid3D extends Node3D

@export var _word_grid_ui :WordGridUi = null#$SubViewport/WordGridUi

var _model:WordGridModel = null
var _input_gatherer: TileRowInputGatherer = null
signal completed(success:bool)

func init_instance(model: WordGridModel, input_gatherer: TileRowInputGatherer) -> void:
	_model = model
	_input_gatherer = input_gatherer
	_word_grid_ui.init_instance(_model, _input_gatherer)
	_word_grid_ui.completed.connect(_on_completed)

func _on_completed(success:bool):
	completed.emit(success)
	