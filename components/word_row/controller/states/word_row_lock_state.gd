extends State
class_name WordRowLockState

var _model:WordRowModel = null
var _view:WordRowView = null
signal word_submitted(success: bool)

static func get_instance(model: WordRowModel, view: WordRowView) -> WordRowLockState:
	var new_state = WordRowLockState.new()
	new_state.name = "WordRowLockState"
	new_state._model = model
	new_state._view = view
	return new_state

func on_enter(context := {}) -> void:
	var is_valid = true
	var target_word = _model.get_target_word()
	
	var remaining_letters: Array = target_word.split("")
	
	for i in _model.get_word_length():
		if target_word[i] == _model.get_letter_at_index(i):
			_model.set_letter_state_at_index(WordRowModel.LetterState.HIT, i)
			remaining_letters[i] = null
		else:
			is_valid = false
	
	for i in _model.get_word_length():
		var letter = _model.get_letter_at_index(i)
		
		if target_word[i] == letter:
			continue
		if remaining_letters.has(letter):
			_model.set_letter_state_at_index(WordRowModel.LetterState.CONTAINED, i)
			remaining_letters[remaining_letters.find(letter)] = null
		else:
			_model.set_letter_state_at_index(WordRowModel.LetterState.BLANK, i)
	#_view.update()
	word_submitted.emit(is_valid)
