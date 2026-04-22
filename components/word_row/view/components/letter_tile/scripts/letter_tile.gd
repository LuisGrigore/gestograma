extends Panel
class_name Tile

const TILE_SCENE := preload("uid://hitecpmmu241")

@export var letter_label: Label = null

var locked_style = preload("uid://cjveun3i71m5k")
var letter_hit_style = preload("uid://bujekju5f8hoq")
var letter_conteined_style = preload("uid://dvbauv0vvs6ur")
@onready var loading:Panel = $Loading
@onready var hightlight:Panel = $Highlight


enum Bg {GREY, GREEN, YELLOW}

static func init() -> Tile:
	var tile:Tile = TILE_SCENE.instantiate()
	return tile

func _ready() -> void:
	set_background(Bg.GREY)
	set_highlight(false)
	set_loading(1)

func set_highlight(on:bool) -> void:
	if on:
		hightlight.show()
	else:
		hightlight.hide()

func set_loading(progress:float) -> void:
	if loading.material is ShaderMaterial:
			var mat: ShaderMaterial = loading.material
			mat.set("shader_parameter/progress", progress)

func set_background(bg:Bg) -> void:
	match bg:
		Bg.GREY:
			add_theme_stylebox_override("panel", locked_style)
		Bg.GREEN:
			add_theme_stylebox_override("panel", letter_hit_style)
		Bg.YELLOW:
			add_theme_stylebox_override("panel", letter_conteined_style)

func set_letter(letter: String) -> void:
	if letter.length() > 1:
		push_error("Tiles can only contain 1 character.")
		return
	letter_label.text = letter

func get_letter() -> String:
	return letter_label.text

func clear_content() -> void:
	letter_label.text = ""
