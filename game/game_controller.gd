extends Node

const DEBUG := false

@onready var input_bus = InputBus.new()
@onready var _web_bus: ExternalWebEventBus = null


@onready var _scene_manager := get_tree().current_scene as SceneManager

func _on_start_game():
	_scene_manager.clear_ui()
	_scene_manager.set_world_3d_node(AlphabetLevel.init(_web_bus))

func _on_scene_manager_ready() -> void:
	var menu: MainMenu = MainMenu.init()
	_scene_manager.set_ui_node(menu)
	menu.start_game.connect(_on_start_game)

func _on_hands(hands) -> void:
	print(hands)

func _ready() -> void:
	if !DEBUG:
		_web_bus = ExternalWebEventBus.new()
		_web_bus.on_event("hands", _on_hands)
		add_child(_web_bus)
	_scene_manager.ready.connect(_on_scene_manager_ready)

func _unhandled_input(event) -> void:
	# SLIDE LEFT
	if event.is_action_pressed("ui_left"):
		input_bus.slide.emit(InputBus.SlideDirection.LEFT)

	# SLIDE RIGHT
	elif event.is_action_pressed("ui_right"):
		input_bus.slide.emit(InputBus.SlideDirection.RIGHT)

	# SELECT
	elif event.is_action_pressed("ui_select"):
		input_bus.select.emit()

	# ACCEPT
	elif event.is_action_pressed("ui_accept"):
		input_bus.accept.emit()

	# LETRAS
	elif event is InputEventKey and event.pressed and not event.echo:
		if event.unicode > 0:
			var letter := String.chr(event.unicode)
			if letter.length() == 1 and (letter >= "a" and letter <= "z") or (letter >= "A" and letter <= "Z"):
				input_bus.letter.emit(letter.to_upper())
