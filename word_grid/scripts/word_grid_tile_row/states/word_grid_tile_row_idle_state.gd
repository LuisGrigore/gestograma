extends State
class_name TileRowIdleState

static func get_instance() -> TileRowIdleState:
	var new_state = TileRowIdleState.new()
	new_state.name = "TileRowIdleState"
	return new_state

func on_enter(context := {}) -> void:
	var tiles: Array[Tile] = context["tiles"]
	for tile in tiles:
		tile.clear_content()
		tile.set_state(Tile.States.LOCKED)
