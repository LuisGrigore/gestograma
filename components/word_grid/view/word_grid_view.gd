class_name WordGridView extends Panel

const _WORD_GRID_VIEW_SCENE := preload("uid://bjvqkblg7vtxo")

@export var _container :VBoxContainer = null

var _word_row_views:Array[TileRowView] = []
var _model

static func init(model:WordGridModel) -> WordGridView:
	var word_grid_view = _WORD_GRID_VIEW_SCENE.instantiate()
	word_grid_view.init_instance(model)
	return word_grid_view

func init_instance(model:WordGridModel) -> void:
	_model = model


func _ready() -> void:
	for word_row_model in _model.get_word_row_models():
		var word_row_view = TileRowView.init(word_row_model)
		_word_row_views.append(word_row_view)
		_container.add_child(word_row_view)

func get_word_row_views() -> Array[TileRowView]:
	return _word_row_views
