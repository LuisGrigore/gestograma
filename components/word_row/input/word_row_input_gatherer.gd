class_name WordRowInputGatherer extends Node

enum SlideDirection {LEFT, RIGHT}

signal slide(direction: SlideDirection)
signal select()
signal accept()
signal letter(letter: String)
