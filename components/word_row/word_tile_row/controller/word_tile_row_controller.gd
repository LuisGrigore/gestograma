class_name TileRowController extends Node

@export var _view: TileRowView = null
@export var _model: TileRowModel = null
@export var _input_gatherer: TileRowInputGatherer = null

var state_machine: StateMachine

signal accepted(success: bool)

func _ready() -> void:
	var lock_state = TileRowLockState.get_instance(_model,_view)
	lock_state.validation.connect(_on_validation)

	state_machine = StateMachine.get_instance([TileRowIdleState.get_instance(_model,_view),
	TileRowListeningState.get_instance(_model,_view,_input_gatherer),
	lock_state,
	TileRowSelectingState.get_instance(_model,_view,_input_gatherer)], "TileRowIdleState")
	add_child(state_machine)
	
static func init(model: TileRowModel, view: TileRowView, input_gatherer: TileRowInputGatherer) -> TileRowController:
	var tile_row = TileRowController.new()
	tile_row._model = model
	tile_row._view = view
	tile_row._input_gatherer = input_gatherer
	return tile_row

func _on_validation(success: bool) -> void:
	accepted.emit(success)

func activate() -> void:
	state_machine.change_states("TileRowSelectingState", {"index": 0})
