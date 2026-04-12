extends State
class_name TileRowIdleState

var _model:TileRowModel = null
var _view:TileRowView = null

static func get_instance(model:TileRowModel, view:TileRowView) -> TileRowIdleState:
	var new_state = TileRowIdleState.new()
	new_state.name = "TileRowIdleState"
	new_state._model = model
	new_state._view = view
	return new_state

func on_enter(context := {}) -> void:
	if _model.get_row_state() == TileRowModel.RowState.VALIDATED:
		change_state_request.emit("TileRowLockState")
	_model.clear()
	_view.update()
