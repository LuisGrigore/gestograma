class_name WordGridUi extends Control

@export var _view :WordGridView = null
@export var _controller :WordGridController = null
var _model:WordGridModel = null
var _input_gatherer: WordRowInputGatherer = null
signal completed(success:bool)

func init_instance(model:WordGridModel, input_gatherer: WordRowInputGatherer) -> void:
	var timer = Timer.new()
	add_child(timer)
	timer.wait_time = 3
	timer.one_shot = true
	
	_model = model
	_input_gatherer = input_gatherer
	_view.init_instance(_model,timer)
	_controller.init_instance(_model, _view, _input_gatherer,timer)
	_controller.completed.connect(_on_completed)
	
func _on_completed(success:bool):
	completed.emit(success)
