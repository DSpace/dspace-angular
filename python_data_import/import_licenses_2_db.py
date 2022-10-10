import json

import const
from support.dspace_proxy import rest_proxy
from support.item_checking import import_license
from support.logs import log


def import_licenses():
    log('Going to import licenses.')
    # Opening JSON file
    with open('import/data/license_definitions_v2.json') as json_file:
        license_definitions = json.load(json_file)
        lic_def = []
        lic_respo = rest_proxy.d.api_get(const.API_URL + '/core/clarinlicenses?page=0&size=2000').json()
        if const.EMBEDDED in lic_respo:
            licenses = lic_respo["_embedded"]["clarinlicenses"]
            for lic in licenses:
                lic_def.append(lic["definition"])
        for lic in license_definitions:
            if lic["definition"] in lic_def:
                log(lic["definition"] + " was already imported; skipping.")
                continue
            else:
                import_license(lic["name"], lic["definition"], lic["labelId"], lic["confirmation"], lic["requiredInfo"])

