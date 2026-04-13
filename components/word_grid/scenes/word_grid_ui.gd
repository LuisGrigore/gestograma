class_name WordGridUi extends Control

@onready var _view :WordGridView = $WordGridPanel
@onready var _controller :WordGridController = $Controller
var _model:WordGridModel = null
var _input_gatherer: TileRowInputGatherer = null

func init_instance(model:WordGridModel, input_gatherer: TileRowInputGatherer) -> void:
	_model = model
	_input_gatherer = input_gatherer
	_view.init_instance(_model)
	_controller.init_instance(_model, _view, _input_gatherer)
	
#func _ready() -> void:
	#_view.init_instance(_model)
	#_controller.init_instance(_model, _view, _input_gatherer)
