extends Panel
class_name Tile

const TILE_SCENE := preload("uid://hitecpmmu241")

@onready var letter_label: Label = $Letter

var locked_style = preload("uid://cjveun3i71m5k")
var selected_style = preload("uid://bsbpif4mjy8ok")
var active_style = preload("uid://5425pjaibxcf")
var letter_hit_style = preload("uid://bujekju5f8hoq")
var letter_conteined_style = preload("uid://dvbauv0vvs6ur")


enum States {LOCKED, SELECTED, ACTIVE, LETTER_HIT, LETTER_CONTAINED}

func _ready() -> void:
	add_theme_stylebox_override("panel", locked_style)

static func init() -> Tile:
	var tile = TILE_SCENE.instantiate()
	return tile
	
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
