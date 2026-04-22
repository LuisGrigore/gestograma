extends Panel
class_name Tile

const TILE_SCENE := preload("uid://hitecpmmu241")

@export var letter_label: Label = null

var locked_style = preload("uid://cjveun3i71m5k")
var selected_style = preload("uid://bsbpif4mjy8ok")
var active_style = preload("uid://5425pjaibxcf")
var letter_hit_style = preload("uid://bujekju5f8hoq")
var letter_conteined_style = preload("uid://dvbauv0vvs6ur")
@onready var active_tile:Panel = $Active
var timer:Timer = null
var _state := States.LOCKED

enum States {LOCKED, SELECTED, ACTIVE, LETTER_HIT, LETTER_CONTAINED}

func _ready() -> void:
	add_theme_stylebox_override("panel", locked_style)
	active_tile.hide()
	timer.timeout.connect(_on_timer_timeout)

static func init(timer:Timer) -> Tile:
	var tile:Tile = TILE_SCENE.instantiate()
	tile.timer = timer
	return tile
	
func _on_timer_timeout():
	active_tile.hide()
	add_theme_stylebox_override("panel", locked_style)

func _process(delta):
	if _state == States.ACTIVE:
		var progress = 1.0 - (timer.time_left / timer.wait_time)
		if active_tile.material is ShaderMaterial:
			var mat: ShaderMaterial = active_tile.material
			mat.set("shader_parameter/progress", progress)

func set_state(state: States) -> void:
	
	match state:
		States.LOCKED:
			add_theme_stylebox_override("panel", locked_style)
		States.SELECTED:
			add_theme_stylebox_override("panel", selected_style)
		States.ACTIVE:
			active_tile.show()
			#add_theme_stylebox_override("panel", active_style)
		States.LETTER_HIT:
			add_theme_stylebox_override("panel", letter_hit_style)
		States.LETTER_CONTAINED:
			add_theme_stylebox_override("panel", letter_conteined_style)
	_state = state

func set_letter(letter: String) -> void:
	if letter.length() > 1:
		push_error("Tiles can only contain 1 character.")
		return
	letter_label.text = letter

func get_letter() -> String:
	return letter_label.text

func clear_content() -> void:
	letter_label.text = ""
