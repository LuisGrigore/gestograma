class_name WordRowKeyInputGatherer extends WordRowInputGatherer


func _input(event) -> void:
	# SLIDE LEFT
	if event.is_action_pressed("ui_left"):
		slide.emit(InputBus.SlideDirection.LEFT)

	# SLIDE RIGHT
	elif event.is_action_pressed("ui_right"):
		slide.emit(InputBus.SlideDirection.RIGHT)

	# SELECT
	elif event.is_action_pressed("ui_select"):
		select.emit()

	# ACCEPT
	elif event.is_action_pressed("ui_accept"):
		accept.emit()

	# LETRAS
	elif event is InputEventKey and event.pressed and not event.echo:
		if event.unicode > 0:
			var _letter := String.chr(event.unicode)
			if _letter.length() == 1 and (
				(_letter >= "a" and _letter <= "z") or
				(_letter >= "A" and _letter <= "Z")
			):
				letter.emit(_letter.to_upper())
