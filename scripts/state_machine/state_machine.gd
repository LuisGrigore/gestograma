extends Node
class_name StateMachine

@export var initial_state := ""
@export var initial_context := {}

var states: Array[State] = []
var current_state: State = null

signal state_change(old_state:String, new_state:String)

func _find_state(new_state: String) -> State:
	for state in states:
		if state.state_name == new_state:
			return state
	push_warning("State %s not found" % new_state)
	return null

func _on_change_state_request(new_state: String, context:= {}) -> void:
	change_states(new_state, context)

func _populate_states() -> void:
	states.clear()
	for child in get_children():
		if child is State:
			states.append(child)
			child.change_state_request.connect(_on_change_state_request)
		else:
			push_warning("Child %s is not a State" % child.name)

func change_states(new_state: String, context := {}) -> void:
	var found_state: State = _find_state(new_state)
	var old_state_name := ""
	var new_state_name := ""
	if not found_state:
		return
	new_state_name = found_state.state_name
	if current_state:
		current_state.on_exit()
		old_state_name = current_state.state_name
	current_state = found_state
	current_state.on_enter(context)
	state_change.emit(old_state_name, new_state_name)

func on_update(delta: float, context := {}) -> void:
	if current_state:
		current_state.on_update(delta, context)
	else:
		push_warning("No current state set")
		
func on_event(event) -> void:
	if current_state:
		current_state.on_event(event)
	else:
		push_warning("No current state set")

static func get_instance(states:Array[State], initial_state: String, initial_context:={}) -> StateMachine:
	var new_state_machine := StateMachine.new()
	for state in states:
		new_state_machine.add_child(state)
	new_state_machine.initial_state = initial_state
	new_state_machine.initial_context = initial_context
	return new_state_machine

func _ready() -> void:
	_populate_states()
	change_states(initial_state, initial_context)
