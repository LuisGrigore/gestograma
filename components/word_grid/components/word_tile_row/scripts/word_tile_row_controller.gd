class_name TileRowController extends Control

const TILE_ROW_SCENE := preload("uid://brt4wkfjp534f")

@export var _view: TileRowView = null
var _model: TileRowModel = null

var state_machine: StateMachine

signal accepted(success: bool)

func _ready() -> void:

	var lock_state = TileRowLockState.get_instance(_model,_view)
	lock_state.validation.connect(_on_validation)

	state_machine = StateMachine.get_instance([TileRowIdleState.get_instance(_model,_view),
	TileRowListeningState.get_instance(_model,_view),
	lock_state,
	TileRowSelectingState.get_instance(_model,_view)], "TileRowIdleState")
	add_child(state_machine)

static func init(model:TileRowModel) -> TileRowController:
	var tile_row = TILE_ROW_SCENE.instantiate()
	var view = TileRowView.init(model)
	tile_row._model = model
	#tile_row._view._model = model
	tile_row._view = view
	tile_row.add_child(view)
	return tile_row

func _on_validation(success: bool) -> void:
	accepted.emit(success)

func activate() -> void:
	state_machine.change_states("TileRowSelectingState", {"index": 0})
