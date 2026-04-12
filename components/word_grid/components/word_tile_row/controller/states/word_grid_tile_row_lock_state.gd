extends State
class_name TileRowLockState

var _model:TileRowModel = null
var _view:TileRowView = null
signal validation(success: bool)

static func get_instance(model: TileRowModel, view: TileRowView) -> TileRowLockState:
	var new_state = TileRowLockState.new()
	new_state.name = "TileRowLockState"
	new_state._model = model
	new_state._view = view
	return new_state

func on_enter(context := {}) -> void:
	var is_valid = true
	var target_word = _model.get_target_word()
	
	var remaining_letters: Array = target_word.split("")
	
	for i in _model.get_word_length():
		if target_word[i] == _model.get_letter_at_index(i):
			_model.set_letter_state_at_index(TileRowModel.LetterState.HIT, i)
			remaining_letters[i] = null
		else:
			is_valid = false
	
	for i in _model.get_word_length():
		var letter = _model.get_letter_at_index(i)
		
		if target_word[i] == letter:
			continue
		if remaining_letters.has(letter):
			_model.set_letter_state_at_index(TileRowModel.LetterState.CONTAINED, i)
			remaining_letters[remaining_letters.find(letter)] = null
		else:
			_model.set_letter_state_at_index(TileRowModel.LetterState.BLANK, i)
	_view.update()
	validation.emit(is_valid)
