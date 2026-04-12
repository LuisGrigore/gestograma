class_name WordGrid3DView extends MeshInstance3D

const _WORD_GRID_3D_SCENE := preload("uid://h0qu7sbe8n4l")

@export var _subviewport :SubViewport = null
@export var _word_grid_ui_view:WordGridView = null

static func init(model: WordGridModel) -> WordGrid3DView:
	var word_grid_3d = _WORD_GRID_3D_SCENE.instantiate()
	word_grid_3d.init_instance(model)
	return word_grid_3d
	
func init_instance(model: WordGridModel) -> void:
	if _word_grid_ui_view == null:
		_word_grid_ui_view = WordGridView.init(model)
		_subviewport.add_child(_word_grid_ui_view)
		return
	_word_grid_ui_view.init_instance(model)
	
	
	
