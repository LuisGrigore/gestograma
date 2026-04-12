extends Panel

@export var max_tries := 0
@export var target_word := ""

@onready var container := $CenterContainer/VBoxContainer

var tile_rows: Array[TileRowController] = []
var active_tile_row := 0

func _on_accepted(success: bool) -> void:
	if success:
		GameController._web_bus.send_event("Message", {"content": "Successs!!!!"})
		return
	tile_rows[active_tile_row].accepted.disconnect(_on_accepted)
	active_tile_row += 1
	tile_rows[active_tile_row].activate()
	tile_rows[active_tile_row].accepted.connect(_on_accepted)

func _ready() -> void:
	for i in range(max_tries):
		var tile_row_model = TileRowModel.init(target_word)
		var tile_row: TileRowController = TileRowController.init(tile_row_model)
		container.add_child(tile_row)
		tile_rows.append(tile_row)
	
	if tile_rows.size() > 0:
		tile_rows[active_tile_row].activate()
		tile_rows[active_tile_row].accepted.connect(_on_accepted)
