extends Node
class_name State

@onready var state_name = self.name
signal change_state_request(new_state:String, context:Dictionary)

func on_enter(context := {}) -> void:
	pass

func on_exit() -> void:
	pass

func on_update(delta:float , context := {}) -> void:
	pass
	
func on_event(event) -> void:
	pass
