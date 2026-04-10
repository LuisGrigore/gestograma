extends State
class_name TileRowSelectingState

var _tiles: Array[Tile] = []
var _current_index := 0

static func get_instance() -> TileRowSelectingState:
	var new_state = TileRowSelectingState.new()
	new_state.name = "TileRowSelectingState"
	return new_state

enum FocusMovement {FORWARD, BACKWARD}

func move_focus(direction: FocusMovement) -> void:
	var increment = 0
	if direction == FocusMovement.FORWARD:
		increment = 1
	elif direction == FocusMovement.BACKWARD:
		increment = -1
	_tiles[_current_index].set_state(Tile.States.LOCKED)
	_current_index = (_current_index + increment) % _tiles.size()
	_tiles[_current_index].set_state(Tile.States.SELECTED)

func on_enter(context := {}) -> void:
	_tiles = context["tiles"]
	_current_index = context["index"]
	_current_index = _current_index %  _tiles.size()
	_tiles[_current_index].set_state(Tile.States.SELECTED)
	GameController.input_bus.slide.connect(_on_slide)
	GameController.input_bus.select.connect(_on_select)
	GameController.input_bus.accept.connect(_on_accept)

func on_exit() -> void:
	GameController.input_bus.slide.disconnect(_on_slide)
	GameController.input_bus.select.disconnect(_on_select)
	GameController.input_bus.accept.disconnect(_on_accept)

func _on_slide(direction:InputBus.SlideDirection) -> void:
	if direction == InputBus.SlideDirection.LEFT:
		move_focus(FocusMovement.BACKWARD)
	if direction == InputBus.SlideDirection.RIGHT:
		move_focus(FocusMovement.FORWARD)
		
func _on_select() -> void:
	change_state_request.emit("TileRowListeningState", {"tiles":_tiles, "index":_current_index})
	
func _on_accept() -> void:
	for tile in _tiles:
		if tile.get_letter() == "":
			return
	change_state_request.emit("TileRowLockState", {"tiles":_tiles})
