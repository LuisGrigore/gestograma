class_name WordRowController extends Node

@export var _view: WordRowView = null
@export var _model: WordRowModel = null
@export var _input_gatherer: WordRowInputGatherer = null

var state_machine: StateMachine
var _timer :Timer = null
signal word_submitted(success: bool)

func _ready() -> void:
	var lock_state = WordRowLockState.get_instance(_model,_view)
	lock_state.word_submitted.connect(_on_word_submitted)

	state_machine = StateMachine.get_instance([WordRowIdleState.get_instance(_model,_view),
	WordRowListeningState.get_instance(_model,_view,_input_gatherer,_timer),
	lock_state,
	WordRowSelectingState.get_instance(_model,_view,_input_gatherer)], "WordRowIdleState")
	add_child(state_machine)
	
static func init(model: WordRowModel, view: WordRowView, input_gatherer: WordRowInputGatherer, timer:Timer) -> WordRowController:
	var tile_row = WordRowController.new()
	tile_row._model = model
	tile_row._view = view
	tile_row._input_gatherer = input_gatherer
	tile_row._timer = timer
	return tile_row

func _on_word_submitted(success: bool) -> void:
	word_submitted.emit(success)

func activate() -> void:
	state_machine.change_states("WordRowSelectingState", {"index": 0})
