extends State
class_name TileRowListeningState

var _tiles: Array[Tile] = []
var _current_index := 0

static func get_instance() -> TileRowListeningState:
	var new_state = TileRowListeningState.new()
	new_state.name = "TileRowListeningState"
	return new_state

func on_enter(context := {}) -> void:
	_tiles = context["tiles"]
	_current_index = context["index"]
	_tiles[_current_index].set_state(Tile.States.ACTIVE)
	GameController.input_bus.letter.connect(_on_letter)

func on_exit() -> void:
	_tiles[_current_index].set_state(Tile.States.LOCKED)
	GameController.input_bus.letter.disconnect(_on_letter)

func _on_letter(letter: String) -> void:
	_tiles[_current_index].set_letter(letter)
	change_state_request.emit("TileRowSelectingState", {"tiles": _tiles, "index": _current_index + 1})
