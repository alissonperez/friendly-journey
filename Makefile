# Database targets

migrate:
	./manage.py migrate

populate:
	./manage.py populate

initdb: migrate populate

# Local server targets

serve:
	./manage.py runserver

# Tests targets

test:
	./manage.py test

coverage:
	coverage run --source=. manage.py test
	coverage html -d .htmlcov
