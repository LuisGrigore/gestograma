class_name WordGridController extends Node

var _model:WordGridModel = null
@export var _view:WordGridView = null
var _input_gatherer:TileRowInputGatherer = null
var _active_word_row := 0
var _word_row_controllers:Array[TileRowController] = []

enum CompleteStatus {SUCCESS, FAILURE}
signal complete_status(status:bool)

static func init(model:WordGridModel, view:WordGridView, input_gatherer:TileRowInputGatherer) -> WordGridController:
	var word_grid_controller = WordGridController.new()
	word_grid_controller.init_instance(model, view, input_gatherer)
	return word_grid_controller
	
func init_instance(model:WordGridModel, view:WordGridView, input_gatherer:TileRowInputGatherer) -> void:
	_model = model
	if _view == null:
		_view = view
	#_view.init_instance(model)
	_input_gatherer = input_gatherer
	for i in _model.get_word_row_models().size():
		var controller = TileRowController.init(_model.get_word_row_models()[i], _view.get_word_row_views()[i], _input_gatherer)
		_word_row_controllers.append(controller)
		add_child(controller)
	
	
func _on_accepted(success: bool) -> void:
	if success:
		complete_status.emit(CompleteStatus.SUCCESS)
		return
	if _active_word_row >= _model.get_word_length():
		complete_status.emit(CompleteStatus.FAILURE)
		return
	_word_row_controllers[_active_word_row].accepted.disconnect(_on_accepted)
	_active_word_row += 1
	_word_row_controllers[_active_word_row].activate()
	_word_row_controllers[_active_word_row].accepted.connect(_on_accepted)

func _ready() -> void:
	#for i in _model.get_word_row_models().size():
		#var controller = TileRowController.init(_model.get_word_row_models()[i], _view.get_word_row_views()[i], _input_gatherer)
		#_word_row_controllers.append(controller)
		#add_child(controller)
	if _word_row_controllers.size() > 0:
		_word_row_controllers[_active_word_row].activate()
		_word_row_controllers[_active_word_row].accepted.connect(_on_accepted)
