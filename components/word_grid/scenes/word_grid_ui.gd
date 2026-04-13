class_name WordGridUi extends Control

@export var _view :WordGridView = null#$WordGridPanel
@export var _controller :WordGridController = null #$Controller
var _model:WordGridModel = null
var _input_gatherer: TileRowInputGatherer = null
signal completed(success:bool)

func init_instance(model:WordGridModel, input_gatherer: TileRowInputGatherer) -> void:
	_model = model
	_input_gatherer = input_gatherer
	_view.init_instance(_model)
	_controller.init_instance(_model, _view, _input_gatherer)
	_controller.completed.connect(_on_completed)
	
func _on_completed(success:bool):
	completed.emit(success)

