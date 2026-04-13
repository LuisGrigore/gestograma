class_name WordRowGestureInputGatherer extends WordRowInputGatherer

var _web_bus:ExternalWebEventBus = null

static func init(web_bus:ExternalWebEventBus) -> WordRowGestureInputGatherer:
	var input_gatherer := WordRowGestureInputGatherer.new()
	input_gatherer.init_instance(web_bus)
	return input_gatherer
	
func init_instance(web_bus:ExternalWebEventBus) -> void:
	_web_bus = web_bus
	_web_bus.on_event("input", _on_input)

func _on_input(input: String) -> void:
	# SLIDE LEFT
	if input == "ArrowLeft":
		slide.emit(InputBus.SlideDirection.LEFT)

	# SLIDE RIGHT
	elif input == "ArrowRight":
		slide.emit(InputBus.SlideDirection.RIGHT)

	# SELECT
	elif input == " ":
		select.emit()

	# ACCEPT
	elif input == "Enter":
		accept.emit()

	# LETRAS
	elif input.length() == 1:
		var _letter := input

		if (
			(_letter >= "a" and _letter <= "z") or
			(_letter >= "A" and _letter <= "Z")
		):
			letter.emit(_letter.to_upper())
