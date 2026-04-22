extends State
class_name WordRowIdleState

var _model:WordRowModel = null
var _view:WordRowView = null

static func get_instance(model:WordRowModel, view:WordRowView) -> WordRowIdleState:
	var new_state = WordRowIdleState.new()
	new_state.name = "WordRowIdleState"
	new_state._model = model
	new_state._view = view
	return new_state

func on_enter(context := {}) -> void:
	if _model.get_row_state() == WordRowModel.RowState.VALIDATED:
		change_state_request.emit("WordRowLockState")
	_model.clear()
