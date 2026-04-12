class_name TileRowController extends Control

const TILE_ROW_SCENE := preload("uid://brt4wkfjp534f")

var _view: TileRowView = null
var _model: TileRowModel = null
var _input_gatherer: TileRowInputGatherer = null

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

#static func init(model:TileRowModel = null, view:TileRowView = null, input_gatherer:TileRowInputGatherer = null) -> TileRowController:
	#var tile_row = TILE_ROW_SCENE.instantiate()
	#var new_view = TileRowView.init(model)
	#tile_row._model = model
	#tile_row._view = new_view
	#tile_row.add_child(new_view)
	#return tile_row

static func init(model: TileRowModel = null, view: TileRowView = null, input_gatherer: TileRowInputGatherer = null) -> TileRowController:
	var tile_row = TILE_ROW_SCENE.instantiate()
	
	# Model
	if model == null:
		model = TileRowModel.new()
	tile_row._model = model
	
	# View
	var new_view: TileRowView
	if view == null:
		new_view = TileRowView.init(model)
	else:
		new_view = view
	tile_row._view = new_view
	tile_row.add_child(new_view)
	
	# Input Gatherer (si lo necesitas en el futuro)
	var new_input_gatherer:TileRowInputGatherer
	if input_gatherer != null:
		new_input_gatherer = input_gatherer
	else:
		new_input_gatherer = TileRowKeyInputGatherer.new()
	tile_row._input_gatherer = new_input_gatherer
	if !new_input_gatherer.is_inside_tree():
		tile_row.add_child(new_input_gatherer)
	
	return tile_row

func _on_validation(success: bool) -> void:
	accepted.emit(success)

func activate() -> void:
	state_machine.change_states("TileRowSelectingState", {"index": 0})
