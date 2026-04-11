extends Node3D
class_name AlphabetLevel

const ALPHABET_LEVEL_SCENE = preload("uid://bvy4se42ejj8e")

static func init() -> AlphabetLevel:
	var alphabet_level: AlphabetLevel = ALPHABET_LEVEL_SCENE.instantiate()
	return alphabet_level
