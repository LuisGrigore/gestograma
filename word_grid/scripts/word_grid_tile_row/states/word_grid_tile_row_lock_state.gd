extends State
class_name TileRowLockState

@export var target_word := ""
signal validation(success: bool)

static func get_instance(target_word: String) -> TileRowLockState:
	var new_state = TileRowLockState.new()
	new_state.name = "TileRowLockState"
	new_state.target_word = target_word
	return new_state

func _validate(tiles: Array[Tile]) -> bool:
	var is_valid = true
	var remaining_letters: Array = target_word.split("")
	
	for i in range(tiles.size()):
		var letter = tiles[i].get_letter()
		if target_word[i] == letter:
			tiles[i].set_state(Tile.States.LETTER_HIT)
			remaining_letters[i] = null
		else:
			is_valid = false
	
	for i in range(tiles.size()):
		var letter = tiles[i].get_letter()
		
		if target_word[i] == letter:
			continue
		
		if remaining_letters.has(letter):
			tiles[i].set_state(Tile.States.LETTER_CONTAINED)
			remaining_letters[remaining_letters.find(letter)] = null
		else:
			tiles[i].set_state(Tile.States.LOCKED)
	
	return is_valid

func on_enter(context := {}) -> void:
	var tiles: Array[Tile] = context["tiles"]
	validation.emit(_validate(tiles))
