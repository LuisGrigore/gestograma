extends State
class_name WordRowListeningState

var _model: WordRowModel = null
var _view:WordRowView = null
var _input_gatherer:WordRowInputGatherer = null
var _current_index := 0
var _timer :Timer = null


static func get_instance(model: WordRowModel, view:WordRowView, input_gatherer: WordRowInputGatherer) -> WordRowListeningState:
	var new_state = WordRowListeningState.new()
	new_state.name = "WordRowListeningState"
	new_state._model = model
	new_state._view = view
	new_state._input_gatherer = input_gatherer
	new_state._timer = Timer.new()
	new_state.add_child(new_state._timer)
	new_state._timer.wait_time = 3
	new_state._timer.one_shot = true
	return new_state


func on_update(delta: float, context := {}) -> void:
	var progress = 1.0 - (_timer.time_left / _timer.wait_time)
	_view.set_loading(progress)


func on_enter(context := {}) -> void:
	_current_index = context["index"]
	_input_gatherer.letter.connect(_on_letter)
	_timer.start()
	_timer.timeout.connect(_on_timer_timeout)

func _on_timer_timeout():
	change_state_request.emit("WordRowSelectingState", {"index": _current_index + 1})

func on_exit() -> void:
	_view.set_loading(1)
	_input_gatherer.letter.disconnect(_on_letter)
	_timer.timeout.disconnect(_on_timer_timeout)

func _on_letter(letter: String) -> void:
	_model.set_letter_at_index(letter, _current_index)
