class_name WordRowView extends GridContainer

@export var _model:WordRowModel = null

var _tiles:Array[Tile] = [] 
	
static func init(model: WordRowModel) -> WordRowView:
	var tile_row_view := WordRowView.new()
	tile_row_view.init_instance(model)
	return tile_row_view
	
func init_instance(model: WordRowModel) -> void:
	_model = model
	for i in _model.get_word_length():
		var tile = Tile.init()
		add_child(tile)
		_tiles.append(tile)
		tile.set_letter(_model.get_letter_at_index(i))
	columns = _model.get_word_length()
	_model.state_changed.connect(update)

	
func update() -> void:
	for i in _model.get_word_length():
		_tiles[i].set_letter(_model.get_letter_at_index(i))
		_tiles[i].set_highlight(false)
		match _model.get_letter_state_at_index(i):
			WordRowModel.LetterState.HIT:
				_tiles[i].set_background(Tile.Bg.GREEN)
			WordRowModel.LetterState.CONTAINED:
				_tiles[i].set_background(Tile.Bg.YELLOW)
			WordRowModel.LetterState.BLANK:
				_tiles[i].set_background(Tile.Bg.GREY)
	if _model.get_selected() >= 0:
		_tiles[_model.get_selected()].set_highlight(true)
	
func set_loading(progress:float) -> void:
	if (_model.get_selected() >= 0):
		_tiles[_model.get_selected()].set_loading(progress)
