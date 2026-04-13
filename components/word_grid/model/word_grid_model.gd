class_name WordGridModel extends Resource

@export var _max_tries :int= 0
var _word_row_models:Array[WordRowModel] = []

static func init(target_word:String, max_tries:int) -> WordGridModel:
	var word_grid_model = WordGridModel.new()
	word_grid_model._max_tries = max_tries
	for i in max_tries:
		word_grid_model._word_row_models.append(WordRowModel.init(target_word))
	return word_grid_model

func get_word_row_models() -> Array[WordRowModel]:
	return _word_row_models

func get_word_length() -> int:
	return _word_row_models[1].get_word_length()
	
