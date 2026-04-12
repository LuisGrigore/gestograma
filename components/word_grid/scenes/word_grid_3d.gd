class_name WordGrid3D extends Node3D

@export var _view:WordGrid3DView = null
@export var _controller:WordGridController = null

func init_instance(model: WordGridModel, input_gatherer: TileRowInputGatherer) -> void:
	_view = WordGrid3DView.init(model)
	add_child(_view)
	_controller = WordGridController.init(model, _view._word_grid_ui_view, input_gatherer)
	add_child(_controller)
