class_name WordGridUi extends Control

@export var _view :WordGridView = null#$WordGridPanel
@export var _controller :WordGridController = null #$Controller
var _model:WordGridModel = null
var _input_gatherer: TileRowInputGatherer = null
signal complete_status(status:bool)

func init_instance(model:WordGridModel, input_gatherer: TileRowInputGatherer) -> void:
	_model = model
	_input_gatherer = input_gatherer
	_view.init_instance(_model)
	_controller.init_instance(_model, _view, _input_gatherer)
	_controller.complete_status.connect(_on_complete_status)
	
func _on_complete_status(status:bool):
	complete_status.emit(status)
#func _ready() -> void:
	#_view.init_instance(_model)
	#_controller.init_instance(_model, _view, _input_gatherer)
