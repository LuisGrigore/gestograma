extends State
class_name TileRowSelectingState

var _model: TileRowModel = null
var _view:TileRowView = null
var _current_index := 0

static func get_instance(model: TileRowModel, view:TileRowView) -> TileRowSelectingState:
	var new_state = TileRowSelectingState.new()
	new_state.name = "TileRowSelectingState"
	new_state._model = model
	new_state._view = view
	return new_state

enum FocusMovement {FORWARD, BACKWARD}

func move_focus(direction: FocusMovement) -> void:
	var increment = 0
	
	if direction == FocusMovement.FORWARD:
		increment = 1
	elif direction == FocusMovement.BACKWARD:
		increment = -1
	
	var size = _model.get_word_length()
	_current_index = (_current_index + increment + size) % size
	
	_view.set_focus_at_index(_current_index)

func on_enter(context := {}) -> void:
	_current_index = context["index"]
	_current_index = _current_index % _model.get_word_length()
	
	_view.set_focus_at_index(_current_index)
	GameController.input_bus.slide.connect(_on_slide)
	GameController.input_bus.select.connect(_on_select)
	GameController.input_bus.accept.connect(_on_accept)

func on_exit() -> void:
	GameController.input_bus.slide.disconnect(_on_slide)
	GameController.input_bus.select.disconnect(_on_select)
	GameController.input_bus.accept.disconnect(_on_accept)

func _on_slide(direction: InputBus.SlideDirection) -> void:
	if direction == InputBus.SlideDirection.LEFT:
		move_focus(FocusMovement.BACKWARD)
	if direction == InputBus.SlideDirection.RIGHT:
		move_focus(FocusMovement.FORWARD)
		
func _on_select() -> void:
	change_state_request.emit("TileRowListeningState", {"index": _current_index})
	
func _on_accept() -> void:
	if !_model.is_complete():
			return
	change_state_request.emit("TileRowLockState")
