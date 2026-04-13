class_name WordGrid3D extends Node3D

@export var _word_grid_ui :WordGridUi = null#$SubViewport/WordGridUi

var _model:WordGridModel = null
var _input_gatherer: TileRowInputGatherer = null

func init_instance(model: WordGridModel, input_gatherer: TileRowInputGatherer) -> void:
	_model = model
	_input_gatherer = input_gatherer
	_word_grid_ui.init_instance(_model, _input_gatherer)

#func _ready() -> void:
	#_word_grid_ui.init_instance(_model, _input_gatherer)
