class_name MainMenu extends Control

const MAIN_MENU_SCENE = preload("res://components/main_menu/main_menu.tscn")

signal start_game

static func init() -> MainMenu:
	var main_menu = MAIN_MENU_SCENE.instantiate()
	return main_menu

func _ready() -> void:
	var button: Button = $Panel/VBoxContainer/Button
	button.pressed.connect(_on_start_game_button_pressed)
	
func _on_start_game_button_pressed():
	start_game.emit()
