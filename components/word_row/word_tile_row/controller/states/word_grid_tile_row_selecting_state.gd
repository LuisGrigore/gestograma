extends State
class_name TileRowSelectingState

var _model: TileRowModel = null
var _view:TileRowView = null
var _input_gatherer = null
var _current_index := 0

static func get_instance(model: TileRowModel, view:TileRowView, input_gatherer:TileRowInputGatherer) -> TileRowSelectingState:
	var new_state = TileRowSelectingState.new()
	new_state.name = "TileRowSelectingState"
	new_state._model = model
	new_state._view = view
	new_state._input_gatherer = input_gatherer
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
	_input_gatherer.slide.connect(_on_slide)
	_input_gatherer.accept.connect(_on_accept)
	_input_gatherer.select.connect(_on_select)

func on_exit() -> void:
	_input_gatherer.slide.disconnect(_on_slide)
	_input_gatherer.select.disconnect(_on_select)
	_input_gatherer.accept.disconnect(_on_accept)

func _on_slide(direction: TileRowInputGatherer.SlideDirection) -> void:
	if direction == TileRowInputGatherer.SlideDirection.LEFT:
		move_focus(FocusMovement.BACKWARD)
	if direction == TileRowInputGatherer.SlideDirection.RIGHT:
		move_focus(FocusMovement.FORWARD)
		
func _on_select() -> void:
	change_state_request.emit("TileRowListeningState", {"index": _current_index})
	
func _on_accept() -> void:
	if !_model.is_complete():
			return
	change_state_request.emit("TileRowLockState")
