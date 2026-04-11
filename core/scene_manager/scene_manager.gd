class_name SceneManager
extends Node

const SCENE_MANAGER_SCENE = preload("uid://dlucn6au46whd")

@onready var _ui: Control = $UI
@onready var _world_2d: Node2D = $World2D
@onready var _world_3d: Node3D = $World3D

#-----Private
func _clear_children(node: Node) -> void:
	for child in node.get_children():
		child.queue_free()

#-----Scene Constructor
static func init() -> SceneManager:
	var scene_manager = SCENE_MANAGER_SCENE.instantiate()
	return scene_manager

#-----Setters
func set_ui_packed(scene: PackedScene) -> Node:
	_clear_children(_ui)
	var instance = scene.instantiate()
	_ui.add_child(instance)
	return instance

func set_world_2d_packed(scene: PackedScene) -> Node2D:
	_clear_children(_world_2d)
	var instance = scene.instantiate()
	_world_2d.add_child(instance)
	return instance

func set_world_3d_packed(scene: PackedScene) -> Node3D:
	_clear_children(_world_3d)
	var instance = scene.instantiate()
	_world_3d.add_child(instance)
	return instance

func set_ui_node(node: Node) -> Node:
	_clear_children(_ui)
	_ui.add_child(node)
	return node

func set_world_2d_node(node: Node2D) -> Node2D:
	_clear_children(_world_2d)
	_world_2d.add_child(node)
	return node

func set_world_3d_node(node: Node3D) -> Node3D:
	_clear_children(_world_3d)
	_world_3d.add_child(node)
	return node

#-----Clears
func clear_ui() -> void:
	_clear_children(_ui)

func clear_world_2d() -> void:
	_clear_children(_world_2d)

func clear_world_3d() -> void:
	_clear_children(_world_3d)
