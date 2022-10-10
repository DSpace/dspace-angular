import sys
sys.path.insert(1, 'lib')
from support import logs

orig = logs.write_to_console

logs.write_to_console = True

import import_license_labels_2_db
import import_licenses_2_db

import_license_labels_2_db.import_license_labels()
import_licenses_2_db.import_licenses()

logs.write_to_console = orig
