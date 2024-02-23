'use strict';
(function(window){
  function AAI() {
    var host = 'https://' + window.location.hostname,
        ourEntityID = host.match("lindat.mff.cuni.cz") ? "https://ufal-point.mff.cuni.cz" : host;
    var namespace = '';
    this.defaults = {
      //host : 'https://ufal-point.mff.cuni.cz',
      host : host, //better default (useful when testing on ufal-point-dev)
      // do not add protocol because an error will appear in the DJ dialog
      // if you see the error, your SP is not listed among djc trusted (edugain is enough to be trusted)
      responseUrl: window.location.protocol + '//lindat.mff.cuni.cz/idpdiscovery/discojuiceDiscoveryResponse.html',
      ourEntityID: ourEntityID + '/shibboleth/eduid/sp',
      serviceName: '',
      metadataFeed: host + '/xmlui/discojuice/feeds',
      selector: 'a.signon', // selector for login button
      autoInitialize: true, // auto attach DiscoJuice to DOM
      textHelpMore: "First check you are searching under the right country.\nIf your provider is not listed, please read <a href='https://lindat.mff.cuni.cz/how-do-i-sign-up' style='text-decoration: underline; font-weight: bold;'>these instructions</a> to obtain an account."
    };
    this.setup = function(options) {
      var targetUrl = '';
      var opts = jQuery.extend({}, this.defaults, options),
          defaultCallback = function(e) {
            targetUrl = opts.target + '?redirectUrl=';
            // E.g. Redirect to Item page
            var redirectUrl = window.location.href;

            // Redirection could be initiated from the login page; in that case,
            // we need to retrieve the redirect URL from the URL parameters.
            var urlParams = '';
            var redirectUrlFromLogin = '';
            var splitQMarks = window.location.href.split('?');
            if (splitQMarks.length > 1) {
              // The redirect URL is in the `1` index of the array in the Shibboleth redirect from the login page
              urlParams = new URLSearchParams(splitQMarks[1]);
              redirectUrlFromLogin = urlParams.get('redirectUrl') || null;
            }

            if (redirectUrlFromLogin != null && redirectUrlFromLogin !== '') {
              // Redirect from the login page with retrieved redirect URL
              redirectUrl = window.location.origin + (namespace === '' ? namespace : '/' + namespace) + redirectUrlFromLogin;
            }

            // Encode the redirect URL
            targetUrl += window.encodeURIComponent(redirectUrl);
            window.location = opts.host + opts.port + '/Shibboleth.sso/Login?SAMLDS=1&target=' + targetUrl + '&entityID=' + window.encodeURIComponent(e.entityID);
          };
      //console.log(opts);
      if(!opts.target){
        throw 'You need to set the \'target\' parameter.';
      }
      // call disco juice setup
      if (!opts.autoInitialize || opts.selector.length > 0) {
        var djc = DiscoJuice.Hosted.getConfig(
          opts.serviceName,
          opts.ourEntityID,
          opts.responseUrl,
          [ ],
          opts.host + opts.port + '/Shibboleth.sso/Login?SAMLDS=1&target=' + targetUrl + '&entityID=');
        djc.discoPath = window.location.origin + (namespace === '' ? namespace : '/' + namespace) + "/assets/";
        djc.metadata = [opts.metadataFeed];
        djc.subtitle = "Login via Your home institution (e.g. university)";
        djc.textHelp = opts.textHelp;
        djc.textHelpMore = opts.textHelpMore;

        djc.inlinemetadata = typeof opts.inlinemetadata === 'object' ? opts.inlinemetadata : [];
        djc.inlinemetadata.push({
          'country': '_all_',
          'entityID': 'https://idm.clarin.eu',
          'geo': {'lat': 51.833298, 'lon': 5.866699},
          'title': 'Clarin.eu website account',
          'weight': 1000
        });
        djc.inlinemetadata.push({
          'country': 'CZ',
          'entityID': 'https://cas.cuni.cz/idp/shibboleth',
          'geo': {'lat': '50.0705102', 'lon': '14.4198844'},
          'title': 'Univerzita Karlova v Praze',
          'weight': -1000
        });

        if(opts.localauth) {
          djc.inlinemetadata.push(
            {
              'entityID': 'local://',
              'auth': 'local',
              'title': 'Local authentication',
              'country': '_all_',
              'geo': null,
              'weight': 1000
            });
          djc.callback = function(e){
            var auth = e.auth || null;
            switch(auth) {
              case 'local':
                // DiscoJuice.UI.setScreen(opts.localauth);
                // jQuery('input#login').focus();
                // Use cookie to toggle discojuice popup.
                setCookie('SHOW_DISCOJUICE_POPUP', false, 1)
                window.location = window.location.origin + (namespace === '' ? namespace : '/' + namespace) + "/login?redirectUrl=" + window.location.href;
                break;
              //case 'saml':
              default:
                defaultCallback(e);
                break;
            }
          };
        }

        if (opts.callback && typeof opts.callback === 'function') {
          djc.callback = function(e) {
            opts.callback(e, opts, defaultCallback);
          };
        }

        if (opts.autoInitialize) {
          jQuery(opts.selector).DiscoJuice( djc );
        }

        return djc;
      } //if jQuery(selector)
    };

    // Set a cookie
    function setCookie(name, value, daysToExpire) {
      var expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + daysToExpire);

      var cookieString = name + '=' + value + ';expires=' + expirationDate.toUTCString() + ';path=/';
      document.cookie = cookieString;
    }
  }

  if (!window.aai) {
    window.aai = new AAI();
  }
})(window);
