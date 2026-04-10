extends Panel
class_name Tile

@onready var letter_label: Label = $Letter

var locked_style = preload("res://resources/styles/word_grid/word_grid_tile_locked_style.tres")
var selected_style = preload("res://resources/styles/word_grid/word_grid_tile_selected_style.tres")
var active_style = preload("res://resources/styles/word_grid/word_grid_tile_active_style.tres")
var letter_hit_style = preload("res://resources/styles/word_grid/word_grid_tile_letter_hit_style.tres")
var letter_conteined_style = preload("res://resources/styles/word_grid/word_grid_tile_letter_contained_style.tres")

enum States {LOCKED, SELECTED, ACTIVE, LETTER_HIT, LETTER_CONTAINED}

func _ready() -> void:
	add_theme_stylebox_override("panel", locked_style)
	
func set_state(state: States) -> void:
	match state:
		States.LOCKED:
			add_theme_stylebox_override("panel", locked_style)
		States.SELECTED:
			add_theme_stylebox_override("panel", selected_style)
		States.ACTIVE:
			add_theme_stylebox_override("panel", active_style)
		States.LETTER_HIT:
			add_theme_stylebox_override("panel", letter_hit_style)
		States.LETTER_CONTAINED:
			add_theme_stylebox_override("panel", letter_conteined_style)

func set_letter(letter: String) -> void:
	if letter.length() != 1:
		push_error("Tiles can only contain 1 character.")
	letter_label.text = letter

func get_letter() -> String:
	return letter_label.text

func clear_content() -> void:
	letter_label.text = ""
	
