$(function() {
  $('<a #xD id="license-text"">OPEN License Selector</a>').appendTo('body').licenseSelector({
    licenses: {
      'pcedt2': {
        name: 'CC-BY-NC-SA + LDC99T42',
        available: true,
        url: 'https://lindat.mff.cuni.cz/repository/xmlui/page/license-pcedt2',
        description: 'License Agreement for Prague Czech English Dependency Treebank 2.0',
        categories: ['data', 'by', 'nc', 'sa'],
      },
      'cnc': {
        name: 'Czech National Corpus (Shuffled Corpus Data)',
        available: true,
        url: 'https://lindat.mff.cuni.cz/repository/xmlui/page/license-cnc',
        description: 'License Agreement for the CNC',
        categories: ['data'],
      },
      'hamledt': {
        name: 'HamleDT 1.0 Licence Agreement',
        available: true,
        url: 'https://lindat.mff.cuni.cz/repository/xmlui/page/licence-hamledt',
        description: 'License Agreement for the HamleDT 1.0',
        categories: ['data'],
      },
      'hamledt-2.0': {
        name: 'HamleDT 2.0 Licence Agreement',
        available: false,
        url: 'https://lindat.mff.cuni.cz/repository/xmlui/page/licence-hamledt-2.0',
        description: 'HamleDT 2.0 License Agreement',
        categories: ['data'],
      },
      'pdt2': {
        name: 'PDT 2.0 License',
        available: true,
        url: 'https://lindat.mff.cuni.cz/repository/xmlui/page/license-pdt2',
        description: 'Prague Dependency Treebank, version 2.0 License Agreement',
        categories: ['data'],
      },
      'pdtsl': {
        name: 'PDTSL',
        available: true,
        url: 'https://lindat.mff.cuni.cz/repository/xmlui/page/licence-pdtsl',
        description: 'Research-Usage License Agreement for the PDTSL',
        categories: ['data'],
      },
      'apache-2': {
        url: 'http://www.apache.org/licenses/LICENSE-2.0',
      },
      'perl-artistic-2': {
        url: 'http://opensource.org/licenses/Artistic-2.0',
      },
      'test-1': {
        url: 'http://www.google.com',
      }
    },
    showLabels : true,
    onLicenseSelected: function (license) {
    var selectedLic = license["url"];
    var allLic = $("#aspect_submission_StepTransformer_list_license-list li a");
    for (var i = 0; i < allLic.length; i++) {
      if (allLic[i].href == selectedLic) {
        var id = allLic[i].name.replace("license_", "");
        document.getElementById('secret-selected-license-from-license-selector').value = id;
        $("#aspect_submission_StepTransformer_item_license-not-supported-message").addClass("hidden");
        document.getElementById('secret-change-button').click();
        return;
      }
    }
    $("#aspect_submission_StepTransformer_item_license-not-supported-message").removeClass("hidden");
      document.getElementById('secret-change-button').click();
  }

  })

});

// class="btn btn-repository licenseselector bold btn-block btn-lg
