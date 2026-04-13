extends Node3D
class_name AlphabetLevel

const ALPHABET_LEVEL_SCENE = preload("uid://bvy4se42ejj8e")

@export var word_grid_3d :WordGrid3D = null

static func init(web_bus:ExternalWebEventBus) -> AlphabetLevel:
	var alphabet_level: AlphabetLevel = ALPHABET_LEVEL_SCENE.instantiate()
	var input : WordRowInputGatherer
	if web_bus == null:
		input = WordRowKeyInputGatherer.new()
	else :
		input = WordRowGestureInputGatherer.init(web_bus)
	alphabet_level.word_grid_3d.init_instance(WordGridModel.init("HOLA", 5), input)
	alphabet_level.add_child(input)
	return alphabet_level

func _ready() -> void:
	word_grid_3d.completed.connect(_on_completed)

func _on_completed(success:bool):
	if success:
		print("SUCCESSSS!!!")
	else:
		print("WOMPWOMP")
