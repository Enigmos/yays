# -*- coding: utf-8 -*-

import sys
import os
import re
import csv
import itertools
import json
import urllib

SPREADSHEET_URL = 'https://docs.google.com/spreadsheet/pub?key=0Al9obkz_TwDLdEpqcEM5bVRSc3FXczF3Vl80Wk53eEE&output=csv'
FLAGS_URL = 'https://raw.github.com/markjames/famfamfam-flag-icons/master/icons/png'

class Vocabulary(object):
	template = """\
	var vocabulary = {texts!s};
"""

	class Texts(list):
		def __str__(self):
			return json.dumps(self)

	def __init__(self):
		self.texts = Vocabulary.Texts()

	def __str__(self):
		return self.template.format(**self.__dict__)

	def feed(self, field):
		self.texts.append(field or None)

class Translation(Vocabulary):
	template = """\
			// {language} - {translator}
			case '{code}':
				return {texts!s};
"""

	def __init__(self):
		super(Translation, self).__init__()

		self.language = None
		self.code = None
		self.country = None
		self.translator = None
		self.completeness = None

	def feed(self, field):
		if self.language is None:
			self.language, self.code, self.country = (part.strip() for part in field.split('/'))
		elif self.translator is None:
			self.translator = field
		elif self.completeness is None:
			self.completeness = field
		else:
			super(Translation, self).feed(field)

source = urllib.urlopen(SPREADSHEET_URL)

vocabulary = Vocabulary()
translations = None
for ln, line in enumerate(csv.reader(source)):
	fields = [field.decode('utf-8').strip() for field in line]

	if translations is None:
		translations = [Translation() for field in fields[1:]]

	if ln > 2:
		vocabulary.feed(fields[0])

	for translation, field in itertools.izip(translations, fields[1:]):
		translation.feed(field)

source.close()

basedir = os.getcwd()
if len(sys.argv) == 2:
	basedir = os.path.abspath(sys.argv[1])

with open(os.path.join(basedir, 'vocabulary.js'), 'w') as vocabulary_file:
	vocabulary_file.write(str(vocabulary))

for translation in translations:
	with open(os.path.join(basedir, translation.code + '.js'), 'w') as translation_file:
		translation_file.write(str(translation))

with open(os.path.join(basedir, 'translators.md'), 'w') as translators_file:
	translators_file.write("""\
Translators
===========

""")

	for translation in translations:
		translators_file.write('[{0.code}]: {1}/{0.country}.png "{0.language}"\n'.format(translation, FLAGS_URL))

	translators_file.write('\n')

	for translation in translations:
		translators_file.write('![{0.language}][{0.code}] {0.translator}  \n'.format(translation))
