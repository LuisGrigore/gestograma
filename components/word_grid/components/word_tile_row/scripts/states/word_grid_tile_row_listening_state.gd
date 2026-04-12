extends State
class_name TileRowListeningState

var _model: TileRowModel = null
var _view:TileRowView = null
var _current_index := 0

static func get_instance(model: TileRowModel, view:TileRowView) -> TileRowListeningState:
	var new_state = TileRowListeningState.new()
	new_state.name = "TileRowListeningState"
	new_state._model = model
	new_state._view = view
	return new_state

func on_enter(context := {}) -> void:
	_current_index = context["index"]
	_view.set_active(true)
	GameController.input_bus.letter.connect(_on_letter)

func on_exit() -> void:
	_view.set_active(false)
	GameController.input_bus.letter.disconnect(_on_letter)

func _on_letter(letter: String) -> void:
	_model.set_letter_at_index(letter, _current_index)
	_view.update_at_index(_current_index)
	change_state_request.emit("TileRowSelectingState", {"index": _current_index + 1})
