class_name TileRowView extends GridContainer

var _tiles:Array[Tile] = [] 
var _model:TileRowModel = null
var _current_focus := -1

static func init(model: TileRowModel) -> TileRowView:
	var tile_row_view := TileRowView.new()
	tile_row_view._model = model
	return tile_row_view
	
func _ready() -> void:
	for i in _model.get_word_length():
		var tile = Tile.init()
		add_child(tile)
		_tiles.append(tile)
		tile.set_letter(_model.get_letter_at_index(i))
	columns = _model.get_word_length()

func update_at_index(index:int) -> void:
	if index > _tiles.size() - 1:
		push_error("Index out of bounds for tiles array.")
		return
	_tiles[index].set_letter(_model.get_letter_at_index(index))
	var state := _model.get_letter_state_at_index(index)
	match state:
		TileRowModel.LetterState.BLANK:
			_tiles[index].set_state(Tile.States.LOCKED)
		TileRowModel.LetterState.CONTAINED:
			_tiles[index].set_state(Tile.States.LETTER_CONTAINED)
		TileRowModel.LetterState.HIT:
			_tiles[index].set_state(Tile.States.LETTER_HIT)
	_tiles[index].set_letter(_model.get_letter_at_index(index))
	
func update() -> void:
	for i in _model.get_word_length():
		update_at_index(i)

func clear_focus() -> void:
	if _current_focus == -1:
		return
	_tiles[_current_focus].set_state(Tile.States.LOCKED)
	_current_focus = -1

func set_focus_at_index(index: int) -> void:
	if index >= _tiles.size() or index < 0:
		push_error("Index out of bounds for tiles array.")
		return
	if _model.get_letter_state_at_index(index) != TileRowModel.LetterState.BLANK:
		return
	clear_focus()
	_tiles[index].set_state(Tile.States.SELECTED)
	_current_focus = index
	
func set_active(active:bool) -> void:
	if _current_focus == -1:
		return
	if active:
		_tiles[_current_focus].set_state(Tile.States.ACTIVE)
	else:
		_tiles[_current_focus].set_state(Tile.States.SELECTED)
