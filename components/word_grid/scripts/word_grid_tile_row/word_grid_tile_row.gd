extends GridContainer
class_name TileRow

const TILE_ROW_SCENE := preload("res://components/word_grid/scenes/word_grid_tile_row.tscn")

@export var target_word := ""

var tiles: Array[Tile] = []
var active_tile := 0

var state_machine: StateMachine

signal accepted(success: bool)

func _ready() -> void:
	for i in range(target_word.length()):
		var tile = Tile.init()
		add_child(tile)
		tiles.append(tile)
		
	target_word = target_word.to_upper()
	
	var lock_state = TileRowLockState.get_instance(target_word)
	lock_state.validation.connect(_on_validation)

	state_machine = StateMachine.get_instance([TileRowIdleState.get_instance(),
	TileRowListeningState.get_instance(),
	lock_state,
	TileRowSelectingState.get_instance()], "TileRowIdleState", {"tiles": tiles})
	
	add_child(state_machine)

static func init() -> TileRow:
	var tile_row = TILE_ROW_SCENE.instantiate()
	return tile_row

func _on_validation(success: bool) -> void:
	accepted.emit(success)

func activate() -> void:
	state_machine.change_states("TileRowSelectingState", {"tiles": tiles, "index": 0})