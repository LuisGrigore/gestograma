class_name WordRowModel extends Resource

enum RowState {INNACTIVE, ACTIVE, VALIDATED}
enum LetterState {BLANK, HIT, CONTAINED}

var _target_word := ""
var _letters:Array[String] = []
var _letter_states:Array[LetterState] = []
var _row_state := RowState.INNACTIVE

signal letter_changed(index: int)
signal state_changed(index: int)
signal cleared()

static func init(target_word:String) -> WordRowModel:
	var tile_row_model = WordRowModel.new()
	target_word = target_word.to_upper()
	tile_row_model._target_word = target_word
	tile_row_model._row_state = RowState.INNACTIVE
	for i in target_word.length():
		tile_row_model._letters.append("")
		tile_row_model._letter_states.append(LetterState.BLANK)
	return tile_row_model
	
func set_letter_at_index(letter: String, index:int) -> void:
	if letter.length() > 1:
		push_error("letter should be one character.")
		return
	if index > _letters.size() - 1:
		push_error("Index out of bounds for letter array.")
		return
	_letters[index] = letter
	letter_changed.emit(index)

func get_letter_at_index(index:int) -> String:
	if index > _letters.size() - 1:
		push_error("Index out of bounds for letter array.")
		return ""
	return _letters[index]

func set_letter_state_at_index(letter_state: LetterState, index:int) -> void:
	if index > _letter_states.size() - 1:
		push_error("Index out of bounds for letter array.")
		return
	_letter_states[index] = letter_state
	state_changed.emit(index)

func get_letter_state_at_index(index:int) -> LetterState:
	if index > _letter_states.size() - 1:
		push_error("Index out of bounds for letter array.")
		return LetterState.BLANK
	return _letter_states[index]

func get_word_length() -> int:
	return _letters.size()
	
func get_target_word() -> String:
	return _target_word
	
func get_row_state() -> RowState:
	return _row_state

func set_row_state(state: RowState) -> void:
	_row_state = state

func clear () -> void:
	for i in get_word_length():
		_letters[i] = ""
		_letter_states[i] = LetterState.BLANK
	cleared.emit()


func is_complete() -> bool:
	for letter in _letters:
		if letter == "":
			return false
	return true
