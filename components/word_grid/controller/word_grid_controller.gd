class_name WordGridController extends Node

var _model:WordGridModel = null
@export var _view:WordGridView = null
var _input_gatherer:WordRowInputGatherer = null
var _active_word_row := 0
var _word_row_controllers:Array[WordRowController] = []

signal completed(success:bool)

static func init(model:WordGridModel, view:WordGridView, input_gatherer:WordRowInputGatherer, timer:Timer) -> WordGridController:
	var word_grid_controller = WordGridController.new()
	word_grid_controller.init_instance(model, view, input_gatherer,timer)
	return word_grid_controller
	
func init_instance(model:WordGridModel, view:WordGridView, input_gatherer:WordRowInputGatherer, timer:Timer) -> void:
	_model = model
	if _view == null:
		_view = view
	_input_gatherer = input_gatherer
	for i in _model.get_word_row_models().size():
		var controller = WordRowController.init(_model.get_word_row_models()[i], _view.get_word_row_views()[i], _input_gatherer, timer)
		_word_row_controllers.append(controller)
		add_child(controller)
	
	
func _on_word_submitted(success: bool) -> void:
	if success:
		completed.emit(true)
		return
	if _active_word_row >= _model.get_word_length():
		completed.emit(false)
		return
	_word_row_controllers[_active_word_row].word_submitted.disconnect(_on_word_submitted)
	_active_word_row += 1
	_word_row_controllers[_active_word_row].activate()
	_word_row_controllers[_active_word_row].word_submitted.connect(_on_word_submitted)

func _ready() -> void:
	if _word_row_controllers.size() > 0:
		_word_row_controllers[_active_word_row].activate()
		_word_row_controllers[_active_word_row].word_submitted.connect(_on_word_submitted)
