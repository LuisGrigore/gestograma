extends Node3D
class_name AlphabetLevel

const ALPHABET_LEVEL_SCENE = preload("res://levels/alphabet_level/alphabet_level.tscn")

static func init() -> AlphabetLevel:
	var alphabet_level:AlphabetLevel = ALPHABET_LEVEL_SCENE.instantiate()
	return alphabet_level
