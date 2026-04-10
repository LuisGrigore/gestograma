extends Panel


@export var max_tries := 0
@export var target_word := ""

@onready var container := $CenterContainer/VBoxContainer

var TileRowScene := preload("res://word_grid/scenes/word_grid_tile_row.tscn")
var tile_rows: Array[TileRow] = []
var active_tile_row := 0

func _on_accepted(success:bool) -> void:
	if success:
		GameController._web_bus.send_event("Message", {"content": "Successs!!!!"})
		return
	active_tile_row
	tile_rows[active_tile_row].accepted.disconnect(_on_accepted)
	active_tile_row += 1
	tile_rows[active_tile_row].activate()
	tile_rows[active_tile_row].accepted.connect(_on_accepted)

func _ready() -> void:
	for i in range(max_tries):
		var tile_row: TileRow = TileRowScene.instantiate()
		tile_row.target_word = target_word
		container.add_child(tile_row)
		tile_rows.append(tile_row)
	
	if tile_rows.size() > 0:
		tile_rows[active_tile_row].activate()
		tile_rows[active_tile_row].accepted.connect(_on_accepted)
