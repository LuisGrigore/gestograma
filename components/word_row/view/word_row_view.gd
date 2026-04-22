class_name WordRowView extends GridContainer

@export var _model:WordRowModel = null

var _tiles:Array[Tile] = [] 
var _current_focus := -1
var _timer :Timer = null

static func init(model: WordRowModel, timer:Timer) -> WordRowView:
	var tile_row_view := WordRowView.new()
	tile_row_view.init_instance(model, timer)
	return tile_row_view
	
func init_instance(model: WordRowModel, timer:Timer) -> void:
	_model = model
	_timer = timer
	for i in _model.get_word_length():
		var tile = Tile.init(timer)
		add_child(tile)
		_tiles.append(tile)
		tile.set_letter(_model.get_letter_at_index(i))
	columns = _model.get_word_length()
	_model.letter_changed.connect(update_at_index)
	_model.state_changed.connect(update_state_at_index)
	_model.cleared.connect(update)

func update_at_index(index:int) -> void:
	#if index > _tiles.size() - 1:
		#push_error("Index out of bounds for tiles array.")
		#return
	_tiles[index].set_letter(_model.get_letter_at_index(index))

func update_state_at_index(index:int) ->void:
	var state := _model.get_letter_state_at_index(index)
	match state:
		WordRowModel.LetterState.BLANK:
			_tiles[index].set_state(Tile.States.LOCKED)
		WordRowModel.LetterState.CONTAINED:
			_tiles[index].set_state(Tile.States.LETTER_CONTAINED)
		WordRowModel.LetterState.HIT:
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
		push_error("Index out of bounds for tiles array.  ", index)
		return
	if _model.get_letter_state_at_index(index) != WordRowModel.LetterState.BLANK:
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
