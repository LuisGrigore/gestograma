extends GridContainer
class_name TileRow

@export var target_word := ""

var TileScene := preload("res://word_grid/scenes/word_grid_tile.tscn")

var tiles:Array[Tile] = []
var active_tile := 0

var state_machine: StateMachine

signal accepted(success:bool)

#func delete_letter() -> void:
	#if tiles[active_tile].get_letter() == "":
		#if active_tile > 0:
			#move_focus(FocusMovement.BACKWARD)
	#
	#tiles[active_tile].clear_content()


	
func activate() -> void:
	state_machine.change_states("TileRowSelectingState", {"tiles": tiles, "index": 0})

func _on_validation(success:bool) -> void:
	accepted.emit(success)

func _ready() -> void:
	for i in range(target_word.length()):
		var tile = TileScene.instantiate()
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


	
