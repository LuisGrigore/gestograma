extends Node3D
class_name AlphabetLevel

const ALPHABET_LEVEL_SCENE = preload("uid://bvy4se42ejj8e")

@export var word_grid_3d :WordGrid3D = null

static func init() -> AlphabetLevel:
	var alphabet_level: AlphabetLevel = ALPHABET_LEVEL_SCENE.instantiate()
	var input := TileRowKeyInputGatherer.new()
	alphabet_level.word_grid_3d.init_instance(WordGridModel.init("HOLA", 5), input)
	alphabet_level.add_child(input)
	return alphabet_level

#func _ready() -> void:
	#var input := TileRowKeyInputGatherer.new()
	#word_grid_3d.init_instance(WordGridModel.init("HOLA", 5), input)
	#add_child(input)
