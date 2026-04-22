extends State
class_name WordRowSelectingState

var _model: WordRowModel = null
var _view:WordRowView = null
var _input_gatherer = null
var _current_index := 0

static func get_instance(model: WordRowModel, view:WordRowView, input_gatherer:WordRowInputGatherer) -> WordRowSelectingState:
	var new_state = WordRowSelectingState.new()
	new_state.name = "WordRowSelectingState"
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
	_model.set_selected(_current_index)

func on_enter(context := {}) -> void:
	_current_index = context["index"]
	_current_index = _current_index % _model.get_word_length()
	_model.set_selected(_current_index)
	_input_gatherer.slide.connect(_on_slide)
	_input_gatherer.accept.connect(_on_accept)
	_input_gatherer.select.connect(_on_select)

func on_exit() -> void:
	_input_gatherer.slide.disconnect(_on_slide)
	_input_gatherer.select.disconnect(_on_select)
	_input_gatherer.accept.disconnect(_on_accept)

func _on_slide(direction: WordRowInputGatherer.SlideDirection) -> void:
	if direction == WordRowInputGatherer.SlideDirection.LEFT:
		move_focus(FocusMovement.BACKWARD)
	if direction == WordRowInputGatherer.SlideDirection.RIGHT:
		move_focus(FocusMovement.FORWARD)
		
func _on_select() -> void:
	change_state_request.emit("WordRowListeningState", {"index": _current_index})
	
func _on_accept() -> void:
	if !_model.is_complete():
			return
	change_state_request.emit("WordRowLockState")
