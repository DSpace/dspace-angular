import json

import const
from support.dspace_proxy import rest_proxy
from support.item_checking import import_license_label
from support.logs import log, Severity


def import_license_labels():
    log('Going to import license labels.')
    # Opening JSON file
    with open('import/data/license_labels.json') as json_file:
        licenseLabelsJson = json.load(json_file)
        lic_labels = {}
        lic_respo = rest_proxy.d.api_get(const.API_URL + '/core/clarinlicenselabels?page=0&size=2000').json()
        if const.EMBEDDED in lic_respo:
            license_labels = lic_respo["_embedded"]["clarinlicenselabels"]
            for lic in license_labels:
                if lic["label"] in lic_labels:
                    log("DUPLICATE LABELS FOUND ON WEBSITE!!", Severity.WARN)
                lic_labels[lic["label"]] = lic

        for licenseLabel in licenseLabelsJson:
            if licenseLabel["label"] in lic_labels:
                log(f"License label {licenseLabel['title']} was already imported; skipping.")
                all_good = True
                check_attrs = ["id", "title", "extended"]
                original = licenseLabel
                installed = lic_labels[licenseLabel["label"]]
                for attr in check_attrs:
                    if original[attr] != installed[attr]:
                        log(f"bad value of {attr} for {licenseLabel['label']}: original {original[attr]};"
                            f" found on server: {installed[attr]}.", Severity.WARN)
                        all_good = False
                if not all_good:
                    log("incorrectly imported icense label " + str(licenseLabel), Severity.WARN)
            else:
                import_license_label(licenseLabel["id"], licenseLabel["label"], licenseLabel["title"], licenseLabel["extended"])
                log(f'License label: {licenseLabel} imported!')


